import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo } from "electron-app/src/store/selectors/recorder";
import { useDispatch, useSelector } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";
import { IpcMessageEvent } from "electron";
import { TRecorderMessagesType } from "electron-app/src/extension/scripts/inject/host-proxy";
import { recordStep, setSelectedElement } from "electron-app/src/store/actions/recorder";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { ipcRenderer } from "electron";

const DeviceFrame = (props: any) => {
    const recorderInfo = useSelector(getRecorderInfo);
    const ref = React.useRef<HTMLWebViewElement>(null);
    const dispatch = useDispatch();

    const getPreloadScriptPath = () => {
        return url.resolve(window.location.href, "./webview-preload.js");
    };

    React.useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("ipc-message", (event: IpcMessageEvent) => {
                const { channel, args } = event;
                if(channel === "recorder-message") {
                    const { type, payload } = args[0];
                    switch(type) {
                        case TRecorderMessagesType["Commands.recordAction"]:
                            dispatch(recordStep(payload.action, ActionStatusEnum.COMPLETED));
                            break;
                        case TRecorderMessagesType["Commands.turnOnInspectMode"]:
                            console.log("Callend to turn on inspect mode");
                            ipcRenderer.invoke("turn-on-recorder-inspect-mode");
                            break;
                        case TRecorderMessagesType["Commands.turnOffInspectMode"]:
                            console.log("Callend to turn off inspect mode");
                            ipcRenderer.invoke("turn-off-recorder-inspect-mode");
                            break;
                        case TRecorderMessagesType["Commands.turnOnElementMode"]:
                            ipcRenderer.invoke("turn-off-recorder-inspect-mode");
                            const { selectedElementInfo } = payload;
                            dispatch(setSelectedElement(selectedElementInfo));
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
                        nodeintegration={"true"}
                        preload={getPreloadScriptPath()}
                                            //@ts-ignore
                        enableremotemodule={"true"}
                        title={"crusher-webview"}
                        src={"about:blank"}
                        partition={"crusher"}
                    />
                </div>
            </Conditional>
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