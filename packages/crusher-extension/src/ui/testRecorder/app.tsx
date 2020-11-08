import {Ref} from "preact";
import React from "preact/compat";
import {useCallback, useRef, useState} from "preact/hooks";
import {MODALS} from "../../constants/modal";
import _devices from "../../../../crusher-shared/constants/devices";
import userAgents from "../../../../crusher-shared/constants/userAgents";
import {addHttpToURLIfNotThere, getQueryStringParams, resolveToBackendPath} from "../../../../crusher-shared/utils/url";
import {NOT_RECORDING, START_INSPECTING_RECORDING_MODE, START_NON_INSPECTING_RECORDING_MODE,} from "../../constants";
import {META_ACTIONS, SETTINGS_ACTIONS} from "../../constants/actionTypes";
import {ACTIONS_IN_TEST} from "../../../../crusher-shared/constants/recordedActions";
import {sendPostDataWithForm} from "../../utils/helpers";
import {AssertModal} from "./components/assertModal";

const devices: any = _devices;

export const ACTION_FORM_TYPE = {
    PAGE_ACTIONS: "PAGE_ACTIONS",
    ELEMENT_ACTIONS: "ELEMENT_ACTIONS",
};

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
    const {steps, forwardRef} = props;

    const stepList = steps.map((step: any) => {
        console.log(step);
        const {event_type, selectors, value} = step;

        return (
            <Step
                type={event_type}
                path={selectors && selectors[0].value}
                value={event_type === ACTIONS_IN_TEST.SCROLL ? `Performing scroll` : value}
            />
        );
    });

    return (
        <div
            style={{
                height: 100,
                minHeight: "50%",
                overflowY: "auto",
                marginBottom: "2rem",
            }}
            ref={forwardRef}
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
            value: "Element",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Take screenshot, add assertion"
        },
        {
            id: SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Take page screenshot"
        },
        {
            id: SETTINGS_ACTIONS.SHOW_SEO_MODAL,
            value: "SEO",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Select Element"
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
            desc: "Click on the element"
        },
        {
            id: SETTINGS_ACTIONS.HOVER_ON_ELEMENT,
            value: "Hover",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Add a hover action to element"
        },
        {
            id: SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Take screenshot of element"
        },
        {
            id: SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT,
            value: "Blackout",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Blackout element in test results"
        },
        {
            id: SETTINGS_ACTIONS.SHOW_ASSERT_ELEMENT_MODAL,
            value: "Assert",
            icon: chrome.runtime.getURL("icons/action.svg"),
            desc: "Setup Assertion for Element"
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
                        type: META_ACTIONS.FETCH_SEO_META,
                        formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                        value: true
                    },
                    "*"
                );
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

    for (let i = 0; i < actions.length; i++) {
        out.push(
            <div style={styles.actionRow}>
                <div
                    style={{...styles.actionItem}}
                    id={actions[i].id}
                    onClick={() => {
                        handleElementActionClick(actions[i].id, updateState);
                    }}
                >
                    <img style={styles.actionImage} src={actions[i].icon}/>
                    <div style={styles.actionContent}>
                        <span style={styles.actionText}>{actions[i].value}</span>
                        <span style={styles.actionDesc}>{actions[i].desc}</span>
                    </div>
                </div>
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
        (device: any) => device.id === selectedDeviceId
    );

    const selectedDevice = deviceInfoIndex
        ? devices[deviceInfoIndex]
        : devices[8];

    const isMobile = devices.filter((device: any) => device.mobile === true).map((device: any) => device.name).includes(
        selectedDevice.name
    );

    function handleKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            setAddressValue(
                addHttpToURLIfNotThere(addressInput.current.innerText.trim())
            );
        }
    }


    function handleKeyPress(event: KeyboardEvent) {
        const cn = forwardRef.current.contentWindow;
        if (event.key === "q") {
            cn.postMessage(
                {
                    type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
                    formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
                    value: true,
                },
                "*"
            );
        }
    }

    document.body.addEventListener("keypress", handleKeyPress, true);

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
                        paddingLeft: "0.5rem"
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
            </div>
        );
    }

    function Toolbar() {
        return (
            <div style={styles.browserToolbar}>
                <div style={styles.browserMainToolbar}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <svg width={24} height={24} viewBox="0 0 48 1" onClick={goBack}>
                            <title>{"Rectangle 5"}</title>
                            <path d="M0 0h48v1H0z" fill="#063855" fillRule="evenodd" />
                        </svg>
                    </div>
                    <div
                        style={{
                            marginLeft: "0.7rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <svg fill="#5F6368" viewBox="0 0 24 24" width={24} height={24} onClick={refreshPage}>
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </div>
                    <div
                        style={{
                            marginLeft: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <svg fill="#5F6368" viewBox="0 0 24 24" width={24} height={24} onClick={goForward}>
                            <path
                                d="M-20-11h12.17l-5.59 5.59L-12-4l8-8-8-8-1.41 1.41L-7.83-13H-20v2z"
                                style={{
                                    transformBox: "fill-box",
                                    transformOrigin: "center",
                                }}
                            />
                        </svg>
                    </div>
                    <Addressbar/>
                    <div style={{...styles.button, width: "auto", marginLeft: "auto"}} onClick={props.saveTest}>

                        <img
                            style={styles.buttonImage}
                            src={chrome.runtime.getURL("icons/record.svg")}
                        />
                        <span>Save Test</span>
                    </div>
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


function ShowRowInput(props: any) {
    const {name, nameOptions, rowKey, method, updateMethodCallback, updateSelectedSeoField, value, valuesMap, updateFieldValueCallback} = props;
    const nameOptionsOut = nameOptions.map((option: string) => {
        return (
            <option value={option}>{option}</option>
        );
    });

    function onChangeSeoField(event: any) {
        updateSelectedSeoField(rowKey, event.target.value);
    }

    function handleMethodChange(event: any) {
        updateMethodCallback(rowKey, name, event.target.value);
    }

    function updateFieldValue(event: any) {
        updateFieldValueCallback(rowKey, name, event.target.value);
    }

    function checkIfCorrectValue() {
        console.log("check called", method, value, valuesMap, name);
        if (method === "matches") {
            return value === valuesMap[name].value
        } else if (method === "contains") {
            return valuesMap[name].value && valuesMap[name].value.includes(value);
        } else if (method === "regex") {
            try {
                const rgx = new RegExp(value);
                if (rgx.test(valuesMap[name].value)) {
                    return true;
                } else {
                    throw new Error("Regex didn't match");
                }
            } catch (err) {
                return false;
            }
        }
        return false;
    }

    return (
        <tr style={styles.inputTableGridItem}>
            <th style={styles.inputTableGridItemLabel}>
                <select style={{...styles.select}} onChange={onChangeSeoField} value={name}>
                    {nameOptionsOut}
                </select>
                <img src={chrome.runtime.getURL(checkIfCorrectValue() ? "/icons/correct.svg" : "/icons/cross.svg")}
                     style={{marginLeft: "0.85rem"}}/>
            </th>
            <th style={styles.inputTableGridOption}>
                <select style={{...styles.select}} value={method} onChange={handleMethodChange}>
                    <option value="matches">matches</option>
                    <option value="contains">contains</option>
                    <option value="regex">regex</option>
                </select>
            </th>
            <th style={styles.inputTableGridOptionValue}>
                <input onChange={updateFieldValue} placeholder={"Enter value"} value={value}
                       style={styles.inputTableGridOptionValueInput}/>
            </th>
        </tr>
    )
}

function ShowSEOForm({seoMeta, saveSEOAssertionCallback}: any) {
    const {title, metaTags} = seoMeta;
    const [seoMetaRowNames, setSeoMetaRowNames] = useState({});
    const [seoMetaRows, setSeoMetaRows] = useState({});
    const [seoMetaRowsMethods, setSeoMetaRowsMethods] = useState({} as any);
    const [seoMetaValues, setSeoMetaValues] = useState({} as any);
    const _latestSeoMetaRowNames = useRef({});
    const _latestSeoMetaRows = useRef({});
    const _latestSeoMethodRows = useRef({});
    const _latestSeoMetaValues = useRef({});

    const seoOptionsMap = {
        "title": {
            name: "title",
            value: title
        },
        ...metaTags
    }

    const nameOptions = Object.keys(seoOptionsMap).map((seoFieldName) => {
        return seoOptionsMap[seoFieldName].name
    });

    const saveSEOAssertion = () => {
        const savedFields = Object.keys(_latestSeoMetaRowNames.current as any).map((rowKey) => {
            //@ts-ignore
            return {fieldName: _latestSeoMetaRowNames.current[rowKey],  method: _latestSeoMethodRows.current[rowKey], fieldValue: _latestSeoMetaValues.current[rowKey]}
        });
        return saveSEOAssertionCallback(savedFields);
    }

    const updateSEOFieldValue = useCallback((rowKey: string, fieldName: string, fieldValue: string) => {
        let _seoMetaRows: any = _latestSeoMetaRows.current;
        let _seoMetaValues: any = _latestSeoMetaValues.current;

        _seoMetaRows[rowKey] = (
            //@ts-ignore
            <ShowRowInput rowKey={rowKey} value={fieldValue} updateFieldValueCallback={updateSEOFieldValue} method={_latestSeoMethodRows.current[rowKey]} updateMethodCallback={updateMethodForSeoField}  updateSelectedSeoField={updateSelectedSeoField} nameOptions={nameOptions} name={fieldName}  valuesMap={seoOptionsMap}/>
        );
        _seoMetaValues[rowKey] = fieldValue;

        setSeoMetaRows({..._seoMetaRows});
        setSeoMetaValues({
            ..._seoMetaValues,
            [rowKey]: name
        });

        _latestSeoMetaRows.current = _seoMetaRows;
        _latestSeoMetaValues.current = _seoMetaValues;

    }, [seoMetaRows, seoMetaValues]);

    const updateSelectedSeoField = useCallback((rowKey: string, name: string) => {
        let _seoMetaRows: any = _latestSeoMetaRows.current;
        let _seoMetaRowNames: any = _latestSeoMetaRowNames.current;
        let _seoMetaRowValues: any = _latestSeoMetaValues.current;

        _seoMetaRowNames[rowKey] = name;
        _seoMetaRowValues[rowKey] = seoOptionsMap[name].value;
        setSeoMetaRowNames(_seoMetaRowNames);
        setSeoMetaRows({..._seoMetaRows});
        setSeoMetaValues({..._seoMetaRowValues});
        _latestSeoMetaRowNames.current = _seoMetaRowNames;
        _latestSeoMetaRows.current = _seoMetaRows;
        _latestSeoMetaValues.current = _seoMetaRowValues;
    }, [seoMetaRows, seoMetaRowsMethods]);

    const updateMethodForSeoField = useCallback((rowKey: string, fieldName: string, name: string) => {
        let _seoMetaRows: any = _latestSeoMetaRows.current;
        let _seoMetaMethods: any = _latestSeoMethodRows.current;

        _seoMetaMethods[rowKey] = name;

        setSeoMetaRows({..._seoMetaRows});
        setSeoMetaRowsMethods({
            ..._seoMetaMethods
        });

        _latestSeoMetaRows.current = _seoMetaRows;
        _latestSeoMethodRows.current = _seoMetaMethods;
    }, [seoMetaRows, seoMetaRowsMethods]);

    const autoGenerateSeoMetaRows = useCallback(() => {
        let _seoMetaRowNames: any = _latestSeoMetaRowNames.current;

        let _seoMetaRows: any = {};
        let _seoMetaMethods: any = {};
        let _seoMetaValues: any = {};

        Object.values(seoOptionsMap ? seoOptionsMap : {}).map((meta: any) => {
            const key = window.performance.now() + "_" + Math.random().toString(36).substr(2, 9);
            setSeoMetaRowsMethods({
                ...seoMetaRowsMethods,
                [key]: "matches"
            });
            setSeoMetaRowNames({
                ...seoMetaRowNames,
                [key]: meta.name
            });
            _seoMetaMethods[key] = "matches";
            _seoMetaValues[key] = meta.value;
            _seoMetaRowNames[key] = meta.name;
        });

        setSeoMetaRows(_seoMetaRows);
        _latestSeoMetaRowNames.current = _seoMetaRowNames;
        _latestSeoMetaRows.current = _seoMetaRows;
        _latestSeoMethodRows.current = _seoMetaMethods;
        _latestSeoMetaValues.current = _seoMetaValues;

    }, [seoMetaRows, seoMetaRowsMethods]);

    const createRow = useCallback(() => {
        const key = window.performance.now() + "_" + Math.random().toString(36).substr(2, 9);
        const seoMetaRowNames = _latestSeoMetaRowNames.current as any;
        let seoMetaMethods: any = _latestSeoMethodRows.current as any;
        let seoMetaValues: any = _latestSeoMetaValues.current as any;

        setSeoMetaRowsMethods({
            ...seoMetaMethods,
            [key]: "matches"
        });
        _latestSeoMethodRows.current = {
            ...seoMetaMethods,
            [key]: "matches"
        };

        setSeoMetaRowNames({
            ...seoMetaRowNames,
            [key]: nameOptions[0]
        });
        _latestSeoMetaRowNames.current = {
            ...seoMetaRowNames,
            [key]: nameOptions[0]
        };

        setSeoMetaValues({
            ...seoMetaValues,
            [key]: seoOptionsMap[nameOptions[0]].value
        })
        _latestSeoMetaValues.current = {
            ...seoMetaValues,
            [key]: seoOptionsMap[nameOptions[0]].value
        };

    }, [seoMetaRows, seoMetaRowsMethods]);

    const seoMetaRowsOut = Object.keys(_latestSeoMetaRowNames.current).map((rowKey: string) => {
        return (
            //@ts-ignore
            <ShowRowInput value={_latestSeoMetaValues.current[rowKey]} rowKey={rowKey} updateFieldValueCallback={updateSEOFieldValue} updateMethodCallback={updateMethodForSeoField} updateSelectedSeoField={updateSelectedSeoField} nameOptions={nameOptions} name={_latestSeoMetaRowNames.current[rowKey]} valuesMap={seoOptionsMap} method={_latestSeoMethodRows.current[rowKey]}/>
        )
    })

    return (
        <div style={styles.innerForm}>
            <div style={styles.innerFormHeader}>
                <div style={styles.innerFormHeaderIconContainer}>
                    <img style={styles.innerFormHeaderIcon} src={chrome.runtime.getURL("/icons/browser.svg")}/>
                </div>
                <div style={styles.innerFormHeaderContent}>
                    <div style={styles.innerFormHeaderTitle}>SEO Checks</div>
                    <div style={styles.innerFormHeaderDesc}>These are run when page is loaded</div>
                </div>
                <div style={styles.innerFormHelp}>
                    <img style={styles.innerFormHelpIcon} src={chrome.runtime.getURL("/icons/bulbV2.svg")}/>
                    <div style={{display: "flex", alignItems: "center"}} onClick={autoGenerateSeoMetaRows}>
                        <span style={styles.innerFormHelpLink}>Generate-SEO Checks!</span>
                    </div>
                </div>
            </div>
            <table style={styles.inputTableGrid}>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                {seoMetaRowsOut}
            </table>
            <div style={styles.formBottomRow}>
                <div style={styles.formButtonAdvance} onClick={createRow}>
                    Advance
                </div>
                <div style={{...styles.button, padding: "0.4rem 3rem", marginLeft: "auto"}}
                     onClick={saveSEOAssertion}>Save
                </div>
            </div>
        </div>
    )
}

function ShowForm({state, updateState, seoMeta, submitCallback}: any) {
    function closeForm() {
        updateState(null);
    }

    return (
        <div style={{width: "32rem"}}>
            <div style={styles.goBack} onClick={closeForm}>
                {"< Go Back"}
            </div>
            <ShowSEOForm saveSEOAssertionCallback={submitCallback} seoMeta={seoMeta}/>
        </div>
    );
}

function App() {
    const selectedDeviceId = getQueryStringParams("device", window.location.href);

    const [steps, setSteps] = useState([
        {
            event_type: ACTIONS_IN_TEST.SET_DEVICE,
            selectors: [{value: "body", uniquenessScore: 1, type: "body"}],
            value: selectedDeviceId as any,
        },
    ]);
    const [seoMeta, setSeoMeta] = useState({});
    const [isRecording, setIsRecording] = useState(false);
    const [isShowingElementForm, setIsShowingElementForm] = useState(false);
    const [isUsingElementInspector] = useState(false);
    const [currentElementSelectors, setCurrentElementSelectors] = useState(null);
    const [currentElementAttributes, setCurrentElementAttributes] = useState(null);
    const [state, updateState] = useState(null);

    const iframeRef: Ref<any> = useRef(null);
    const actionsScrollRef: Ref<any> = useRef(null);

    // useEffect(()=>{
    //     const scrollDiv = actionsScrollRef.current;
    //     scrollDiv.scrollTop = scrollDiv.scrollHeight - scrollDiv.clientHeight;
    // }, [steps, isShowingElementForm]);

    function getSteps() {
        return steps;
    }

    function saveSeoValidation(options: any) {
        console.log("Here are options");
        console.log(options);
        setSteps([...getSteps(), {
            event_type: ACTIONS_IN_TEST.VALIDATE_SEO,
            value: options,
            selectors: ["body"]
        }] as any);
        updateState(null);
    }

    function saveAssertionCallback(options: any) {
        setSteps([...getSteps(), {
            event_type: ACTIONS_IN_TEST.ASSERT_ELEMENT,
            value: options,
            selectors: currentElementSelectors
        }] as any);
        setIsShowingElementForm(false);
    }

    window.onbeforeunload = function () {
        if (steps && steps.length > 2) {
            return "Leaving this page will discard your recorded test, do you still want to leave?";
        } else {
            return false;
        }
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
                    } else if (lastStep.event_type === ACTIONS_IN_TEST.SCROLL && eventType === ACTIONS_IN_TEST.SCROLL && lastStep.selectors[0].value === selectors[0].value) {
                        steps[steps.length - 1] = {event_type: eventType, value: [...lastStep.value, value], selectors};
                        setSteps([
                            ...steps
                        ]);

                    } else {
                        if (eventType === ACTIONS_IN_TEST.SCROLL) {
                            setSteps([
                                ...getSteps(),
                                {event_type: eventType, value: [value], selectors},
                            ]);
                        } else {
                            setSteps([
                                ...getSteps(),
                                {event_type: eventType, value, selectors},
                            ]);
                        }
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
                    setSeoMeta({title: value.title, metaTags: value.metaTags});
                    break;
            }
        }
    };

    // function cancelTest() {
    //     if (isShowingElementForm) {
    //         setIsShowingElementForm(false);
    //         setCurrentElementSelectors(null);
    //         setCurrentElementAttributes(null);
    //     } else {
    //         window.close();
    //     }
    // }

    function RightMiddleSection(props: any) {
        const isElementSelected = isShowingElementForm;
        return isElementSelected ? (
            <>
                <div style={styles.flexRow}>
                    <div style={styles.flexRowHeading}>Select Element Action</div>
                </div>
                <Actions
                    type={ACTION_FORM_TYPE.ELEMENT_ACTIONS}
                    isShowingElementFormCallback={setIsShowingElementForm}
                    iframeRef={iframeRef}
                    updateState={updateState}
                />
            </>
        ) : (
            <>
                <div style={styles.flexRow}>
                    <div style={styles.flexRowHeading}>Select Action</div>
                    {/* <div style={styles.flexRowRightItem}>Use template</div> */}
                </div>
                <Actions
                    type={ACTION_FORM_TYPE.PAGE_ACTIONS}
                    isShowingElementFormCallback={setIsShowingElementForm}
                    iframeRef={iframeRef}
                    updateState={updateState}
                />
            </>
        );
    }


    function RightSection() {
        return (
            <div style={{...styles.sidebar}}>
                <div style={styles.tipContainer}>
                    <div style={styles.bulbIcon}><img src="/icons/bulb.svg" width={31}/></div>
                    <div style={styles.tipContent}>
                        <div style={styles.tipTitle}>Tip of the session</div>
                        <div style={styles.tipDesc}>Click on play to replay selected test</div>
                    </div>
                </div>
                <div style={styles.paddingContainer}>
                    <div style={{width: "22rem", marginLeft: "auto"}}>
                        <div style={styles.sectionHeading}>{steps.length} Actions</div>
                        <Steps forwardRef={actionsScrollRef} steps={steps}/>
                    </div>
                    {state !== MODALS.SEO && (
                        <RightMiddleSection state={state} updateState={updateState}/>
                    )}
                    {state && state === MODALS.SEO && (
                        <ShowForm submitCallback={saveSeoValidation} state={state} seoMeta={seoMeta}
                                  currentElementAttributes={currentElementAttributes}
                                  updateState={updateState} saveAssertionCallback={saveAssertionCallback}
                                  saveSeoValidationCallback={saveSeoValidation}/>
                    )}
                </div>
            </div>
        );
    }

    function saveTest() {
        sendPostDataWithForm(resolveToBackendPath("/test/goToEditor"), {
            events: escape(JSON.stringify(steps)),
        });
    }

    // @ts-ignore
    return (
        <div style={styles.container}>
            <DesktopBrowser saveTest={saveTest} forwardRef={iframeRef}/>
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
            <AssertModal attributes={currentElementAttributes} seoMeta={seoMeta} state={state} updateState={updateState}
                         saveAssertionCallback={saveAssertionCallback}/>

            {/*<AssertModal attributes={currentElementAttributes} seoMeta={seoMeta} state={state} updateState={updateState}*/}
            {/*             saveAssertionCallback={saveAssertionCallback}/>*/}
            {/*<SeoModal seoMeta={seoMeta} state={state} updateState={updateState}*/}
            {/*          saveSeoValidationCallback={saveSeoValidation}/>*/}
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
        background: "#1C1F26",
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.70rem 0 0 0",
        position: "fixed",
        bottom: "0",
        right: "0%",
        marginLeft: "auto",
        maxHeight: "100vh",
    },
    centerItemsVerticalFlex: {
        display: "flex",
        alignItems: "center",
    },
    tipContainer: {
        display: "flex",
        flexDirection: "row",
        background: "#1C1F26",
        borderRadius: "0.62rem 0 0 0",
        padding: "0.88rem 1.63rem"
    },
    bulbIcon: {},
    tipContent: {
        color: "#FFFFFF",
        fontFamily: "DM Sans",
        marginLeft: "0.898rem"
    },
    tipTitle: {
        fontSize: "0.66rem",
        fontWeight: "bold"
    },
    tipDesc: {
        fontSize: "0.64rem",
        marginTop: "0.1rem",
        fontWeight: 500
    },
    sectionHeading: {
        fontFamily: "DM Sans",
        fontSize: "1rem",
        fontWeight: 700,
        marginBottom: "0rem",
        textAlign: "center",
        color: "#fff",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
        fontFamily: "DM Sans",
        fontSize: "0.875rem",
        color: "#fff"
    },
    flexRowHeading: {
        color: "#fff",
        fontWeight: 700
    },
    flexRowRightItem: {
        marginLeft: "auto",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer"
    },
    paddingContainer: {
        padding: "1.1rem 1.25rem",
        position: "relative"
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
        background: "#1C1F26",
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
        color: "#83A3E3",
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
    browserMainToolbar: {
        background: "#141920",
        display: "flex",
        padding: "0.73rem 2rem",
    },
    addressBar: {
        width: "65%",
        padding: "0 0.1rem",
        background: "#1C1F26",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        borderRadius: "0.1rem",
        marginLeft: "0.9rem"
    },
    addressBarInput: {
        flex: 1,
        fontSize: "0.77rem",
        outline: "none",
        display: "flex",
        padding: "0.6rem 0.5rem",
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
        maxWidth: "75%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "1rem",
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
        background: "#5B76F7",
        borderRadius: 4,
        fontWeight: 600,
        fontSize: "0.825rem",
        color: "#fff",
        fontFamily: "DM Sans",
        padding: "0.5rem 1.15rem",
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
        background: "#15181E",
        borderRadius: "0.2rem",
        width: "100%",
        display: "flex",
        cursor: "pointer",
    },
    actionImage: {},
    actionContent: {
        marginLeft: "1rem",
        display: "flex",
        flexDirection: "column"
    },
    actionText: {
        fontSize: "0.9rem",
        fontFamily: "DM Sans"
    },
    actionDesc: {
        fontSize: "0.82rem",
        fontFamily: "DM Sans",
        fontWeight: "500",
        marginTop: "0.15rem"
    },
    oddItem: {
        marginRight: "1rem",
    },
    goBack: {
        fontFamily: "DM Sans",
        fontStyle: "normal",
        fontSize: "0.81rem",
        color: "#fff",
        position: "absolute",
        top: "5%",
        left: "2rem",
        cursor: "pointer"
    },
    innerForm: {},
    innerFormHeader: {
        display: "flex",
        flexDirection: "row",
        position: "relative"
    },
    innerFormHeaderIconContainer: {},
    innerFormHeaderIcon: {},
    innerFormHeaderContent: {
        flex: 1,
        marginLeft: "1.41rem",
        color: "#fff",
        fontFamily: "DM Sans",
        fontStyle: "normal"
    },
    innerFormHeaderTitle: {
        fontFamily: "DM Sans",
        fontStyle: "normal",
        fontWeight: "bold",
        color: "#fff",
        fontSize: "0.9rem"
    },
    innerFormHeaderDesc: {
        marginTop: "0.45rem",
        fontSize: "0.81rem"
    },
    innerFormHelp: {
        display: "flex",
        alignItems: "top",
        position: "absolute",
        top: "-1.2rem",
        right: "0rem",
        cursor: "pointer"
    },
    innerFormHelpIcon: {},
    innerFormHelpLink: {
        paddingTop: "0.4rem",
        marginLeft: "0.2rem",
        fontFamily: "DM Sans",
        fontStyle: "normal",
        fontWeight: "bold",
        color: "#fff",
        textDecorationLine: "underline",
        fontSize: "0.82rem"
    },
    inputTableGrid: {
        marginTop: "2rem",
        width: "100%",
        textAlign: "left",
        borderSpacing: "0.95rem",
        maxHeight: "47vh",
        display: "inline-block",
        overflowY: "auto"
    },
    inputTableGridItem: {
        display: "table-row",
        gridTemplateColumns: "auto auto auto",
    },
    inputTableGridItemLabel: {
        fontFamily: "DM Sans",
        minWidth: "7rem",
        fontStyle: "normal",
        fontSize: "0.82rem",
        color: "#fff",
        display: "flex"
    },
    inputTableGridOption: {
        width: "50%",
        textAlign: "right"
    },
    inputTableGridOptionValue: {
        width: "50%",

        textAlign: "right"
    },
    inputTableGridOptionValueInput: {
        padding: "0.4rem 0.7rem",
        borderRadius: "0.25rem",
        width: "100%",
        maxWidth: "10rem",
        fontSize: 18,
    },
    formBottomRow: {
        display: "flex",
        marginTop: "1.4rem"
    },
    formButtonAdvance: {
        fontWeight: "800",
        cursor: "pointer",
        fontSize: "0.82rem",
        color: "#5B76F7",
        textDecorationLine: "underline"
    },
    select: {
        padding: "0.4rem 0.7rem",
        borderRadius: "0.25rem",
        width: "100%",
        maxWidth: "10rem",
        fontSize: 18,
    },
    input: {
        padding: "0.4rem 0.7rem",
        borderRadius: "0.25rem",
        width: "100%",
        maxWidth: "10rem",
        fontSize: 18,
    }
};

export default App;
