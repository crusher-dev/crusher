import { Conditional } from "@dyson/components/layouts";
import { useEffect } from "dyson/node_modules/@types/react";
import React from "react";
import { css } from "styled-components";
import { InfoOverLay } from "./Overlays/index";

const DeviceFrame = () => {
    const webviewRef = React.useRef<any>(null);
    const [showInfoOverlay, setShowInfoOverlay] = React.useState<boolean>(localStorage.getItem("showInfoOverlay") === "false" ? false : true);

    return (
        <div css={containerStyle}>
            <div style={{width: 1280, height: 800}}>
                <webview
                    css={{width: "100%", height: "100%"}}
                                ref={webviewRef}
                                id="device_browser"
                                nodeintegration={true}
                                preload={"file://" + (window as any).electron.getAppPath() + "/webViewPreload.js"}
                                //@ts-ignore
                                enableremotemodule={"true"}
                                title={"Device"}
                                src={`http://google.com`}
                                partition={"crusher"}
                            />
            </div>
            <Conditional showIf={showInfoOverlay}>
                <InfoOverLay hideOverlay={setShowInfoOverlay.bind(this, false)} />
            </Conditional>
        </div>
    );
}

const containerStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export { DeviceFrame };