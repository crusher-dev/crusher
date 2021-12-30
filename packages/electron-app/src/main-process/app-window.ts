import { app, BrowserWindow, ipcMain, session } from 'electron';
import windowStateKeeper from 'electron-window-state';
import * as path from "path";
import { APP_NAME } from '../../config/about';
import { encodePathAsUrl, getAppIconPath } from '../utils';
import { Emitter, Disposable } from "event-kit";
import { now } from './now';
import { AnyAction, Store } from 'redux';
import { Recorder } from './recorder';
import { WebView } from './webview';
import { iAction } from '@shared/types/action';
import { ActionsInTestEnum } from '@shared/constants/recordedActions';
import { iDevice } from '@shared/types/extension/device';
import { recordStep, resetRecorderState, setInspectMode, setIsTestVerified, updateCurrentRunningStepStatus, updateRecordedStep, updateRecorderState } from '../store/actions/recorder';
import { ActionStatusEnum } from '@shared/lib/runnerLog/interface';
import { getSavedSteps } from '../store/selectors/recorder';
import { CrusherTests } from '../lib/tests';
import { getBrowserActions, getMainActions } from 'runner-utils/src';
import { iElementInfo, TRecorderState } from '../store/reducers/recorder';
import { iSeoMetaInformationMeta } from '../types';
import { getUserAgentFromName } from '@shared/constants/userAgents';

export class AppWindow {
    private window: Electron.BrowserWindow;
    private recorder: Recorder
    private webView: WebView;
    private emitter = new Emitter()

    private store: Store<unknown, AnyAction>;

    private _loadTime: number | null = null
    private _rendererReadyTime: number | null = null

    private minWidth = 1600;
    private minHeight = 900;

    private shouldMaximizeOnShow = false

    public constructor(store: Store<unknown, AnyAction>) {
        const savedWindowState = windowStateKeeper({
            defaultWidth: this.minWidth,
            defaultHeight: this.minHeight,
            maximize: false,
        });
        this.recorder = new Recorder(store);
        this.store = store;

        const windowOptions: Electron.BrowserWindowConstructorOptions = {
            title: APP_NAME,
            x: savedWindowState.x,
            y: savedWindowState.y,
            width: savedWindowState.width,
            height: savedWindowState.height,
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            show: true,
            icon: getAppIconPath(),
            // This fixes subpixel aliasing on Windows
            // See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
            backgroundColor: '#fff',
            webPreferences: {
              // Disable auxclick event
              // See https://developers.google.com/web/updates/2016/10/auxclick
              nodeIntegration: true,
              enableRemoteModule: true,
              spellcheck: true,
              worldSafeExecuteJavaScript: false,
              contextIsolation: false,

              webviewTag: true,
              webSecurity: false,
              nativeWindowOpen: true,
              devTools: true,
            },
            acceptFirstMouse: true,
        };

        this.window = new BrowserWindow(windowOptions);
    }

    public load() {
        let startLoad = 0;

        this.window.webContents.once('did-start-loading', () => {
            this._rendererReadyTime = null
            this._loadTime = null
      
            startLoad = now();
        });

        this.window.webContents.once('did-finish-load', () => {
            if (process.env.NODE_ENV === 'development') {
              this.window.webContents.openDevTools()
            }
      
            this._loadTime = now() - startLoad
      
            this.maybeEmitDidLoad()
        });

        // Disable zoom-in/zoom-out
        this.window.webContents.on('did-finish-load', () => {
            this.window.webContents.setVisualZoomLevelLimits(1, 1)
        });

        this.window.webContents.on('did-fail-load', () => {
            this.window.webContents.openDevTools()
            this.window.show()
        });

        this.window.webContents.on("did-attach-webview", this.handleWebviewAttached.bind(this));

        ipcMain.once(
            'renderer-ready',
            (event: Electron.IpcMainEvent, readyTime: number) => {
              this._rendererReadyTime = readyTime
      
              this.maybeEmitDidLoad()
            }
        )

        ipcMain.handle('perform-action', this.handlePerformAction.bind(this));
        ipcMain.handle('turn-on-recorder-inspect-mode', this.turnOnInspectMode.bind(this))
        ipcMain.handle('turn-off-recorder-inspect-mode', this.turnOffInspectMode.bind(this))
        ipcMain.handle('verify-test', this.handleVerifyTest.bind(this));
        ipcMain.handle('replay-test', this.handleReplayTest.bind(this));
        ipcMain.handle('save-test', this.handleSaveTest.bind(this));
        ipcMain.handle('go-back-page', this.handleGoBackPage.bind(this));
        ipcMain.handle('reload-page', this.handleReloadPage.bind(this));
        ipcMain.handle('get-page-seo-info', this.handleGetPageSeoInfo.bind(this));
        ipcMain.handle('get-element-assert-info', this.handleGetElementAssertInfo.bind(this));

        this.window.on('focus', () => this.window.webContents.send('focus'))
        this.window.on('blur', () => this.window.webContents.send('blur'))

        /* Loads crusher app */
        this.window.loadURL(encodePathAsUrl(__dirname, 'index.html'));
    }

    async handleGetElementAssertInfo(event: Electron.IpcMainEvent, elementInfo: iElementInfo) {
        const elementHandle = this.webView.playwrightInstance.getElementHandleFromUniqueId(elementInfo.uniqueElementId);
        if(!elementHandle) {
            return null;
        }
        const attributes = await elementHandle.evaluate((element, args) => {
            const attributeNamesArr: Array<string> = (element as HTMLElement).getAttributeNames();
            return attributeNamesArr.map(attributeName => {
                return {
                    name: attributeName,
                    value: (element as HTMLElement).getAttribute(attributeName),
                };
            });
        });
    
        return {
            innerHTML: await elementHandle.innerHTML(),
            attributes: attributes,
        }
    }

    async handleGetPageSeoInfo(event: Electron.IpcMainEvent, url: string) {
        return {
            title: await this.webView.playwrightInstance.page.title(),
            metaTags: await this.webView.playwrightInstance.page.evaluate(() => {
                const metaTags = document.querySelectorAll('meta');
                return Array.from(metaTags).map(meta => {
                    return {
                        name: meta.getAttribute('name'),
                        value: meta.content
                    };
                }).filter(a => !!a.name).reduce((prev, current) => {
                    if (current.name) {
                        prev[current.name] = current;
                    }
                    return prev;
                }, {});
            }) as iSeoMetaInformationMeta
        }
    }

    async handleGoBackPage() {
        /* Todo: Add wait for this, and keep track of the back page */
        this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {  }));
        this.webView.webContents.goBack();
        this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {  }));
    }

    async handleReloadPage() {
        this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {  }));
        const savedSteps = getSavedSteps(this.store.getState() as any);

        this.store.dispatch(recordStep({
            type: ActionsInTestEnum.RELOAD_PAGE,
            payload: {}
        }));

        this.webView.webContents.reload();

        await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: 'networkidle' });

        /* Change this to back */
        this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.COMPLETED));

        this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {  }));
    }

    async handleSaveTest() {
        const recordedSteps = getSavedSteps(this.store.getState() as any);

        await CrusherTests.saveTest(recordedSteps as any);     
    }

    async handleVerifyTest() {
        await this.handleReplayTest();
        this.store.dispatch(setIsTestVerified(true));
    }

    async hanldeRemoteReplayTest(testId: number) {
        this.resetRecorder();
        const testSteps = await CrusherTests.getTest(`${testId}`);
        const replayableTestSteps = await CrusherTests.getReplayableTestActions(testSteps, true);

        this.handleReplayTest(replayableTestSteps);
    }

    async handleReplayTest(steps: Array<iAction> | null = null) {
        const stepsToVerify = steps ? steps : getSavedSteps(this.store.getState() as any);

        await this.resetRecorder();
        this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {  }));
    
        const replayableTestSteps = await CrusherTests.getReplayableTestActions(stepsToVerify as any, true);
        const browserActions = getBrowserActions(replayableTestSteps);
        
        for(let browserAction of browserActions) {
            if(browserAction.type === ActionsInTestEnum.SET_DEVICE) {
                await this.handlePerformAction(null, { action: browserAction, shouldNotSave: false });
            } else {
                if(browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
                    // @Todo: Add support for future browser actions
                    this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
                } else {
                    await this.handleRunAfterTest(browserAction);
                }
            }
        }
    

        for(let savedStep of getMainActions(replayableTestSteps)) {
            await this.handlePerformAction(null, { action: savedStep });
        }
    
        this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
    }

    private turnOnInspectMode() {
        this.store.dispatch(setInspectMode(true));
        this.webView._turnOnInspectMode();
        this.webView.webContents.focus();
    }

    private turnOffInspectMode() {
        this.store.dispatch(setInspectMode(false));
        this.webView._turnOffInspectMode();
        this.webView.webContents.focus();
    }

    private async clearWebViewStorage() {
       return session.fromPartition("crusherwebview").clearStorageData({
            storages: ["cookies", "localstorage", "indexdb"],
        });
    }

    private async handlePerformAction(event: Electron.IpcMainInvokeEvent, payload: { action: iAction, shouldNotSave?: boolean }) {
        const { action, shouldNotSave } = payload;
        this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {action: action}));
        switch(action.type) {
            case ActionsInTestEnum.SET_DEVICE: {
                // Custom implementation here, because we are in the recorder
                const userAgent = action.payload.meta?.device.userAgentRaw ? action.payload.meta?.device.userAgentRaw : getUserAgentFromName(action.payload.meta?.device.userAgent).value;
                if(this.webView) {
                    this.webView.webContents.setUserAgent(userAgent);
                }
                app.userAgentFallback = userAgent;

                if(!shouldNotSave) {
                    this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
                }
                break;
            }
            case ActionsInTestEnum.NAVIGATE_URL: {
                await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
                break;
            }
            case ActionsInTestEnum.RUN_AFTER_TEST: {
                await this.resetRecorder();
                await this.handleRunAfterTest(action);
                break;
            }
            case ActionsInTestEnum.RELOAD_PAGE: {
                this.webView.webContents.reload();
                await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: 'networkidle' });
                if(!shouldNotSave) {
                    this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
                }
                break;
            }
            default:
                console.log("Running this action", action);
                await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
                break;
        }
        this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
    }

    private async resetRecorder() {
        this.store.dispatch(resetRecorderState());
        await this.clearWebViewStorage();
    }

    private async handleRunAfterTest(action: iAction)  {
        this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, { type: ActionsInTestEnum.RUN_AFTER_TEST, testId: action.payload.meta.value }));
    
        const replayableTestSteps = await CrusherTests.getReplayableTestActions(await CrusherTests.getTest(action.payload.meta.value), true);
        const browserActions = getBrowserActions(replayableTestSteps);
        
        for(let browserAction of browserActions) {
            if(browserAction.type === ActionsInTestEnum.SET_DEVICE) {
                await this.handlePerformAction(null, { action: browserAction, shouldNotSave: false });
            } else {
                if(browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
                    this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
                }
            }
        }

        this.store.dispatch(recordStep(action, ActionStatusEnum.STARTED));

        for(let savedStep of getMainActions(replayableTestSteps)) {
            await this.handlePerformAction(null, { action: savedStep, shouldNotSave: true });
        }

        const savedSteps = getSavedSteps(this.store.getState() as any);
        this.store.dispatch(updateRecordedStep(action, savedSteps.length - 1));
        this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
    }

    async handleWebviewAttached(event, webContents) {
        this.webView = new WebView(this);
        this.webView.webContents.once("dom-ready", () => {
            this.webView.initialize();
            console.log("Webview initialized");
        });
	}

    public getRecorder() {
        return this.recorder;
    }

    public focusWebView(): Promise<void> {
        return this.window.webContents.executeJavaScript("document.querySelector('webview').focus();");
    }

    public sendMessage(channel: string, ...args: any[]): void {
        return this.window.webContents.send(channel, ...args);
    }

    /** Send the app launch timing stats to the renderer. */
    public sendLaunchTimingStats(stats: {mainReadyTime: number; loadTime: number; rendererReadyTime: number}) {
        this.window.webContents.send('launch-timing-stats', { stats })
    }


    /**
     * Emit the `onDidLoad` event if the page has loaded and the renderer has
     * signalled that it's ready.
     */
    private maybeEmitDidLoad() {
        if (!this.rendererLoaded) {
        return
        }

        this.emitter.emit('did-load', null)
    }

    private get rendererLoaded(): boolean {
        console.log("Checked renderer loaded", this.loadTime, this.rendererReadyTime);
        return !!this.loadTime && !!this.rendererReadyTime
    }

    /**
     * Get the time (in milliseconds) spent loading the page.
     *
     * This will be `null` until `onDidLoad` is called.
     */
    public get loadTime(): number | null {
        return this._loadTime
    }

    /**
     * Get the time (in milliseconds) elapsed from the renderer being loaded to it
     * signaling it was ready.
     *
     * This will be `null` until `onDidLoad` is called.
     */
    public get rendererReadyTime(): number | null {
        return this._rendererReadyTime
    }

    public isMinimized() {
      return this.window.isMinimized()
    }
    
    /** Is the window currently visible? */
    public isVisible() {
      return this.window.isVisible()
    }
    
    public restore() {
      this.window.restore()
    }
    
    public focus() {
      this.window.focus()
    }

    /** Show the window. */
    public show() {
        this.window.show()
        if (this.shouldMaximizeOnShow) {
        // Only maximize the window the first time it's shown, not every time.
        // Otherwise, it causes the problem described in desktop/desktop#11590
        this.shouldMaximizeOnShow = false
        this.window.maximize()
        }
    }

    /**
     * Register a function to call when the window is done loading. At that point
     * the page has loaded and the renderer has signalled that it is ready.
     */
    public onDidLoad(fn: () => void): Disposable {
        return this.emitter.on('did-load', fn)
    }

    public onClose(fn: () => void) {
        this.window.on('closed', fn)
    }
    
    public destroy() {
        this.window.destroy();
    }
}