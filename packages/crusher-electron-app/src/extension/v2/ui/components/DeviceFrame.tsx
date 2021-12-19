import { Conditional } from "@dyson/components/layouts";
import { useEffect } from "dyson/node_modules/@types/react";
import { useAtom } from "jotai";
import React from "react";
import { css } from "styled-components";
import { appStateAtom } from "../../store/atoms/global/appState";
import { InfoOverLay } from "./Overlays/index";

const DeviceFrame = ({CSS, targetUrl, deviceIframeRef, selectedDevice}) => {
    const [appState, setAppStateItem] = useAtom(appStateAtom);
	const [siteUrl, setSiteUrl] = React.useState(targetUrl);

    const showInfoOverlay = appState.showShouldOnboardingOverlay && !targetUrl;

    const hideInfoOverlay = () => {
        setAppStateItem({key: "showShouldOnboardingOverlay", value : false});
    };
    
    return (
        <div css={[containerStyle, CSS]}>
            				<Conditional showIf={siteUrl}>

            <div style={{width: selectedDevice.width, height: selectedDevice.height, maxWidth: "100%", maxHeight: "100%"}}>
    
<webview
                    css={webviewStyle}
						ref={deviceIframeRef}
						id="device_browser"
						nodeintegration={true}
						preload={"file://" + (window as any).electron.getAppPath() + "/webViewPreload.js"}
						//@ts-ignore
						enableremotemodule={"true"}
						title={selectedDevice ? selectedDevice.name : "undefined"}
						src={`about:blank?url=${encodeURIComponent(siteUrl)}`}
						partition={"crusher"}
					/>
            </div>
            </Conditional>
            <Conditional showIf={showInfoOverlay}>
                <InfoOverLay hideOverlay={hideInfoOverlay.bind(this)} />
            </Conditional>
        </div>
    );
}

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

export { DeviceFrame };