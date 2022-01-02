import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo, getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";
import { IpcMessageEvent } from "electron";
import { turnOffInspectMode, turnOnInspectMode } from "../../commands/perform";
import { recordStep, setSelectedElement } from "electron-app/src/store/actions/recorder";
import { saveAutoAction } from "../../commands/saveActions";
import { TRecorderMessagesType } from "../../../lib/recorder/host-proxy";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { InfoOverLay } from "../overlays/infoOverlay";

const DeviceFrame = (props: any) => {
    const recorderInfo = useSelector(getRecorderInfo);
    const ref = React.useRef<HTMLWebViewElement>(null);
    const store = useStore();

    const getPreloadScriptPath = () => {
        return url.resolve(window.location.href, "./webview-preload.js");
    };

    React.useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("ipc-message", (event: IpcMessageEvent) => {
                const recorderState = getRecorderState(store.getState());
                if(recorderState.type !== TRecorderState.RECORDING_ACTIONS) return;
    
                const { channel, args } = event;
                if(channel === "recorder-message") {
                    const { type, payload } = args[0];
                    switch(type) {
                        case TRecorderMessagesType["Commands.recordAction"]:
                            saveAutoAction(payload.action, store);
                            break;
                        case TRecorderMessagesType["Commands.turnOnInspectMode"]:
                            turnOnInspectMode();
                            break;
                        case TRecorderMessagesType["Commands.turnOffInspectMode"]:
                            turnOffInspectMode();
                            break;
                        case TRecorderMessagesType["Commands.turnOnElementMode"]:
                            turnOffInspectMode();
                            const { selectedElementInfo } = payload;
                            store.dispatch(setSelectedElement(selectedElementInfo));
                            break;
                    }
                }
            }); 
        }
    }, [ref.current]);

    return (
        <div css={containerStyle}>
            <Conditional showIf={!!recorderInfo.device}>
                <div style={{width: `${recorderInfo.device?.width}rem`, height: `${recorderInfo.device?.height}rem`, maxWidth: "100%", maxHeight: "100%"}}>
                    <webview
                        ref={ref}
                        css={webviewStyle}
                        id="device_browser"
                        preload={getPreloadScriptPath()}
                        title={"crusher-webview"}
                        src={"about:blank"}
                        partition={"crusherwebview"}
                    />
                </div>
            </Conditional>
            <InfoOverLay />
        </div>
    )
};

const webviewStyle = css`
    border: none;
    display: inline-flex;
    max-width: 100%;
    background-color: #fff;
    width: 100%;
    height: 100%;
`;
const containerStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export { DeviceFrame }