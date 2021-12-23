import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector } from "react-redux";
import { Conditional } from "@dyson/components/layouts";

const DeviceFrame = (props: any) => {
    const recorderInfo = useSelector(getRecorderInfo);

    return (
        <div css={containerStyle}>
            <Conditional showIf={!!recorderInfo.url}>
                <div style={{width: recorderInfo.device?.width, height: recorderInfo.device?.height, maxWidth: "100%", maxHeight: "100%"}}>
                    <webview
                        css={webviewStyle}
                        id="device_browser"
                        nodeintegration={"true"}
                                            // preload={"file://" + (window as any).electron.getAppPath() + "/webViewPreload.js"}
                                            //@ts-ignore
                        enableremotemodule={"true"}
                        title={"crusher-webview"}
                        src={recorderInfo.url}
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