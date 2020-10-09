import {Ref} from "preact";
import React from "preact/compat";
import {useRef, useState} from "preact/hooks";
import {MODALS} from "../../constants/modal";
import {AssertModal} from "./components/assertModal";
import {SeoModal} from "./components/seoModal";
import devices from "../../../../crusher-shared/constants/devices";
import userAgents from "../../../../crusher-shared/constants/userAgents";
import {addHttpToURLIfNotThere, getQueryStringParams, resolveToBackendPath} from "../../../../crusher-shared/utils/url";
import {NOT_RECORDING, START_INSPECTING_RECORDING_MODE, START_NON_INSPECTING_RECORDING_MODE,} from "../../constants";
import {META_ACTIONS, SETTINGS_ACTIONS} from "../../constants/actionTypes";
import {ACTIONS_IN_TEST} from "../../constants/domEventsToRecord";
import {sendPostDataWithForm} from "../../utils/helpers";

export const ACTION_FORM_TYPE = {
    PAGE_ACTIONS: "PAGE_ACTIONS",
    ELEMENT_ACTIONS: "ELEMENT_ACTIONS",
};

function RecordingIcon(props: any) {
    return (
        <svg height="512pt" viewBox="0 0 512 512" width="512pt" {...props}>
            <path
                d="M512 256c0 141.387-114.613 256-256 256S0 397.387 0 256 114.613 0 256 0s256 114.613 256 256zm0 0"
                fill="#e76e54"
            />
            <path
                d="M384 256c0 70.691-57.309 128-128 128s-128-57.309-128-128 57.309-128 128-128 128 57.309 128 128zm0 0"
                fill="#dd523c"
            />
        </svg>
    );
}

function Step(props: any) {
    const {type, path, value} = props;
    return (
        <li style={styles.step}>
            <div style={styles.stepImage}>
                <img src={chrome.runtime.getURL("icons/mouse.svg")}/>
            </div>
            <div style={{...styles.stepTextContainer}}>
                <div style={styles.stepAction}>{type}</div>
                <div style={{width: "70%", overflow: "hidden"}}>
                    <div style={styles.stepSelector}>{value || path}</div>
                </div>
            </div>
            <div style={styles.centerItemsVerticalFlex}>
                <img
                    style={styles.stepGoImage}
                    src={chrome.runtime.getURL("icons/arrow.svg")}
                />
            </div>
        </li>
    );
}

function Steps(props: any) {
    const {steps} = props;

    const stepList = steps.map((step: any) => {
        console.log(step);
        const {event_type, selectors, value} = step;
        return (
            <Step
                type={event_type}
                path={selectors && selectors[0].value}
                value={value}
            />
        );
    });

    return (
        <div
            style={{
                height: 300,
                minHeight: "50%",
                overflowY: "auto",
                marginBottom: "2rem",
            }}
        >
            <ul style={styles.stepsContainer} className="margin-list-item">
                {stepList}
            </ul>
        </div>
    );
}

function Actions(props: any) {
    const {iframeRef, type, isShowingElementFormCallback, updateState} = props;
    const pageActions = [
        {
            id: SETTINGS_ACTIONS.INSPECT_MODE_ON,
            value: "Inspect",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.SHOW_SEO_MODAL,
            value: "SEO",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        // {
        //     id: ACTION_TYPES.CAPTURE_CONSOLE,
        //     value: "Console",
        //     icon: chrome.runtime.getURL("icons/action.svg")
        // }
        // ,
        // {
        //     id: ACTION_TYPES.NETWORK,
        //     value: "Network",
        //     icon: chrome.runtime.getURL("icons/action.svg")
        // }
    ];

    const elementActions = [
        {
            id: SETTINGS_ACTIONS.CLICK_ON_ELEMENT,
            value: "Click",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.HOVER_ON_ELEMENT,
            value: "Hover",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT,
            value: "Blackout",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: SETTINGS_ACTIONS.SHOW_ASSERT_ELEMENT_MODAL,
            value: "Assert",
            icon: chrome.runtime.getURL("icons/action.svg")
        }
    ];

    function handleElementActionClick(actionType: string, updateState: Function) {
        const cn = iframeRef.current.contentWindow;
        console.log(actionType);

        switch (actionType) {
            case SETTINGS_ACTIONS.INSPECT_MODE_ON:
                cn.postMessage(
                    {
                        type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
                        formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT:
                cn.postMessage(
                    {
                        type: SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
                        formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.SHOW_SEO_MODAL:
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.VALIDATE_SEO,
                        formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                        value: true
                    },
                    "*"
                );
                updateState(MODALS.SEO);
                break;
            case SETTINGS_ACTIONS.START_CAPTURING_CONSOLE:
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.CAPTURE_CONSOLE,
                        formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.CLICK_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.CLICK,
                        formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.HOVER_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.HOVER,
                        formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.SHOW_ASSERT_ELEMENT_MODAL:
                updateState(MODALS.ASSERT_ELEMENT);
                break;
            case SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT:
                isShowingElementFormCallback(false);
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
                        formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
            case SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage(
                    {
                        type: ACTIONS_IN_TEST.BLACKOUT,
                        formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                        value: true,
                    },
                    "*"
                );
                break;
        }
    }

    const out = [];
    const actions =
        type === ACTION_FORM_TYPE.ELEMENT_ACTIONS ? elementActions : pageActions;

    for (let i = 0; i < actions.length; i += 2) {
        const shouldAddMarginRight = i % 2 && i !== actions.length - 1;
        out.push(
            <div style={styles.actionRow}>
                <div
                    style={
                        shouldAddMarginRight
                            ? {...styles.actionItem, ...styles.oddItem}
                            : {...styles.actionItem, ...styles.oddItem}
                    }
                    id={actions[i].id}
                    onClick={() => {
                        handleElementActionClick(actions[i].id, updateState);
                    }}
                >
                    <img style={styles.actionImage} src={actions[i].icon}/>
                    <span style={styles.actionText}>{actions[i].value}</span>
                </div>
                {i + 1 < actions.length && (
                    <div
                        style={
                            shouldAddMarginRight
                                ? {...styles.actionItem, ...styles.oddItem}
                                : {...styles.actionItem, ...styles.oddItem}
                        }
                        id={actions[i + 1].id}
                        onClick={() => {
                            handleElementActionClick(actions[i+1].id, updateState);
                        }}
                    >
                        <img style={styles.actionImage} src={actions[i + 1].icon}/>
                        <span style={styles.actionText}>{actions[i + 1].value}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{...styles.actionListContainer, marginTop: "2rem"}}>
            {out}
        </div>
    );
}

function DesktopBrowser(props: any) {
    const selectedDeviceId = getQueryStringParams("device", window.location.href);
    const urlParams = getQueryStringParams("url", window.location.href);
    const urlEncoded = urlParams ? new URL(urlParams) : null;
    const url = urlEncoded
        ? decodeURI(urlEncoded.toString().replace(/^["']/, "").replace(/["']$/, ""))
        : "https://google.com";
    const {forwardRef} = props;
    const addressInput: any = useRef(null);
    const [addressValue, setAddressValue] = useState(url);

    const deviceInfoIndex = devices.findIndex(
        (device) => device.id === selectedDeviceId
    );

    const selectedDevice = deviceInfoIndex
        ? devices[deviceInfoIndex]
        : devices[8];

    const isMobile = ["Pixel 3, 3 XL", "iPhone 8 Plus, 7 Plus, 6S Plus"].includes(
        selectedDevice.name
    );

    function handleKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            setAddressValue(
                addHttpToURLIfNotThere(addressInput.current.innerText.trim())
            );
        }
    }

    function goBack() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({type: SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true}, "*");
    }

    function goForward() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({type: SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL, value: true}, "*");
    }

    function refreshPage() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({type: SETTINGS_ACTIONS.REFRESH_PAGE, value: true}, "*");
    }

    function Addressbar() {
        const urlEncoded = new URL(addressValue);
        urlEncoded.searchParams.delete("__crusherAgent__");
        return (
            <div style={styles.addressBar}>
                <div
                    style={{
                        width: "1.75rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img
                        style={{width: "0.8rem"}}
                        src={chrome.runtime.getURL("/icons/ssl.svg")}
                    />
                </div>
                <div
                    ref={addressInput}
                    style={styles.addressBarInput}
                    onKeyDown={handleKeyDown}
                    contentEditable={true}
                >
                    {urlEncoded.toString().substr(0, 50)}
                </div>
                <div style={styles.recordingStatus}>
                    <RecordingIcon
                        height={12}
                        width={12}
                        style={{marginRight: ".5rem"}}
                    />
                    Recording Test
                </div>
            </div>
        );
    }

    function Toolbar() {
        return (
            <div style={styles.browserToolbar}>
                <div style={styles.browserSmallShadow}/>
                <div style={styles.browserMainToolbar}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img
                            src={chrome.runtime.getURL("/icons/navigation-back.svg")}
                            onClick={goBack}
                        />
                    </div>
                    <div
                        style={{
                            marginLeft: "0.7rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={chrome.runtime.getURL("/icons/navigation-forward.svg")}
                            onClick={goForward}
                        />
                    </div>
                    <div
                        style={{
                            marginLeft: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            style={{width: "1.1rem"}}
                            src={chrome.runtime.getURL("/icons/navigation-refresh.svg")}
                            onClick={refreshPage}
                        />
                    </div>
                    <Addressbar/>
                </div>
            </div>
        );
    }

    const IframeSection = () => {
        return (
            <div style={styles.previewBrowser}>
                {isMobile && (
                    <div
                        className="smartphone"
                        style={{
                            width: selectedDevice.width,
                            height: selectedDevice.height,
                        }}
                    >
                        <div className="content" style={{width: "100%", height: "100%"}}>
                            <iframe
                                ref={forwardRef}
                                style={{
                                    ...styles.browserFrame,
                                    width: "100%",
                                    height: "100%",
                                }}
                                scrolling="auto"
                                sandbox="allow-scripts allow-forms allow-same-origin"
                                id="screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634"
                                title={selectedDevice.name}
                                src={addressValue}
                            />
                        </div>
                    </div>
                )}
                {!isMobile && (
                    <iframe
                        ref={forwardRef}
                        style={{
                            ...styles.browserFrame,
                            width: selectedDevice.width,
                            height: selectedDevice.height,
                        }}
                        scrolling="auto"
                        id="screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634"
                        sandbox="allow-scripts allow-forms allow-same-origin"
                        title={selectedDevice.name}
                        src={addressValue}
                    />
                )}
            </div>
        );
    }

    return (
        <div style={styles.mainContainer}>
            <div style={styles.browser}>
                <Toolbar/>
                {IframeSection()}
            </div>
        </div>
    );
}

let messageListenerCallback: any = null;

window.addEventListener("message", (event) => {
    if (messageListenerCallback) {
        messageListenerCallback(event);
    }
});

function App() {
    const selectedDeviceId = getQueryStringParams("device", window.location.href);

    const [steps, setSteps] = useState([
        {
            event_type: ACTIONS_IN_TEST.SET_DEVICE,
            selectors: [{value: "body", uniquenessScore: 1, type: "body"}],
            value: selectedDeviceId,
        },
    ]);
    const [seoMeta, setSeoMeta] = useState({});
    const [isRecording, setIsRecording] = useState(false);
    const [isShowingElementForm, setIsShowingElementForm] = useState(false);
    const [isUsingElementInspector] = useState(false);
    const [currentElementSelectors, setCurrentElementSelectors] = useState(null);
    const [currentElementAttributes, setCurrentElementAttributes] = useState(null);

    const iframeRef : Ref<any> = useRef(null);

    function getSteps() {
        return steps;
    }

    function saveSeoValidation(options: any) {
        setSteps([...getSteps(), {event_type: ACTIONS_IN_TEST.VALIDATE_SEO, value: options, selectors: ["body"]}] as any);
    }

    function saveAssertionCallback(options: any){
        setSteps([...getSteps(), {event_type: ACTIONS_IN_TEST.ASSERT_ELEMENT, value: options, selectors: currentElementSelectors}] as any);
    }

    messageListenerCallback = function (event: any) {
        const {type, eventType, value, selectors} = event.data;
        const steps = getSteps();
        if (eventType) {
            const lastStep = steps[steps.length - 1];
            if (!lastStep) {
                setSteps([...getSteps(), {event_type: eventType, value, selectors}]);
            } else {
                const navigateEventExist = steps.find(
                    (step) => step.event_type === ACTIONS_IN_TEST.NAVIGATE_URL
                );

                if (navigateEventExist && eventType === ACTIONS_IN_TEST.NAVIGATE_URL) {
                } else {
                    if (
                        lastStep.event_type === ACTIONS_IN_TEST.INPUT &&
                        eventType === ACTIONS_IN_TEST.INPUT &&
                        lastStep.selectors[0].value === selectors[0].value
                    ) {
                        steps[steps.length - 1].value = value;
                        setSteps(steps);
                    } else {
                        setSteps([
                            ...getSteps(),
                            {event_type: eventType, value, selectors},
                        ]);
                    }
                }
            }
        } else if (type) {
            const cn = iframeRef.current.contentWindow;
            switch (type) {
                case SETTINGS_ACTIONS.SHOW_ELEMENT_FORM_IN_SIDEBAR:
                    setIsShowingElementForm(true);
                    setCurrentElementSelectors(selectors);
                    setCurrentElementAttributes(event.data.attributes);
                    break;
                case SETTINGS_ACTIONS.START_RECORDING:
                    setIsRecording(true);
                    break;
                // case ACTION_TYPES.TOOGLE_INSPECTOR:
                //     setIsUsingElementInspector(!isUsingElementInspector);
                //     break;
                case META_ACTIONS.FETCH_RECORDING_STATUS:
                    cn.postMessage(
                        {
                            type: META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE,
                            value: isUsingElementInspector
                                ? START_INSPECTING_RECORDING_MODE
                                : isRecording
                                    ? START_NON_INSPECTING_RECORDING_MODE
                                    : NOT_RECORDING,
                            isFromParent: true,
                        },
                        "*"
                    );
                    break;
                case META_ACTIONS.FETCH_USER_AGENT:
                    const iframeURL = getQueryStringParams("url", window.location.href) as string;
                    const crusherAgent = getQueryStringParams(
                        "__crusherAgent__",
                        iframeURL
                    );
                    const userAgent = userAgents.find(
                        (agent) => agent.name === (crusherAgent || userAgents[6].value)
                    );
                    cn.postMessage(
                        {type: META_ACTIONS.FETCH_USER_AGENT_RESPONSE, value: userAgent},
                        "*"
                    );
                    break;
                case META_ACTIONS.FETCH_SEO_META_RESPONSE:
                    setSeoMeta({title: value.title, description: value.description});
                    break;
            }
        }
    };

    function saveTest() {
        sendPostDataWithForm(resolveToBackendPath("/test/goToEditor"), {
            events: escape(JSON.stringify(steps)),
        });
    }

    function cancelTest() {
        if (isShowingElementForm) {
            setIsShowingElementForm(false);
            setCurrentElementSelectors(null);
            setCurrentElementAttributes(null);
        } else {
            window.close();
        }
    }

    function RightBottomSection() {
        return (
            <div style={{display: "flex", marginTop: "auto"}}>
                <div
                    onClick={cancelTest}
                    style={{
                        marginLeft: "auto",
                        width: "auto",
                        marginRight: "3rem",
                        color: "#fff",
                        cursor: "pointer",
                        fontFamily: "DM Sans",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    Stop
                </div>
                <div style={{...styles.button, width: "auto"}} onClick={saveTest}>
                    <img
                        style={styles.buttonImage}
                        src={chrome.runtime.getURL("icons/record.svg")}
                    />
                    <span>Save Test</span>
                </div>
            </div>
        );
    }

    function RightMiddleSection(props: any) {
        const isElementSelected = isShowingElementForm;
        return isElementSelected ? (
            <>
                <div style={styles.sectionHeading}>Element Actions</div>
                <Actions
                    type={ACTION_FORM_TYPE.ELEMENT_ACTIONS}
                    isShowingElementFormCallback={setIsShowingElementForm}
                    iframeRef={iframeRef}
                    updateState={updateState}
                />
            </>
        ) : (
            <>
                <div style={styles.sectionHeading}>Actions</div>
                <Actions
                    type={ACTION_FORM_TYPE.PAGE_ACTIONS}
                    isShowingElementFormCallback={setIsShowingElementForm}
                    iframeRef={iframeRef}
                    updateState={updateState}
                />
            </>
        );
    }

    const [state, updateState] = useState(null);

    function RightSection() {
        return (
            <div style={{...styles.sidebar, ...styles.paddingContainer}}>
                <div style={styles.sectionHeading}>Steps</div>
                <Steps steps={steps}/>
                <RightMiddleSection state={state} updateState={updateState}/>
                <RightBottomSection/>
            </div>
        );
    }

    // @ts-ignore
    return (
        <div style={styles.container}>
            <DesktopBrowser forwardRef={iframeRef}/>
            <RightSection/>
            <style>
                {`
                    html, body{
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        font-size: 20px;
                    }
                    .margin-list-item li:not(:first-child){
                        margin-top: 0.75rem;
                    }
                    /* The device with borders */
                    .smartphone {
                        position: relative;
                        width: 360px;
                          height: 640px;
                          margin: auto;
                          border: 16px black solid;
                          border-top-width: 60px;
                          border-bottom-width: 60px;
                          border-radius: 36px;
                    }
                    
                    /* The horizontal line on the top of the device */
                    .smartphone:before {
                      content: '';
                      display: block;
                      width: 60px;
                      height: 5px;
                      position: absolute;
                      top: -30px;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 10px;
                    }

                    /* The circle on the bottom of the device */
                    .smartphone:after {
                      content: '';
                      display: block;
                      width: 35px;
                      height: 35px;
                      position: absolute;
                      left: 50%;
                      bottom: -65px;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 50%;
                    }

                    /* The screen (or content) of the device */
                    .smartphone .content {
                      width: 360px;
                      height: 640px;
                      background: white;
                    }
                `}
            </style>
            <link
                rel="stylesheet"
                href={chrome.runtime.getURL("/styles/devices.min.css")}
            />
            <link
                rel="stylesheet"
                href={chrome.runtime.getURL("/styles/fonts.css")}
            />
            <AssertModal attributes={currentElementAttributes} seoMeta={seoMeta} state={state} updateState={updateState} saveAssertionCallback={saveAssertionCallback}/>
            <SeoModal seoMeta={seoMeta} state={state} updateState={updateState} saveSeoValidationCallback={saveSeoValidation}/>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "auto",
        background: "rgb(40, 40, 40)",
    },
    mainContainer: {
        flex: 1,
        width: "70%",
        maxHeight: "100vh",
        overflow: "auto",
    },
    sidebar: {
        background: "#141528",
        display: "flex",
        flexDirection: "column",
        maxWidth: "19rem",
        marginLeft: "auto",
        maxHeight: "100vh",
    },
    centerItemsVerticalFlex: {
        display: "flex",
        alignItems: "center",
    },
    sectionHeading: {
        fontFamily: "DM Sans",
        fontSize: "0.9rem",
        fontWeight: 700,
        marginBottom: "0rem",
        color: "#fff",
    },
    paddingContainer: {
        padding: "1.9rem 1.25rem",
    },
    stepsContainer: {
        listStyle: "none",
        padding: 0,
    },
    step: {
        display: "flex",
        cursor: "pointer",
        fontFamily: "DM Sans",
        fontStyle: "normal",
        background: "#0C0C1F",
        borderRadius: "0.25rem",
        padding: "0.6rem 0",
        overflow: "hidden",
    },
    stepImage: {
        padding: "0rem 0.9rem",
    },
    stepTextContainer: {
        flex: 1,
    },
    stepAction: {
        fontWeight: "bold",
        color: "#9393BC",
        fontSize: "0.8rem",
    },
    stepSelector: {
        marginTop: "0.25rem",
        color: "#fff",
        fontSize: "0.6rem",
        whiteSpace: "nowrap",
    },
    stepGoImage: {
        paddingRight: "0.75rem",
    },
    browser: {
        background: "rgb(40, 40, 40)",
        minHeight: "100vh",
        overflow: "hidden",
    },
    browserToolbar: {
        display: "flex",
        flexDirection: "column",
    },
    browserSmallShadow: {
        background: "rgb(53, 57, 74)",
        height: "0.4rem",
    },
    browserMainToolbar: {
        background: "rgb(53, 57, 74)",
        display: "flex",
        padding: "0.25rem 0.75rem",
    },
    addressBar: {
        width: "65%",
        padding: "0 0.1rem",
        background: "#2b2e37",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        borderRadius: "1rem",
        marginLeft: "0.9rem",
        height: "1.3rem",
    },
    addressBarInput: {
        flex: 1,
        fontSize: "0.7rem",
        outline: "none",
        display: "flex",
        marginLeft: "0.1rem",
        alignItems: "center",
    },
    recordingStatus: {
        background: "#1E2027",
        color: "#64707C",
        lineHeight: "1.15rem",
        fontSize: "0.6rem",
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
        fontFamily: "DM Sans",
        padding: "0 0.8rem",
    },
    previewBrowser: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        paddingTop: "3rem",
        overflowY: "auto",
        background: "rgb(40, 40, 40)",
    },
    browserFrame: {
        border: "none",
        display: "block",
        borderRadius: 2,
        width: 1280,
        height: 800,
        backgroundColor: "#fff",
    },
    button: {
        background: "#0C0C1F",
        boxShadow: "inset 0px 1px 13px 4px #070718",
        borderRadius: 4,
        fontWeight: 600,
        fontSize: "0.825rem",
        color: "#fff",
        fontFamily: "DM Sans",
        padding: "0.65rem 1rem",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    buttonImage: {
        marginRight: "1.2rem",
    },
    actionListContainer: {
        display: "flex",
        flexDirection: "column",
    },
    actionRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
    },
    actionItem: {
        padding: "0.8rem 0.8rem",
        fontFamily: "DM Sans",
        fontWeight: "bold",
        fontSize: "0.8rem",
        color: "#fff",
        background: "#0D0D20",
        boxShadow: "inset 0px 0px 15px 1px rgba(7, 7, 26, 0.7)",
        borderRadius: "0.2rem",
        width: "6.5rem",
        display: "flex",
        cursor: "pointer",
    },
    actionImage: {},
    actionText: {
        marginLeft: "auto",
    },
    oddItem: {
        marginRight: "1rem",
    },
};

export default App;
