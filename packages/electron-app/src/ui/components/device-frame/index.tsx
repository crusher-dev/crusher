import React from "react";
import { css } from "@emotion/react";

const selectedDevice = {width: 1280, height: 800};

const DeviceFrame = (props: any) => {
    return (
        <div css={containerStyle}>
     <div style={{width: selectedDevice.width, height: selectedDevice.height, maxWidth: "100%", maxHeight: "100%"}}>
    
    <webview
                        css={webviewStyle}
                            id="device_browser"
                            nodeintegration={"true"}
                            // preload={"file://" + (window as any).electron.getAppPath() + "/webViewPreload.js"}
                            //@ts-ignore
                            enableremotemodule={"true"}
                            title={"crusher-webview"}
                            src={`https://google.com`}
                            partition={"crusher"}
                        />
                </div>
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