import { app, BrowserWindow, ipcMain, session, shell, webContents, webFrame, webFrameMain } from "electron";
import windowStateKeeper from "electron-window-state";
import * as path from "path";
import { APP_NAME } from "../../config/about";
import { encodePathAsUrl, getAppIconPath, getUserAccountTests, getUserInfoFromToken, sleep } from "../utils";
import { Emitter, Disposable } from "event-kit";
import { now } from "./now";
import { AnyAction, Store } from "redux";
import { Recorder } from "./recorder";
import { WebView } from "./webview";
import { iAction } from "@shared/types/action";
import { ActionsInTestEnum, ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { iDevice } from "@shared/types/extension/device";
import {
	recordStep,
	resetRecorderState,
	setDevice,
	setInspectElementSelectorMode,
	setInspectMode,
	setIsTestVerified,
	setSiteUrl,
	updateCurrentRunningStepStatus,
	updateRecordedStep,
	updateRecorderCrashState,
	updateRecorderState,
} from "../store/actions/recorder";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { getRecorderInfo, getRecorderState, getSavedSteps } from "../store/selectors/recorder";
import { CrusherTests } from "../lib/tests";
import { getBrowserActions, getMainActions } from "runner-utils/src";
import { iElementInfo, TRecorderState } from "../store/reducers/recorder";
import { iSeoMetaInformationMeta } from "../types";
import { getUserAgentFromName } from "@shared/constants/userAgents";
import { getAppEditingSessionMeta, getAppSessionMeta, getAppSettings, getRemainingSteps, getUserAccountInfo } from "../store/selectors/app";
import { resetAppSession, setSessionInfoMeta, setUserAccountInfo } from "../store/actions/app";
import { resolveToBackendPath, resolveToFrontEndPath } from "@shared/utils/url";
import { getGlobalAppConfig, writeGlobalAppConfig } from "../lib/global-config";
import template from "@crusher-shared/utils/templateString";
import * as fs from "fs";
import { ILoggerReducer } from "../store/reducers/logger";
import { clearLogs, recordLog } from "../store/actions/logger";
import axios from "axios";
import { identify } from "../lib/analytics";

const debug = require("debug")("crusher:main");
export class AppWindow {
	private window: Electron.BrowserWindow;
	private splashWindow: Electron.BrowserWindow;
	private recorder: Recorder;
	private webView: WebView;
	private emitter = new Emitter();

	private store: Store<unknown, AnyAction>;

	private _loadTime: number | null = null;
	private _rendererReadyTime: number | null = null;

	private minWidth = 1000;
	private minHeight = 600;
	private savedWindowState: any = null;

	private shouldMaximizeOnShow = true;
	private useAdvancedSelectorPicker = false;

	public getWebContents() {
		return this.window.webContents;
	}

	public constructor(store: Store<unknown, AnyAction>) {
		debug("Constructor called");
		this.savedWindowState = windowStateKeeper({
			maximize: true,
		});
		this.recorder = new Recorder(store);
		this.store = store;

		const windowOptions: Electron.BrowserWindowConstructorOptions = {
			title: APP_NAME,
			x: this.savedWindowState.x,
			y: this.savedWindowState.y,
			width: this.savedWindowState.width,
			titleBarStyle: "hidden",
			trafficLightPosition: { x: 10, y: 8 },
			height: this.savedWindowState.height,
			minWidth: this.minWidth,
			minHeight: this.minHeight,
			autoHideMenuBar: true,
			show: false,
			frame: false,
			icon: getAppIconPath(),
			// This fixes subpixel aliasing on Windows
			// See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
			backgroundColor: "#111213",
			webPreferences: {
				// Disable auxclick event
				// See https://developers.google.com/web/updates/2016/10/auxclick
				nodeIntegration: true,
				enableRemoteModule: true,
				spellcheck: true,
				worldSafeExecuteJavaScript: false,
				contextIsolation: false,
				webviewTag: true,
				nodeIntegrationInSubFrames: true,
				webSecurity: false,
				nativeWindowOpen: true,
				devTools: true,
				enablePreferredSizeMode: true,
			},
			acceptFirstMouse: true,
		};

		this.window = new BrowserWindow(windowOptions);

		this.savedWindowState.manage(this.window);
		this.splashWindow = new BrowserWindow({
			title: APP_NAME,
			x: this.savedWindowState.x,
			y: this.savedWindowState.y,
			autoHideMenuBar: true,
			show:true,
			frame: false,
			icon: getAppIconPath(),
			// This fixes subpixel aliasing on Windows
			// See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
			backgroundColor: "#111213",
			hasShadow: false,
			webPreferences: {
				nativeWindowOpen: true,
				enablePreferredSizeMode: true,
			}
		});

		this.splashWindow.loadURL("data:text/html,%3Chtml%20style%3D%22width%3A%20100vw%3B%20height%3A%20100vh%3B%22%3E%3Cbody%20style%3D%22width%3A%20100vw%3B%20height%3A%20100vh%3B%20overflow%3A%20hidden%3B%22%3E%0A%3Cimg%20style%3D%22width%3A%20240px%3B%20height%3A%2055.88px%3B%20position%3A%20absolute%3B%20top%3A%2050%25%3B%20transform%3A%20translateX(-50%25)%20translateY(-50%25)%3B%20left%3A%2050%25%3B%22%20src%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAqgAAACcCAYAAACzzFnOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAB60SURBVHgB7d1LjBzXdcbxc5sUJXkRt2xvbCBW01kkiAJwaHknBRoCVrYcLuJlpodaZBVwCIWTJZtLDi1oCGTjABF7VgHiBckgOxlQE0h2jjUE4sAGErMdA8nGgcYbP0RN35xTVU0NyXn0dN9bdavq%2FwMKPe%2FpR3XVV%2Be%2BnAS03vfdMyLL3smyc%2FKqeFnSL3eLDfGNvW56%2B1Cf%2B0d6%2B%2BDW0O0IAABAjThZkIXSF0RW9S%2Bt6B9bFqRmrBcMo85Etm8O3UgAAAASN3dA%2FZu%2B7%2B05GXRELgoV0roY6zbYvOO2BQAAIFEnDqhZM35HrmsT8rqgrsZCUAUAAIk6UUDdeMevykS2hIppI2jT%2F1Cb%2Fm9o0%2F9YAAAAEjFTQKVq2mhj7%2BUSg6kAAEAqjg2o1tdUK2139cMlQXN5ubo5dFsCAABQsSMDahFOP9IPe4LmczLY%2FMDdEAAAgAodGlAJpy1FSAUAABU7MKBmfU6dfCyE07bqM8IfAABUpXPQF7MBUYTTNtuyCroAAABU4LmAeq3v%2B4zWb71uMTAOAACgdE8FVKuaOZdVT4ElvVgZCAAAQMmeCqi2dKnQtI%2BCXqxcoakfAACU7UlAtSCin6wK8LnupENFHQAAlOtJQC2qp8BTnJe%2BzeogAAAAJckCKtVTHOUFYdAcAAAoTxZQJyLLAhzC%2BqIKAABASfImfkf1FEfqvtv3ywIAAFCCjvUvdFRQcYzTIisCAABQgs4pwilmMHFyTgAAAErQ6RBQMQOq7AAAoCwdoTKGGTFpPwAAKMNp3ZjjErPJL2bGAgAI4lrf9yXwCo63hm4gQM2ddixtihlNvLwiAIBwnKxG6EI1EKDmbJopKqiYVU8AAAAi6wgAAACQEAIqAAAAkkJABQAAQFIIqAAAAEjKaQHQeDaHrRdZ0u1VcXLWOb312aC3AwdJ%2Bs%2BnE3uonzzq2K1%2B7ebQjQUAgMgIqEADrfd99wWRVW0jWXJeln0xA4Ob%2FoA%2F%2Bvf3TT%2B3bJ9Mf3xjzY%2F18x0%2FkZF%2B%2BuDW0O0IAACBEVCBhrBQeqYjV7wG0ifzKnoJrWeVV63ArtgnFli9k5GbyP3NobsnAAAEQEAFak6b75cnTq5nodTvq5KWo6cV2r7%2B076G1V0Nq%2Fc6E9m%2BOXQjAQBgTgRUoKZsiUStZF635vuSQ%2BlhuhZWfR5WxxqWr1JVBQDMg4AK1Mw0mEraK3vZoKwrektABQCcGAEVqImnmvIBAGgwAiqQuGLw03XvZT2RpnwAAKIioAIJs6qpd3KnmLMUAIBWiBJQv%2FGHuv2RyCtfPv5nf%2FZT3X4i8sn%2FSensfr72TZGXXpYgpo%2Fhk1%2Fm2%2F%2F8QuS3vxZgLhuXvVVNBwIAQMsED6jfvijy9sXZf%2F5bb%2Ba3FugsqP77x3lojRXsXvqCyJ%2B%2BLfL6GxqgvyLRZUH1v0V%2B%2FHF1QRz1kk2y7%2BSuVk2XBQCAFgoaUC30nSSc7mdh8fU3881YmLMK5I9%2FlAfWRVgo%2FQOtlr75dl7ZLZM9LtusUmvs8VhY%2Fbd%2FFeA52ZKkTj6StEfoAwAQVfCAGooFSdssVBoLrNMqpAXXmf5G0YT%2FrTfykJoCuz%2B2WZD%2F8D5BFZ8jnAIAkAsaUL8Uscl8GljNUc3m0yb8186LfPXrkiyrqn7nHYIqcoRTAAA%2BV8tR%2FPubzX%2F4LyLf%2F%2BDz71nF9dtzdjOowjSoWhcEC6r0UW0fwikAAE%2FrCJJgfW%2F%2F8m9E%2Fvi8oEUIpwAAPI%2BAmhCrpq7%2B1fwDzVA%2F3kbrE04BAHgKATVB1kXhO5fTGdiFODYu%2B%2Ff1ZkkAAMBTCKiJypr8NwipTXWt7%2FviZV0AAMBzCKgJ%2B9rXCalNZP1OnZP3BQAAHIiAmrhpSEVzTJzc0ZuuAACAAxFQa8BCqvVJRf1Z074TljAFAOAotZwHtY2sT6rNkWpzpaKeiimlrktadr2Xsd7u7P%2Bihuiu1825bBAX1V4AQKkIqDVio%2Fv%2F6yciP%2FupoIb2nAw61U8pteu8bH8mMtrTbWvodo%2F7BQvW%2BvNLp0RWNLm%2BJUyLBQCIjIBaM3%2FxVyK3r7PiVN1k1VORVamIVklHE5Eb7w3dSE7o5tCN9ca2e%2FZ51k0hrwT3BACACOiDWjMvfyFfGhX1YtVTqYAF0z0vF24N3YV5wulB9G8NN%2B%2B4s%2Fq31yQPrgAABEVAraFv%2FJHIm28LasKqp53yq6e74uVqyGD6rH1B9YYAABAQAbWmrD8q86PWQwXV07GGxgubQ7clJdCgOtD%2Fd16opgIAAqEPak1ZU%2F%2BfaUj9p38QJKyCvqc7zsulzbzfaGk0pO7oY73gnXwk9E1FDaz3fffFZ2aouFny%2Bwb1YMfx%2FZ%2Bzn5SDgFpjb2gz%2F7%2F%2FiFH9KZuILDspzc6nWjmdZWR%2BDHbQtpA6cXJXH%2FOSNMizJyjzO5Hdqp5rzKYIoUv6Pjyn7YVLevE2nTatZ9%2F3z%2Fz8xtqTr4z1o7Fzsusn8tDZhZ9ubQkmbdvfA%2B0nI22SfqjP0w7HhaPNun8RUGvuba2ifm9TkChX3rynY6ucVn1gtBO4HuwvnHHysdSUHjyX7UTlOrIs%2BYmq5w%2F4uTOSzWiwZn1xBcmwsPGCtVo4WbFFMey1yy4S%2FYn%2BTM9ZOPHZe3hl%2BusaTMb6x3b0k3v6fnvQhMBq%2B7vvZNPHLR23vxfBbMfnfdwfaCAb3YzUxz22rHWrI6veZ0WEIPuJ%2FWp2XFjzI9tH9Pm53%2FZq6yLHUwJqzdmAqW%2F8IVXUFOmbLXszSnw2t%2BmFVA6EFpKz5n45eTjXA%2FtHLuBzZtWNW3fcheN%2BzkLNmY5c0ZOVnWSW5jhRHSoLAPnytsHo%2FdzSA%2FltCagu9%2FMw2YlQLwgjr9RmYaSntyv6XFlg29HHOKxbECmeKwvwq7Ygxwn39fz94bJQd12fg119Lu51JrKdeljdf%2FHiJQtMEqOFK9sH8%2Bdny8Kqfm4DSrelZHU%2FnhJQG4AqarL6Uo711E6ORSX1qpxQcTDtSSCznHyuveOvuIkM9ADajdgdoydhvSJx9CSsWPfziWkw9eV2p5la0srZ1pMg4uX25tDdk0RlF81O3g%2F8XHX1cfc1pPbtOeh4WUvteDQNTPoeX5eSV8YrLpiWNcgP9HZQZlCt%2B%2FGUgNoAVFETla%2B6FPdfaPVGTwalX5nPIvV%2BWHaydlYxnDSrv2xbFKHjulZp1isIps8pqmZDSdTGZX9dQ8NAIsqayp080v%2B1tfmBO%2FEFagz7A5NUq6fbsIqgWoYYx1MCakO89k0CakqK0ftlBB%2FmIJ3Dk5OWVH7Swhyy95fNGOFL6UIzq3GKoSNr1nZyV5%2BrZSmLXjRoEFupsuuR7SNaWb%2Bj7%2FNlSUtPt%2BG1y365M5EbTeijGut4yjyoDfH6G8yLmpLPSginRfV0LDgRqyTpwdTmiCWc1pBVanw%2BCK8naRlIYiyk2YDFyP1yD5NdRBw0Yju2jb63PsJVPe6ZFN0iKnl%2BQop5PCWgNoTNi%2FqtNwSJ6JRzYKR6ekJlNHMinqIZ0ebaTe3iIrnq6ZMqc7VBPrsPVsWVkmTvcasY1%2BMC1J6fjy1QSw3FPp4SUBvktfOCVDg5JxF5z%2FQlJ0U4rTcLXC7d4DGQhFggTGjRjN4L%2BesWXU3f410L1BtrflVqpIznmoDaIDZY6mtfFyQg9kT1ncDTATVdVqEgnNZawquUJVc9PdPJjg89SYQ1tet7cF0iasAF6PDdvl%2BWGijreEpAbRiqqNUrmrOiVnl%2B5%2BWBYCZZHy8n7wtqKwsfaYZTM5DUeEmvydjJ9Vj9LW2QThMuQE9pJTX1PqllHk8JqA1j002hWi9Grp5q8%2F6IpfRmt%2BeyE1dPUEvZCTHd8JHkyP1EdScRWn6yrh%2F5IJ0msK4Zd8vss3tSZR5PCagNY838jOav1meRq6e23rNgVr2OrRyD2ipOiKkaCGZmTf0hm7H39bVtkiWb31fSVOrxlIDaQIzmr5aLfXXZvAMycCALIHqSir7gxZyons7htITrflAEuZ7E5mWsLVe2rO3INvtcYvKyXiyV3WpM1N9AX%2F19QYVc5ArqZ15%2BJUALvJCHmZ7EYsFDngobXeey%2FzfLe3ggODGteK7qhcdg0W5K2TRa%2BdKlUWRBVGT7sci9g%2B6rXTyd0orwKdtHXYSqYt7P89h175uMgNpAtqrU9z8QNNRpiXz1DiTCdeSihsjQdjV83NbgsXVYSLLwY4ttFOHDKri9Z36E6un8LNhZdXAkC8hWiZLwLJhORG68N3Sjo36u2Hfu2ab7y6C4P8sSyLQ7xHH3o8kIqA1kk%2Fa%2F8mWRT%2F5PUIHYTfzMf4rWCL8859iW39w85j1UvMdsswAiFhQ0VPX3VcoGgrkVzfwjmZMGwmUfYTEU3Tdu675x4qpssb9c0Gb5gVbgg%2FUf7eR%2FayQtRR%2FUhrLBUgBQV0UfvNDdZQbzXOBZFUuDS18DzNksxDSlepr3pSx9RhDvFutXvOf0YiEwe11vzhFO97s1dAOtwAZb4S%2F0oLK6oYLaUDZh%2F7%2F9qwBALWkza%2B%2BUhKXhYaEZMIpwG3XC%2Bai83NPK4%2F3Hkk1VN97%2FLQtCVtnU8HhR4g886smcsr6n4UeSjxcNp1MWUvXiyvoyX5EAFq021xkBtaG%2BxkAp4GTyATMjbVb61WRfValjcxOKvKqbLbXZ%2BpG1ZYnRVaZTQbUwBdavUh%2F72lHV46Kvo23roZuqD9C1oDlPNVvfm%2F0IfU8HEpBeAAzOSJig7%2FNuJfW7KApwPK11QP3tr0X%2B9xfPfy1Vdt%2F%2B579FfvPrfK7SL1hf0a%2FEmbf0qyx5Whl94%2B3G6Lw%2FZaNHmag%2FjGKk7j09oWzP8pzaSXWS931b1YPrsiCaGLNhfJYHhrG0iDU5W1XvJL9TVAHHLuKSyvO%2BFi78iPngA97sWKLP341Az1%2B3LoOlQh9PaxVQpwHvxx%2Fntz%2F76fM%2F8y8f5s3bryc2F6jd3%2B9tHhygLaBaxdPut60E9QcBJtu3gVL2N1IO7A0WNTy%2BmJ%2B4CaiLsedvXU%2FEJzoxFRWfoW1FU2OyK77geaecvK%2Bv26W2DDScJ5xO6e8N%2F9rmoY20rGVnjupi0S%2B5JyF5uS0R2PO3sebtuVv4GFGDZv4ox9OgAdWC45tvS1D%2Fq8HuPzWI%2FsePNOT9YrbA9Y9%2Fn9%2BmElI%2F%2BeXh4dTY1y1s22YB21hQ%2FeNvivzJ%2BbzKOo8vfSUPxijdWGJyck5aVgUKbMd5WTikMJtCLS3ZykMbl%2F3QTWS74a%2FheN5wOvXdodvSkGV9KXuSABu5H7p1ykcMfnqBsB2iL2rRLzjVZv5sZowYx9OgAdXCla1itEj1z8Lcf%2F0kD2sWeOetAFpItapkCk3dH94%2F%2BeOYBtZ%2F%2Foc8rL7%2B5slXiLIJ%2BwmozaMHvbOCeY0%2F1YMpXSRaraepZKAn%2FYGGrx29tQsWWyHooQa6HWmOgQRQhKzg%2FVHn6cLR6chboefF7eT9YZclAt%2BRTwLd316iXbuChNPDBA2oFi63BiJ%2Ffjlvpp6FBbcngfRHYefutKrlX25UG1LtOVl0NP00rP5Ag%2B63L84eVOetvGJhUU9yemA%2FJ5jHriOc1slY4lvSfcKajfsawkQD666%2BwUZ%2Bkg3ueHizvpOkB%2BtXqc%2FDUDNW8IA6V%2FeY8PPiWnUy3tLRAcP0i%2FnUXPclHbsxw6kJ3gfVAtnfbeZV1JdfnuHnI04mb4ORqg6pHwbcney5%2Ff7fzx5UX44w%2BArHe6wnhzMSjx5QrT%2FSmuBkvNygWb4%2BJvo%2BCj3N1Ay6up%2BsaFhdsWyhgXWs77dRJ%2B8OMJKacD5cs7W9Z7LgXnF%2Fa6sgVn0fqjTxcl5SCqglHE%2BjTdRvlVELn8dtsVlI3f7bPNyVLUT19LC%2Fa0HVujEc9bhemuECAeEVFbqYVbpumydvntN4c%2Bi2BLWxF7klYkY9DXv9rN%2Fqmn%2BkW%2Fg11yOwUC0huXj9NGf1orR7ijcNa69KOko5nrZiJanpIKWyQ%2BqHka91LPza4%2FrhISH4SzTxV8ZHPrl2Iizz13ADQa3YhV7MASxz6Ok2rENQ3fPycwlpIr%2BSik0SGahVFZ%2FWHMwDKUFrljo9biR9jP9XxkpO02rqQWGYJv4KLbhizXFCrVLSFloFeyConzRft55uw2tr%2FiObGkcSdDpw%2F12fxqwhPWm3niSirONpawKqsTD3YUk9OH5Y8jKj1i%2F1ezefDuAvEVArM4lf%2BenWpbmxajZ5NH1P6%2BmxFlIl0Tl%2FbZ10a%2Fov5uZMSuj93afxGrR9zuEkHn%2BZx9NWBVTT5PXpbaS%2FzaJQRX9bPG2vnKbJgeBYNhpbUEtZM3%2BkidQDseUakwypIbkEAqojoEoKFfsyj6etC6i%2FafjKSvu7MrCKVHVK6j%2FX2%2Bj7VCdvTkfMaWQQXVFFHUu6uhZSU23uB4Iq8XjauoDaBtP5aKcraqEiZfTTcXKdE%2BPRJqEHjKBURRX1kqS9vG9Xm%2FvvCqLR5zelUeyt9Zkvb8AcAbWhLKTa0rCozqScZv7uxMkdSVAqwfkxy8LWnq3wpCH1gqT9Wi5pU%2F9AEIVWqVu%2FwMZnCQyUKnP6NwIqEMl7QzfyJbyZbbDGxmUffKWXRVifvEneNFs5Vo5qBguptnJNYlNPPcVm1ygmlEdoCUx1hXKPpwRUICZf0sofPltXPIlR%2Fbautcv7KX1RgIBs9PCtO%2B6CVlNtJbWxpKd7RqQvABYWfKlTAJ%2BzAR5nIqxjfYjhRt%2B%2FUuWKSRvv%2BFU%2FkaGkYyxoHK2mDsXmIu37vt6u6gXRsiTCO7koibQeNIlNdeUkMC9XPxW5J%2FVRdWvQWEpEQAUisuYQDY3b2g5fTnXTyfva3P%2FFzQ%2FcDSmZ%2Ft%2F3tRmOWQVqylbqCR4AIpsGVevvPMkrlxddxSvuWJcba%2Bana0lYtlhA6P3TQu8WcyQni4AKRLanJ9BTIuU1v2tz%2F7XLvteZyI0yJlTOwoEN1PIsv1qWGOtye5suSeqp2M8HthVhdTmbSF%2FkXBWB9UUnb%2BlNScvCtEOM1ayYWzVtBFQgMhssdW3Nj%2ByEKSVxXvra1Li8seYHm3fctkRgVaIzHbnivaxzoC%2BXXhD0JDDXkKUki7A6LLZsP9ULxKVO%2Fv57q4zuAPqeOCsISsPKjpewmrLPNxUBFSjBxMuNU%2BX3k%2BtJvmZ4v%2BOzaupIArAT%2FgsiK3qiv65ljZ6gdHpiDV8VdHJOGqhoah8VmzypsLqsb3hPIiD4hGcXHnrBba9lsIvhSUP3%2BaZgFD9QAqui6lmrks740zXD9eD%2ByEb6zzs%2FqY3Ot%2Bmszjh55PK5V3uCqnTf1ddDArGLjjIr%2FFXKZgIYuqG2LJzVSmesvtrMYBFB6Gn7olzoIRgqqEBJ3ESu%2BryKWlVzeE%2B3od4HsS4H%2BvFD52VUrLM9fvaH9WSw5K2vY0eW9OesP19PQrexYW6dTtaveSQBWEVcWkiD6kDfC2%2B1JZzXnq3OF7YlKrvQey9Q6xLCooIKlMQqN1qxuS0JcPkgkiv6wV2rrur26NnNvqeV0i3rzypUS%2Bc2iTQ1jL0uIVbryqqnLtpUaGMJwCr30eb59RKljzbCi7E63%2BmWXpzVARVUoETFvKh2ou0JWkGrALuxCs%2B2%2FrsGzAuLTGl0phOvL%2FEkQEC1EK4XdgP7%2BNplvxx6dgq7gDglwbHqUQRW6QzdD1XfQ9btaSv0jCe6r4Zdgnoit201NWkRAipQIgsS2qS0dipfaQktEGNwxz5LZ3Rf0hPspZOeYItZGCycRpu7thOgerznZDBt6nsyO8VlPww112%2BMAU2eBSKisVaowBX%2Fru%2FI%2B3p7SQLJlp72YVcU%2B1TkqrQMTfxAyawKkEpTP8oRObAsFYPgVmddB94GvGmw%2FThmODWLVnysetp5fg7hXrG076MQzf4dJ1cksL3Ag3nwuccxVunyspKFygBsNT0pKv6h6PnifhsXfmhlBfXDEqZP%2FtlPBDiUnrjXr635cwzOaIl8cEfMEcM93YZnpgPg9P%2BdeiYU79nPdORVrUKu%2BBIG6ulJdSQL2l89PUBPbHnfNT%2FQgD6apwk0W%2F0sQveG01RQo7GgFmVeabvouexlkcr8tXf8Fd0PgwdorRjflRZqXUB96QvlhMdPfinAkTpe1nze1N8TNF1pFbXsxK3N4JPnvy5lzsKgwfKhLCDrezrbCmy9bCCfk76G1bH%2Bzv1idoqdg7o9WJX5JZGVSbx5fMdlrODWZtHmlc4r833df9ZOMm%2F0dDU9N4lScBjHWmwlda0LqK%2BdF%2FnOOxKdVWl%2FwEJ3OIKdxK71%2FSVnTa1oNG2WvHdGsn5urVlx6zNZbN7fY6qnh%2BkVs1NcsSxe9P3dnXaxKPqb9iYSj%2FPhR5rjaZFX5%2BsVXWZ2rGm9k88c8NxFh4VS%2B%2F%2B6n676fFaUWAbSUgySAipkTZIaUteKie%2FRUEWz5E6LunSMF5lb8gTV0%2BPYBUG3zJWdNPzSv7wERQuUXdzHuuhb0uOyzQWd9U3VwPrUN32xRQymZuyse1BLMUgKqJitahNxRRskYtKu13ggC7DqqdSQ9btt21RAVbGKZgveU4M2dxchoAIJsBVtCKnNls3eIK1o%2Fl2o6nPIyP1a0IrbUFCa7w7dVoPfU63tezpFQAUSQUhtvlZUUb3cXqTqU9fqqT7ue20PFFWwpn5p4KwJepF3QVqOgAokpAipdsBt3Zx3bZD1y3SLDR5K3HhTq1oypxpXT3ddCydST0GxhLRNst%2BYY6YVKpgJgoAKJMf6pOrV83lhLsVG%2BnTSzIqPWEhbsOpT4%2BopgaJC1u9XQ10zLhC8bFuhQkBABVJkJ7vsZN%2Fsalsr2Yj%2BplV8MvnckWOZU12rp1btWqRqjDCKwaZrUm87n0rc1d3qhIAKJMpO9psfuEv0S22eouJj1cZGhFQLBhrSFp73VOqGaldSipBa19annU%2F1mNDGJU0PQ0AFEmcnQK2mnvWs790o%2B0LqWOrLqsFrFgxkQbqPj6VG9P7e1lDeFyTF3leubu8rvdAhnD6PgArUgFVTb91x531DR6y21fRkWtOLD7vv50OEUzO9ELOTtaRtV%2B%2FjVX1P0hSbqKz16Y47W4vWJ92X7EKHcPo8AipQIxYG9Er7fHHgHQtqb3rxMckHeYwlfVY1vWEVn9ADg7JgoSfrVIOqTcRvoZw%2Bp%2FWQcuuT7UuefelIBFSgZuxKuzjwXkgx1BQH3vXHkg0Ewoxs0vGsaTIPZmNJj43Sv11UTQcxKz4HBNVKq0u2T%2B%2Fpa6OP%2BwKj9eslwdansW5925dYdexopwVALRUnSrv63rrW9329XXWumrXe7QSuNw80lA63OIHPrXhN%2BzaifSLZa3nF1gOXKnkZawVqW1%2FbrbKbIafPx3rfd18QWZGS93Hbr%2FV1uJHNX4taK7qiDN%2Ft%2B%2BVT%2Br4Sl%2B1Ppcmq75L1W2Zmlhm5jTX%2Fid52pSVef0PkO%2B9IdB%2FeF%2FnBfWmUUIMhEM%2B%2BYBP7RG798LKlOzW43CeUxlO8phf1w5UirMY%2BXlsTvlV2Huj%2FHaUWzp7Zx0M%2FH9PHfk%2F36236BTZX5P0ow4X7YiygPtLbnrQEAXV%2BevW3cvOOa9ijajarFnREzulrt6xhsjdnNc5O2uNOHlh29GA74mBbHa2WL%2Bnr0Dudv6avFq9rT05%2BgrWLDAtgO7p%2F%2FHyS99Oz13dcp2A23cd1OzuxfX32sJHt11I8bv3dh3t6Syhtp2eOld0Thlb2pQjcxmV%2FVw9SpZa6q0RAnZ%2F1waKpq%2F6KgGMH3m4nv%2F2ibq8U37YWlV%2Fp93f1e2MNK7uE0fqwpnC9sebw7uSZk6u%2BnruPi76cbXhN9bnoPfs87HsOdgkPmIXtR3Z76plC3l7Rn5XjYzyn%2FUR%2BrlcKwLH2mIezEeiY31xF6CJ4CcEBYezbj8aCUtkofk5WmAXNFQAAoBQdTagjAY7hPBcyAACgHB2bxsMTUnEcJ0yNAQAASpFP1O%2FlgQCHGzN6HwAAlCULqI%2Fzyb6BAzlPhR0AAJQnC6g2%2BIVmfhzhhgAAAJSkM%2F1g4gkheJ5WT4esPQ0AAMr0JKDaBOxUUXEALlwAAECpOk994mVNmOQZBa2e3qZ6CgAAyvZUQLUwQlM%2FCmNh8BwAAKhA59kvfHfotmjqh%2FdyieopAACoQufAL%2BZN%2FWNBK2k4vcF67QAAoCoHBlSrnDkvF4T%2BqK1ThNOBAAAAVKRz2DeyJVAJqa1COAUAACnoHPVNa%2BbVSup5obm%2F8QinAAAgFZ3jfmDa3O9F6JPYTLvi5SrhFAAApOLYgGospN664857pqBqmh3rxrE5dEwnBQAAkjFTQJ2yKptWU89STa29XbvY2NSLDkbrAwCA1JwooJp91dQ13Qg39ZIF00%2F1IoMmfQAAkKrTMicNOEO9Gb7b98unRPri5C39vCdIjobSkd7ceyyyvTV0zMoAAACSNndAnXpv6EZSrDxlYVVLssv6oYXVrnOyJCibVUnH%2Bjo8mIjsaCi9RygFAAB1snBA3W9%2FWJ1a7%2FueJOT3viyl2PMi2pRetl3CKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc7f8BN9Nf21%2BegD0AAAAASUVORK5CYII%3D%0A%22%20%2F%3E%0A%3Cstyle%3E%0A%20%20img%20%7B%0A%20%20%20animation%3A%20fadeIn%201s%3B%0A%7D%0A%40keyframes%20fadeIn%20%7B%0A%20%200%25%20%7Bopacity%3A0%3B%7D%0A%20%20100%25%20%7Bopacity%3A1%3B%7D%0A%7D%0A%E2%80%8B%0A%40-moz-keyframes%20fadeIn%20%7B%0A%20%200%25%20%7Bopacity%3A0%3B%7D%0A%20%20100%25%20%7Bopacity%3A1%3B%7D%0A%7D%0A%E2%80%8B%0A%40-webkit-keyframes%20fadeIn%20%7B%0A%20%200%25%20%7Bopacity%3A0%3B%7D%0A%20%20100%25%20%7Bopacity%3A1%3B%7D%0A%7D%0A%E2%80%8B%0A%40-o-keyframes%20fadeIn%20%7B%0A%20%200%25%20%7Bopacity%3A0%3B%7D%0A%20%20100%25%20%7Bopacity%3A1%3B%7D%0A%7D%0A%E2%80%8B%0A%40-ms-keyframes%20fadeIn%20%7B%0A%20%200%25%20%7Bopacity%3A0%3B%7D%0A%20%20100%25%20%7Bopacity%3A1%3B%7D%0A%7D%0A%20%20%3C%2Fstyle%3E%0A%3C%2Fbody%3E%3C%2Fhtml%3E");
	}

	public load() {
		let startLoad = 0;

		this.window.webContents.once("did-start-loading", () => {
			this._rendererReadyTime = null;
			this._loadTime = null;

			startLoad = now();
		});

		this.window.webContents.once("did-finish-load", () => {
			if (process.env.NODE_ENV === "development") {
				// this.window.webContents.openDevTools();
			}

			process.env.CRUSHER_SCALE_FACTOR = this.window.webContents.zoomFactor + "";

			this._loadTime = now() - startLoad;

			identify(4);

			console.log("Analaytics done!");

			this.maybeEmitDidLoad();
		});

		// Disable zoom-in/zoom-out
		this.window.webContents.on("did-finish-load", () => {
		});

		this.window.webContents.on("did-fail-load", () => {
			this.window.webContents.openDevTools();
			this.window.show();
		});

		this.window.webContents.on("did-attach-webview", this.handleWebviewAttached.bind(this));

		// @TODO: Remove this asap, this is only here as a workaround to not
		// having proper events for webview scrolling
		// setInterval(async () => {
		// 	try {
		// 		const recorderInfo = getRecorderInfo(this.store.getState() as any);

		// 		if (recorderInfo && recorderInfo.device && recorderInfo.device.width) {
		// 			await this.window.webContents.executeJavaScript(
		// 				`if(document.querySelector('webview')){ document.querySelector('webview').setZoomFactor(document.querySelector('webview').offsetWidth / ${recorderInfo.device.width}); }`,
		// 			);
		// 		}
		// 		process.env.CRUSHER_SCALE_FACTOR = this.window.webContents.zoomFactor * (this.webView ? this.webView.webContents.zoomFactor : 1) + "";
		// 	} catch (err) {}
		// }, 500);

		this.window.webContents.on("will-attach-webview", (event, webContents) => {
			webContents.nodeIntegrationInSubFrames = true;
			(webContents as any).disablePopups = false;
			webContents.enablePreferredSizeMode = true;
			return webContents;
		});

		ipcMain.once("renderer-ready", (event: Electron.IpcMainEvent, readyTime: number) => {
			this._rendererReadyTime = readyTime;
			console.log("Rendering time is", this._rendererReadyTime);
			this.splashWindow.destroy();
			setTimeout(() => {
				this.window.show();
			}, 200);

			this._rendererReadyTime = readyTime;
			this.sendMessage("url-action", { action: { commandName: "restore" } });

			this.maybeEmitDidLoad();
		});

		ipcMain.handle("perform-action", async (event, payload) => {
			this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_RECORDER_ACTIONS, {}));
			try {
				await this.handlePerformAction(event, payload);
				this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
			} catch (ex) {}
		});
		ipcMain.handle("turn-on-recorder-inspect-mode", this.turnOnInspectMode.bind(this));
		ipcMain.handle("turn-on-element-selector-inspect-mode", this.turnOnElementSelectorInspectMode.bind(this));
		ipcMain.handle("turn-off-element-selector-inspect-mode", this.turnOffElementSelectorInspectMode.bind(this));
		ipcMain.handle("turn-off-recorder-inspect-mode", this.turnOffInspectMode.bind(this));
		ipcMain.handle("verify-test", this.handleVerifyTest.bind(this));
		ipcMain.handle("replay-test", this.handleRemoteReplayTest.bind(this));
		ipcMain.handle("update-test", this.handleUpdateTest.bind(this));
		ipcMain.handle("save-test", this.handleSaveTest.bind(this));
		ipcMain.handle("save-step", this.handleSaveStep.bind(this));
		ipcMain.handle("go-back-page", this.handleGoBackPage.bind(this));
		ipcMain.handle("reload-page", this.handleReloadPage.bind(this));
		ipcMain.handle("get-page-seo-info", this.handleGetPageSeoInfo.bind(this));
		ipcMain.handle("get-element-assert-info", this.handleGetElementAssertInfo.bind(this));
		ipcMain.handle("continue-remaining-steps", this.continueRemainingSteps.bind(this));
		ipcMain.handle("reset-test", this.handleResetTest.bind(this));
		ipcMain.handle("reset-app-session", this.handleResetAppSession.bind(this));
		ipcMain.handle("focus-window", this.focusWindow.bind(this));
		ipcMain.handle("save-n-get-user-info", this.handleSaveNGetUserInfo.bind(this));
		ipcMain.handle("get-user-tests", this.handleGetUserTests.bind(this));
		ipcMain.handle("jump-to-step", this.handleJumpToStep.bind(this));
		ipcMain.on("recorder-can-record-events", this.handleRecorderCanRecordEvents.bind(this));
		ipcMain.handle("quit-and-restore", this.handleQuitAndRestore.bind(this));
		ipcMain.handle("perform-steps", this.handlePerformSteps.bind(this));
		ipcMain.handle("enable-javascript-in-debugger", this.handleEnableJavascriptInDebugger.bind(this));
		ipcMain.handle("disable-javascript-in-debugger", this.disableJavascriptInDebugger.bind(this));
		ipcMain.handle("save-code-template", this.handleSaveCodeTemplate.bind(this));
		ipcMain.handle("get-code-templates", this.handleGetCodeTemplates.bind(this));
		ipcMain.handle("update-code-template", this.handleUpdateCodeTemplate.bind(this));
		ipcMain.handle("delete-code-template", this.handleDeleteCodeTemplate.bind(this));
		ipcMain.handle("reset-storage", this.handleResetStorage.bind(this));
		ipcMain.on("get-var-context", this.handleGetVarContext.bind(this));
		ipcMain.on("get-is-advanced-selector", this.handleGetVarContext.bind(this));

		this.window.on("focus", () => this.window.webContents.send("focus"));
		this.window.on("blur", () => this.window.webContents.send("blur"));

		/* Loads crusher app */
		this.window.webContents.setVisualZoomLevelLimits(1, 3);
		this.window.loadURL(encodePathAsUrl(__dirname, "index.html"));
	}

	private handleGetAdvancedSelector(event: Electron.IpcMainEvent, payload: any) {
		event.returnValue = this.useAdvancedSelectorPicker;
	}
	private handleGetVarContext(event: Electron.IpcMainEvent, payload: any) {
		const context = this.webView.playwrightInstance.getContext();
		event.returnValue = Object.keys(context).reduce((prev, current) => {
			// Get typescript type of current, CustomClass | string | number | boolean | undefined | null
			const type = typeof context[current];
			return { ...prev, [current]: type };
		}, {});
	}

	private async handleUpdateCodeTemplate(event: Electron.IpcMainEvent, payload: { id: number; name: string; code: string }) {
		// await this.store.dispatch(updateCodeTemplate(payload.id, payload.codeTemplate));
		// pdate.codeTemplate
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(
				resolveToBackendPath("teams/actions/update.codeTemplate", appSettings.backendEndPoint),
				{ id: payload.id, name: payload.name, code: payload.code },
				{
					headers: {
						Accept: "application/json, text/plain, */*",
						"Content-Type": "application/json",
						Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
					},
				},
			)
			.then((res) => {
				return res.data;
			});
	}

	private async handleDeleteCodeTemplate(event: Electron.IpcMainEvent, payload: { id: string }) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(
				resolveToBackendPath("teams/actions/delete.codeTemplate", appSettings.backendEndPoint),
				{ id: payload.id },
				{
					headers: {
						Accept: "application/json, text/plain, */*",
						"Content-Type": "application/json",
						Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
					},
				},
			)
			.then((res) => {
				return res.data;
			});
	}

	private async handleSaveCodeTemplate(event, payload: { createPayload: any }) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(resolveToBackendPath("teams/actions/save.code", appSettings.backendEndPoint), payload.createPayload, {
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
					Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
				},
			})
			.then((res) => {
				return res.data;
			});
	}

	private async handleGetCodeTemplates(event) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			console.log("Account info is", accountInfo);
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.get(resolveToBackendPath("teams/actions/get.codeTemplates", appSettings.backendEndPoint), {
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
					Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
				},
			})
			.then((res) => {
				return res.data;
			});
	}

	private async disableJavascriptInDebugger() {
		if (this.window) {
			return this.webView._disableExecution();
		}
	}
	private async handleEnableJavascriptInDebugger() {
		if (this.webView) {
			return this.webView._resumeExecution();
		}
	}

	private async handlePerformSteps(event, payload: { steps: any }) {
		await this.resetRecorder();
		await this.handleReplayTestSteps(payload.steps);
	}

	private async handleQuitAndRestore() {
		app.relaunch();
		app.quit();
	}

	private async handleJumpToStep(event: Electron.IpcMainEvent, payload: { stepIndex: number }) {
		const recorderSteps = getSavedSteps(this.store.getState() as any);
		await this.resetRecorder();
		const appSettings = getAppSettings(this.store.getState() as any);
		this.setRemainingSteps(recorderSteps.slice(payload.stepIndex + 1) as any);
		await this.handleReplayTestSteps(recorderSteps.slice(0, payload.stepIndex + 1) as any);
		return true;
	}

	private handleRecorderCanRecordEvents(event: Electron.IpcMainEvent) {
		const recorderState = getRecorderState(this.store.getState() as any);
		event.returnValue = recorderState.type !== TRecorderState.PERFORMING_ACTIONS;
	}

	private async handleGetUserTests() {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		const userTests = await getUserAccountTests(accountInfo.token, appSettings.backendEndPoint);
		return userTests;
	}

	private async setGlobalCrusherAccountInfo(info: any) {
		const globalAppConfig = getGlobalAppConfig();
		writeGlobalAppConfig({ ...globalAppConfig, userInfo: info });
	}
	// Workaround to limitation of setting Cookie through XHR in renderer process
	private async handleSaveNGetUserInfo(event, payload: { token: string }) {
		const appSettings = getAppSettings(this.store.getState() as any);
		const userInfo = await getUserInfoFromToken(payload.token, appSettings.backendEndPoint);
		this.store.dispatch(setUserAccountInfo(userInfo));

		this.setGlobalCrusherAccountInfo(userInfo);
		return userInfo;
	}
	// Set focus to our recorder window
	private focusWindow() {
		this.window.focus();
	}

	private getLastRecordedStep(store: Store<unknown, AnyAction>, shouldNotIgnoreScroll = false) {
		const steps = getSavedSteps(store.getState() as any);
		if (shouldNotIgnoreScroll) {
			return { step: steps[steps.length - 1], index: steps.length - 1 };
		}

		for (let i = steps.length - 1; i >= 0; i--) {
			// Scrolls might happen during internal navigation, so ignore them
			if (![ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(steps[i].type)) {
				return { step: steps[i], index: i };
			}
		}

		return null;
	}

	recordLog(log: ILoggerReducer["logs"][0]) {
		this.store.dispatch(recordLog(log));
	}

	updateRecorderState(state) {
		this.store.dispatch(updateRecorderState(state, {}));
	}

	updateRecorderCrashState(stateMeta) {
		console.log("Update crash recorder");
		this.store.dispatch(updateRecorderCrashState(stateMeta));
	}

	async handleResetAppSession() {
		await this.webView.dispose();
		await this.store.dispatch(resetAppSession());
		await this.resetRecorder();
	}

	async handleResetTest(event: Electron.IpcMainEvent, payload: { device: iDevice }) {
		await this.webView.dispose();
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const navigationStep = recordedSteps.find((step) => step.type === ActionsInTestEnum.NAVIGATE_URL);
		await this.resetRecorder();

		await this.store.dispatch(setDevice(payload.device.id));
		await this.store.dispatch(setSiteUrl(template(navigationStep.payload.meta.value, { ctx: {} })));
		// Playwright context has issues when set to about:blank
	}

	handleSaveStep(event: Electron.IpcMainInvokeEvent, payload: { action: iAction }) {
		const { action } = payload;
		const elementInfo = this.webView.playwrightInstance.getElementInfoFromUniqueId(action.payload.meta?.uniqueNodeId);
		if (elementInfo && elementInfo.parentFrameSelectors) {
			action.payload.meta = {
				...(action.payload.meta || {}),
				parentFrameSelectors: elementInfo.parentFrameSelectors,
			};
		}

		if (action.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION) {
			const lastRecordedStep = this.getLastRecordedStep(this.store);
			if (!lastRecordedStep) return;
			if (lastRecordedStep.step.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION) {
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				if (lastRecordedStep.step.type !== ActionsInTestEnum.NAVIGATE_URL) {
					this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
				}
			}
		} else if (action.type === ActionsInTestEnum.ADD_INPUT) {
			const lastRecordedStep = this.getLastRecordedStep(this.store);
			if (
				lastRecordedStep.step.type === ActionsInTestEnum.ADD_INPUT &&
				lastRecordedStep.step.payload.meta?.uniqueNodeId === action.payload.meta?.uniqueNodeId
			) {
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		} else if ([ActionsInTestEnum.PAGE_SCROLL, ACTIONS_IN_TEST.ELEMENT_SCROLL].includes(action.type)) {
			const lastRecordedStep = this.getLastRecordedStep(this.store, true);
			console.log(
				"Scroll values",
				action.payload.meta?.uniqueNodeId,
				lastRecordedStep.step.payload.meta?.uniqueNodeId,
				lastRecordedStep.step.type,
				action.type,
			);
			if (
				[ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(lastRecordedStep.step.type) &&
				action.payload.meta?.uniqueNodeId === lastRecordedStep.step.payload.meta?.uniqueNodeId
			) {
				action.payload.meta.value = [...lastRecordedStep.step.payload.meta.value, action.payload.meta.value];
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				action.payload.meta.value = [action.payload.meta.value];
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		} else {
			if (action.type === ActionsInTestEnum.NAVIGATE_URL) {
				this.store.dispatch(recordStep(action, ActionStatusEnum.STARTED));
			} else {
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		}
	}

	reinstateElementSteps(uniqueElementId, elementInfo) {
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const stepsToReinstate = recordedSteps
			.map((step, index) => ({ step, index }))
			.filter((step) => {
				return step.step.payload.meta?.uniqueNodeId === uniqueElementId;
			});

		stepsToReinstate.map((a) => {
			a.step.payload.meta = {
				...(a.step.payload.meta || {}),
				parentFrameSelectors: elementInfo.parentFrameSelectors,
			};
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.store.dispatch(updateRecordedStep(a.step, a.index));
		});
	}

	async continueRemainingSteps(event: Electron.IpcMainEvent, payload: { extraSteps?: Array<iAction> | null }) {
		const { extraSteps } = payload;
		let remainingSteps = getRemainingSteps(this.store.getState() as any);
		await this.setRemainingSteps(null);

		if (extraSteps) {
			remainingSteps = remainingSteps ? [...extraSteps, ...remainingSteps] : [...extraSteps];
		}
		if (remainingSteps) {
			await this.handleReplayTestSteps(remainingSteps);
		}
		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleGetElementAssertInfo(event: Electron.IpcMainEvent, elementInfo: iElementInfo) {
		try { await this.webView._resumeExecution(); } catch (e) { console.error("Enabling exection failed", e); }
		await new Promise((resolve) => setTimeout(resolve, 500));
		const elementHandle = this.webView.playwrightInstance.getElementInfoFromUniqueId(elementInfo.uniqueElementId)?.handle;
		if (!elementHandle) {
			return null;
		}
		const attributes = await elementHandle.evaluate((element, args) => {
			const attributeNamesArr: Array<string> = (element as HTMLElement).getAttributeNames();
			return attributeNamesArr.map((attributeName) => {
				return {
					name: attributeName,
					value: (element as HTMLElement).getAttribute(attributeName),
				};
			});
		});

		const assertElementInfo = {
			innerHTML: await elementHandle.innerHTML(),
			innerText: await elementHandle.innerText(),
			attributes: attributes,
		};

		const elementTagName = await (
			await elementHandle.evaluateHandle((element: HTMLElement) => {
				return element.tagName.toUpperCase();
			}, [])
		).jsonValue();

		if (elementTagName === "INPUT") {
			const valueAttribute = attributes.find((attribute) => attribute.name.toLowerCase() === "value");
			if (valueAttribute) {
				valueAttribute.value = await elementHandle.inputValue();
			} else {
				assertElementInfo.attributes.push({
					name: "value",
					value: await elementHandle.inputValue(),
				});
			}
		}
		try { await this.webView._disableExecution(); } catch(ex) { console.error("Disabling execution failed", ex); }
		return assertElementInfo;
	}

	async handleGetPageSeoInfo(event: Electron.IpcMainEvent, url: string) {
		return {
			title: await this.webView.playwrightInstance.page.title(),
			metaTags: (await this.webView.playwrightInstance.page.evaluate(() => {
				const metaTags = document.querySelectorAll("meta");
				return Array.from(metaTags)
					.map((meta) => {
						return {
							name: meta.getAttribute("name"),
							value: meta.content,
						};
					})
					.filter((a) => !!a.name)
					.reduce((prev, current) => {
						if (current.name) {
							prev[current.name] = current;
						}
						return prev;
					}, {});
			})) as iSeoMetaInformationMeta,
		};
	}

	getRecorderState() {
		return getRecorderState(this.store.getState() as any);
	}

	async handleGoBackPage() {
		/* Todo: Add wait for this, and keep track of the back page */
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		this.webView.webContents.goBack();
		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleReloadPage() {
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		const savedSteps = getSavedSteps(this.store.getState() as any);

		this.store.dispatch(
			recordStep({
				type: ActionsInTestEnum.RELOAD_PAGE,
				payload: {},
			}),
		);

		this.webView.webContents.reload();

		await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: "networkidle" });

		/* Change this to back */
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.COMPLETED));

		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleUpdateTest(event: Electron.IpcMainEvent) {
		const editingSessionMeta = getAppEditingSessionMeta(this.store.getState() as any);
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);
		await CrusherTests.updateTest(recordedSteps as any, editingSessionMeta.testId, appSettings.backendEndPoint, appSettings.frontendEndPoint);
	}

	async handleSaveTest() {
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		if (app.commandLine.hasSwitch("exit-on-save")) {
			const projectId = app.commandLine.getSwitchValue("projectId");
			await CrusherTests.saveTestDirectly(
				recordedSteps as any,
				projectId,
				app.commandLine.getSwitchValue("token"),
				appSettings.backendEndPoint,
				appSettings.frontendEndPoint,
			);
			await shell.openExternal(resolveToFrontEndPath(`/app/tests/?project_id=${projectId}`, appSettings.frontendEndPoint));
			process.exit(0);
		} else {
			await CrusherTests.saveTest(recordedSteps as any, appSettings.backendEndPoint, appSettings.frontendEndPoint);
		}
	}

	async handleVerifyTest(event, payload) {
		const { shouldAlsoSave } = payload;
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		await this.resetRecorder(TRecorderState.PERFORMING_ACTIONS);

		await this.handleReplayTestSteps(recordedSteps as any);
		this.store.dispatch(setIsTestVerified(true));
		if (shouldAlsoSave) {
			this.handleSaveTest();
		}
	}

	async handleRemoteReplayTest(event: Electron.IpcMainInvokeEvent, payload: { testId: number }) {
		await this.resetRecorder();
		const appSettings = getAppSettings(this.store.getState() as any);
		const testSteps = await CrusherTests.getTest(`${payload.testId}`, appSettings.backendEndPoint);

		this.handleReplayTestSteps(testSteps);
	}

	private setRemainingSteps(steps: Array<iAction>) {
		const sessionInfoMeta = getAppSessionMeta(this.store.getState() as any);
		this.store.dispatch(
			setSessionInfoMeta({
				...sessionInfoMeta,
				remainingSteps: steps,
			}),
		);
	}

	async handleReplayTestSteps(steps: Array<iAction> | null = null) {
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		const appSettings = getAppSettings(this.store.getState() as any);

		const browserActions = getBrowserActions(steps);
		const mainActions = getMainActions(steps);

		const reaminingSteps = [...browserActions, ...mainActions];

		try {
			for (const browserAction of browserActions) {
				reaminingSteps.shift();

				if (browserAction.type === ActionsInTestEnum.SET_DEVICE) {
					await this.store.dispatch(setDevice(browserAction.payload.meta.device.id));
					await this.handlePerformAction(null, { action: browserAction, shouldNotSave: false });
				} else {
					if (browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
						// @Todo: Add support for future browser actions
						this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
					} else {
						await this.handleRunAfterTest(browserAction);
					}
				}
			}

			for (const savedStep of mainActions) {
				reaminingSteps.shift();

				await this.handlePerformAction(null, { action: savedStep });
			}
			this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
		} catch (ex) {
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));
			console.log("Remaining steps are", reaminingSteps);
			this.setRemainingSteps(reaminingSteps);
			throw ex;
		}
	}

	private turnOnInspectMode() {
		this.store.dispatch(setInspectMode(true));
		this.webView._turnOnInspectMode();
		// this.webView.webContents.focus();
	}

	private turnOnElementSelectorInspectMode() {
		this.store.dispatch(setInspectElementSelectorMode(true));
		this.useAdvancedSelectorPicker = true;

		this.webView._turnOnInspectMode();
		this.webView._resumeExecution();
		this.webView.webContents.focus();
	}

	private turnOffElementSelectorInspectMode() {
		this.store.dispatch(setInspectElementSelectorMode(false));
		this.useAdvancedSelectorPicker = false;
		this.webView._turnOffInspectMode();
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

	private async handleResetStorage() {
		await this.clearWebViewStorage();
	}

	private async handlePerformAction(event: Electron.IpcMainInvokeEvent, payload: { action: iAction; shouldNotSave?: boolean; isRecording?: boolean }) {
		const { action, shouldNotSave } = payload;
		console.log("Handle perform action called", payload);
		try {
			switch (action.type) {
				case ActionsInTestEnum.SET_DEVICE: {
					this.store.dispatch(setDevice(action.payload.meta.device.id));
					// Custom implementation here, because we are in the recorder
					const userAgent = action.payload.meta?.device.userAgentRaw
						? action.payload.meta?.device.userAgentRaw
						: getUserAgentFromName(action.payload.meta?.device.userAgent).value;
					if (this.webView) {
						this.webView.webContents.setUserAgent(userAgent);
					}
					app.userAgentFallback = userAgent;

					if (!shouldNotSave) {
						this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
					}
					break;
				}
				case ActionsInTestEnum.NAVIGATE_URL: {
					this.store.dispatch(setSiteUrl(template(action.payload.meta.value, { ctx: {} })));
					await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
					break;
				}
				case ActionsInTestEnum.RUN_AFTER_TEST: {
					await this.resetRecorder();
					this.store.dispatch(
						updateRecorderState(TRecorderState.PERFORMING_ACTIONS, { type: ActionsInTestEnum.RUN_AFTER_TEST, testId: action.payload.meta.value }),
					);
					await this.handleRunAfterTest(action, true);
					await this.handlePerformAction(null, {
						action: {
							type: ActionsInTestEnum.NAVIGATE_URL,
							payload: {
								selectors: [],
								meta: {
									value: this.webView.webContents.getURL(),
								},
							},
						},
						shouldNotSave: false,
					});
					this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
					break;
				}
				case ActionsInTestEnum.RELOAD_PAGE: {
					this.webView.webContents.reload();
					await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: "networkidle" });
					if (!shouldNotSave) {
						this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
					}
					break;
				}
				default:
					console.log("Running this action", action);
					if (payload.isRecording && action.payload.meta?.uniqueNodeId) {
						const elementInfo = this.webView.playwrightInstance.getElementInfoFromUniqueId(action.payload.meta?.uniqueNodeId);
						if (elementInfo && elementInfo.parentFrameSelectors) {
							action.payload.meta = {
								...(action.payload.meta || {}),
								parentFrameSelectors: elementInfo.parentFrameSelectors,
							};
						}
					}
					await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
					break;
			}
			await sleep(1000);
		} catch (e) {
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));
			throw e;
		}
	}

	private async resetRecorder(state: TRecorderState = null) {
		this.store.dispatch(resetRecorderState(state));
		this.store.dispatch(clearLogs());
		if (this.webView) {
			await this.webView.webContents.loadURL("about:blank");
		}
		await this.clearWebViewStorage();
	}

	private async handleRunAfterTest(action: iAction, shouldRecordSetDevice = false) {
		const appSettings = getAppSettings(this.store.getState() as any);

		try {
			const testSteps = await CrusherTests.getTest(action.payload.meta.value, appSettings.backendEndPoint);

			const replayableTestSteps = await CrusherTests.getReplayableTestActions(testSteps, true, appSettings.backendEndPoint);
			const browserActions = getBrowserActions(replayableTestSteps);

			for (const browserAction of browserActions) {
				if (browserAction.type === ActionsInTestEnum.SET_DEVICE) {
					await this.handlePerformAction(null, { action: browserAction, shouldNotSave: shouldRecordSetDevice ? false : true });
				} else {
					if (browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
						this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
					}
				}
			}

			this.store.dispatch(recordStep(action, ActionStatusEnum.STARTED));

			for (const savedStep of getMainActions(replayableTestSteps)) {
				await this.handlePerformAction(null, { action: savedStep, shouldNotSave: true });
			}

			action.status = ActionStatusEnum.COMPLETED as any;
			const savedSteps = getSavedSteps(this.store.getState() as any);
			this.store.dispatch(updateRecordedStep(action, savedSteps.length - 1));

			return testSteps;
		} catch (e) {
			action.status = ActionStatusEnum.FAILED as any;

			const savedSteps = getSavedSteps(this.store.getState() as any);
			this.store.dispatch(updateRecordedStep(action, savedSteps.length - 1));
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));

			throw e;
		}
	}

	async handleWebviewAttached(event, webContents) {
		this.webView = new WebView(this);
		this.webView.webContents.on("dom-ready", () => {
			if (!this.webView.webContents.debugger.isAttached()) {
				this.webView.initialize();
				console.log("Webview initialized");
			}
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
	public sendLaunchTimingStats(stats: { mainReadyTime: number; loadTime: number; rendererReadyTime: number }) {
		this.window.webContents.send("launch-timing-stats", { stats });
	}

	/**
	 * Emit the `onDidLoad` event if the page has loaded and the renderer has
	 * signalled that it's ready.
	 */
	private maybeEmitDidLoad() {
		if (!this.rendererLoaded) {
			return;
		}

		this.emitter.emit("did-load", null);
	}

	private get rendererLoaded(): boolean {
		return !!this.loadTime && !!this.rendererReadyTime;
	}

	/**
	 * Get the time (in milliseconds) spent loading the page.
	 *
	 * This will be `null` until `onDidLoad` is called.
	 */
	public get loadTime(): number | null {
		return this._loadTime;
	}

	/**
	 * Get the time (in milliseconds) elapsed from the renderer being loaded to it
	 * signaling it was ready.
	 *
	 * This will be `null` until `onDidLoad` is called.
	 */
	public get rendererReadyTime(): number | null {
		return this._rendererReadyTime;
	}

	public isMinimized() {
		return this.window.isMinimized();
	}

	/** Is the window currently visible? */
	public isVisible() {
		return this.window.isVisible();
	}

	public restore() {
		this.window.restore();
	}

	public focus() {
		this.window.focus();
	}

	/** Show the window. */
	public show() {
		this.window.show();
		if (this.shouldMaximizeOnShow) {
			// Only maximize the window the first time it's shown, not every time.
			// Otherwise, it causes the problem described in desktop/desktop#11590
			this.shouldMaximizeOnShow = false;
		}
	}

	/**
	 * Register a function to call when the window is done loading. At that point
	 * the page has loaded and the renderer has signalled that it is ready.
	 */
	public onDidLoad(fn: () => void): Disposable {
		return this.emitter.on("did-load", fn);
	}

	public onClose(fn: () => void) {
		this.window.on("closed", fn);
	}

	public destroy() {
		this.window.destroy();
	}
}
