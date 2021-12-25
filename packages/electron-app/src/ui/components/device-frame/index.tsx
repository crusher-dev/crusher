import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";

const DeviceFrame = (props: any) => {
    const recorderInfo = useSelector(getRecorderInfo);

    const getPreloadScriptPath = () => {
        return url.resolve(window.location.href, "./webview-preload.js");
    };

    return (
        <div css={containerStyle}>
            <Conditional showIf={!!recorderInfo.device}>
                <div style={{width: `${recorderInfo.device?.width}rem`, height: `${recorderInfo.device?.height}rem`, maxWidth: "100%", maxHeight: "100%"}}>
                    <webview
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