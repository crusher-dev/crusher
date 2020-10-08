"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("preact");
const compat_1 = __importDefault(require("preact/compat"));
const helpers_1 = require("../../utils/helpers");
const devices_1 = __importDefault(require("../../constants/devices"));
class App extends preact_1.Component {
    constructor(props) {
        super(props);
        this.handleStartRecordingClick = this.handleStartRecordingClick.bind(this);
        this.state = {
            selectedDevice: devices_1.default[7].id,
        };
    }
    injectRecorder() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tabId } = this.props;
            // @ts-ignore
            yield helpers_1.loadScript("inject", tabId);
            window.close();
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    renderSteps() {
        return (compat_1.default.createElement(compat_1.default.Fragment, null,
            compat_1.default.createElement("div", { id: "icon", class: "center-aligned", style: {
                    background: `url(${chrome.runtime.getURL("icons/crusher.svg")})`,
                    width: 98,
                    height: 79,
                } }),
            compat_1.default.createElement("span", { class: "small_heading" }, "How to create test?"),
            compat_1.default.createElement("ol", { id: "steps", class: "numbered-list" },
                compat_1.default.createElement("li", null, "Press start Recording."),
                compat_1.default.createElement("li", null, "Basic actions are supported by default. For extensive actions, click on plus sign."),
                compat_1.default.createElement("li", null, " * For mobile - Decrease window size"),
                compat_1.default.createElement("li", null, "On completion, press stop sign."))));
    }
    handleStartRecordingClick() {
        return __awaiter(this, void 0, void 0, function* () {
            chrome.tabs.get(this.props.tabId, (tab) => {
                const { selectedDevice } = this.state;
                const iframeURL = new URL(tab.url);
                const crusherAgent = devices_1.default.find((device) => device.id === selectedDevice);
                iframeURL.searchParams.set("__crusherAgent__", encodeURI(crusherAgent.userAgent));
                chrome.tabs.create({
                    url: `${chrome.extension.getURL("test_recorder.html")}?url=${iframeURL}&device=${selectedDevice}`,
                });
                window.close();
            });
        });
    }
    renderDeviceInput() {
        const deviceOptions = devices_1.default.map((device) => (compat_1.default.createElement("option", { value: device.id }, device.name)));
        const { selectedDevice } = this.state;
        function handleDeviceSelection(event) {
            const newDeviceId = event.target.value;
            this.setState({ selectedDevice: newDeviceId });
        }
        return (compat_1.default.createElement("div", { style: styles.selectInputContainer, className: "select" },
            compat_1.default.createElement("select", { id: "slct", size: 1, value: selectedDevice, style: styles.selectBox, onChange: handleDeviceSelection.bind(this) },
                compat_1.default.createElement("option", { selected: true, disabled: true }, "Select Device Type"),
                deviceOptions)));
    }
    render() {
        return (compat_1.default.createElement("div", { id: "container", style: styles.container },
            compat_1.default.createElement("div", { style: styles.headingBlock },
                compat_1.default.createElement("div", { style: styles.heading }, "Record a test")),
            compat_1.default.createElement("div", { style: styles.subHeading }, "Experience power of no-code testing \u2728\u2728"),
            compat_1.default.createElement("div", { style: styles.paddingContainer },
                this.renderDeviceInput(),
                compat_1.default.createElement("div", { style: styles.button, onClick: this.handleStartRecordingClick }, "Start recording"),
                compat_1.default.createElement("a", { href: "https://crusherdev.page.link/chrome_video", target: "blank" },
                    compat_1.default.createElement("div", { style: styles.watchBlock },
                        compat_1.default.createElement("img", { src: chrome.runtime.getURL("icons/play.svg") }),
                        compat_1.default.createElement("div", { style: styles.watchText }, "Watch : How to record test in 2 mins?"))),
                compat_1.default.createElement("a", { href: "https://crusherdev.page.link/help_chrome", target: "_blank" },
                    compat_1.default.createElement("div", { style: styles.smallButton }, "Need help?"))),
            compat_1.default.createElement("link", { rel: "stylesheet", href: chrome.runtime.getURL("/styles/popup.css") }),
            compat_1.default.createElement("link", { rel: "stylesheet", href: chrome.runtime.getURL("/styles/fonts.css") }),
            compat_1.default.createElement("style", null, `
                        html, body{
                            padding:0;
                            margin:0;
                            min-height: 300px;
                            max-height: 300px;
                        }
                        `)));
    }
}
const styles = {
    container: {
        background: "#141427",
        color: "#FFFFFF",
        width: 340,
        padding: 0,
    },
    paddingContainer: {
        padding: "0rem 1.25rem",
    },
    headingBlock: {
        display: "flex",
        padding: "1.75rem 1.25rem 0rem 1.25rem",
    },
    heading: {
        fontFamily: "DM Sans",
        fontSize: "1.1rem",
        fontWeight: 700,
        lineHeight: "1rem",
        marginRight: "auto",
    },
    subHeading: {
        fontFamily: "DM Sans",
        fontSize: ".9rem",
        fontWeight: 400,
        marginRight: "auto",
        padding: "0rem .5rem 1.25rem 1.25rem",
        marginTop: ".5rem",
    },
    selectInputContainer: {
        borderRadius: "0.2rem",
        marginTop: "1rem",
        width: "100%",
        fontWeight: 500,
        fontFamily: "DM Sans",
        color: "#fff",
        fontSize: "1rem",
        borderWidth: 0,
    },
    selectBox: {
        borderRadius: "0.2rem",
        width: "100%",
        padding: ".75rem",
    },
    button: {
        background: "#5B76F7",
        border: "1px solid #5B76F7",
        padding: "0.7rem 0.9rem",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
        fontWeight: 700,
        fontFamily: "DM Sans",
        marginTop: "1rem",
        textAlign: "center",
        borderRadius: "0.2rem",
    },
    watchBlock: {
        display: "flex",
        width: "auto",
        margin: "0 auto",
        marginTop: "2.75rem",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textDecoration: "none",
    },
    watchText: {
        marginLeft: "1.1rem",
        fontFamily: "DM Sans",
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "#fff",
    },
    smallButton: {
        background: "#04040E",
        display: "inline-block",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "0.2rem",
        fontWeight: 500,
        fontFamily: "DM Sans",
        fontSize: "0.84rem",
        color: "#fff",
        padding: "0.5rem 2.7rem",
        cursor: "pointer",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "1rem",
        marginBottom: "2.5rem",
        width: "auto",
    },
};
exports.default = App;
//# sourceMappingURL=app.js.map