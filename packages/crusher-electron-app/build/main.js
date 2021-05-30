"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var loadExtension = function (mainWindow) {
    console.log(process.env.NODE_ENV);
    var isTesting = process.env.NODE_ENV === "testing";
    return new Promise(function (resolve, reject) {
        electron_1.session.defaultSession.loadExtension(path.resolve(__dirname, "" + (isTesting ? "../../crusher-extension/build" : "./extension/")), { allowFileAccess: true }).then(function (_a) {
            var extensionId = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, mainWindow.loadURL("chrome-extension://" + extensionId + "/test_recorder.html")];
                        case 1:
                            _b.sent();
                            resolve(true);
                            return [2];
                    }
                });
            });
        });
    });
};
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var mainWindow;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    electron_1.app.commandLine.appendSwitch('--disable-site-isolation-trials');
                    electron_1.app.commandLine.appendSwitch('--disable-web-security');
                    electron_1.app.commandLine.appendSwitch("--allow-top-navigation");
                    mainWindow = new electron_1.BrowserWindow({
                        webPreferences: {
                            preload: path.join(__dirname, 'preload.js'),
                            nativeWindowOpen: true,
                            webSecurity: false,
                            devTools: true
                        }
                    });
                    return [4, mainWindow.maximize()];
                case 1:
                    _a.sent();
                    return [4, mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, function (responseDetails, updateCallback) {
                            Object.keys(responseDetails.responseHeaders).map(function (headers) {
                                if (["x-frame-options", "content-security-policy", "frame-options"].includes(headers.toString().toLowerCase())) {
                                    delete responseDetails.responseHeaders[headers];
                                }
                            });
                            updateCallback({ cancel: false, responseHeaders: responseDetails.responseHeaders });
                        })];
                case 2:
                    _a.sent();
                    return [4, loadExtension(mainWindow)];
                case 3:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.attach("1.3")];
                case 4:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.sendCommand('Debugger.enable')];
                case 5:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.sendCommand('DOM.enable')];
                case 6:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.sendCommand('Runtime.enable')];
                case 7:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.sendCommand('Overlay.enable')];
                case 8:
                    _a.sent();
                    return [4, mainWindow.webContents.debugger.sendCommand("Debugger.setAsyncCallStackDepth", { maxDepth: 9999 })];
                case 9:
                    _a.sent();
                    electron_1.ipcMain.on('turn-on-inspect-mode', function (e, msg) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
                                        mode: "searchForNode", highlightConfig: {
                                            'showInfo': true,
                                            'showStyles': true,
                                            'contentColor': { r: 233, g: 255, b: 177, a: 0.39 }
                                        }
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); });
                    electron_1.ipcMain.on('turn-off-inspect-mode', function (e, msg) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
                                        mode: "none",
                                        highlightConfig: {
                                            'showInfo': true,
                                            'showStyles': true,
                                            'contentColor': {
                                                r: 233,
                                                g: 255,
                                                b: 177,
                                                a: 0.39
                                            }
                                        }
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); });
                    mainWindow.webContents.debugger.on('message', function (event, method, params) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(method === "Overlay.inspectNodeRequested")) return [3, 2];
                                    return [4, mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
                                            mode: "none",
                                            highlightConfig: {
                                                'showInfo': true,
                                                'showStyles': true,
                                                'contentColor': {
                                                    r: 233,
                                                    g: 255,
                                                    b: 177,
                                                    a: 0.39
                                                }
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    mainWindow.webContents.on('new-window', function (event, popupUrl) {
                        if (mainWindow.webContents.getURL().startsWith("chrome-extension")) {
                            if (!popupUrl.includes("localhost:8000") && !popupUrl.includes("crusher.dev")) {
                                event.preventDefault();
                                mainWindow.webContents.executeJavaScript("document.querySelector('#device_browser').src = \"" + popupUrl + "\"");
                            }
                        }
                        else {
                            event.preventDefault();
                            mainWindow.webContents.executeJavaScript("window.location.href = \"" + popupUrl + "\"");
                        }
                    });
                    mainWindow.webContents.session.clearStorageData({
                        storages: [
                            "cookies",
                            "serviceworkers",
                            "cachestorage",
                            "websql",
                            "shadercache",
                            "filesystem",
                            "indexdb",
                            "appcache"
                        ]
                    });
                    return [2];
            }
        });
    });
}
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
//# sourceMappingURL=main.js.map