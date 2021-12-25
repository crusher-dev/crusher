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
import { recordStep } from '../store/actions/recorder';
import { ActionStatusEnum } from '@shared/lib/runnerLog/interface';

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

        this.window.on('focus', () => this.window.webContents.send('focus'))
        this.window.on('blur', () => this.window.webContents.send('blur'))

        /* Loads crusher app */
        this.window.loadURL(encodePathAsUrl(__dirname, 'index.html'))
    }

    private async handlePerformAction(event: Electron.IpcMainInvokeEvent, payload: { action: iAction }) {
        console.log("Payload is", payload);
        const { action } = payload;
        switch(action.type) {
            case ActionsInTestEnum.SET_DEVICE: {
                // Custom implementation here, because we are in the recorder
                if(this.webView) {
                    this.webView.webContents.setUserAgent(action.payload.meta.userAgent);
                }
                app.userAgentFallback = action.payload.meta.userAgent;
                this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
                console.log("Dispatched here");
                return;
            }
            case ActionsInTestEnum.NAVIGATE_URL: {
                await this.webView.playwrightInstance.runActions([action]);
            }
        }
    }

    async handleWebviewAttached(event, webContents) {
        this.webView = new WebView(this);
        this.webView.webContents.on("dom-ready", () => {
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