import React, { useRef } from "react";
import { render } from "react-dom";
import { SidebarStepsBox } from "./containers/app/sidebarStepsBox";
import { BrowserWindow } from "./containers/app/browserWindow";

const messageListenerCallback: any = null;

window.addEventListener("message", (event) => {
	if (messageListenerCallback) {
		messageListenerCallback(event);
	}
});

const App = () => {
	const deviceIframeRef = useRef<HTMLIFrameElement>(null);
	const saveTest = () => {
		console.log("Saving test...");
	};

	return (
		<div style={containerStyle}>
			<BrowserWindow
				deviceIframeRef={deviceIframeRef}
				saveTestCallback={saveTest}
				isInspectModeOn={true}
			/>
			<SidebarStepsBox steps={[]} />
			<style>
				{`
                    html, body{
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        font-size: 20px;
                        overflow: hidden;
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
                    
                    .toggle-switch {
                        display: inline-block;
                    }
                    
                    .toggle-switch input[type=checkbox] {display:none}
                    .toggle-switch label {cursor:pointer;}
                    .toggle-switch label .toggle-track {
                        display:block;
                        height:0.625rem;
                        width: 2.7rem;
                        background:#212633;
                        border-radius:1rem;
                        position:relative;
                        padding: 0.1rem 0;
                    }

                    .toggle-switch .toggle-track:before{
                        content:'';
                        display:inline-block;
                        height:0.525rem;
                        width:0.525rem;
                        background:#5B76F7;
                        border-radius:1rem;
                        position:absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: calc(100% - 0.725rem);
                        transition:all .2s ease-in;
                    }

                    .toggle-switch input[type="checkbox"]:checked + label .toggle-track:before{
                        background: #5B76F7;
                        right: 0.2rem;
                    }
                `}
			</style>
			<link
				rel="stylesheet"
				href={chrome.runtime.getURL("/styles/devices.min.css")}
			/>
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/fonts.css")} />
		</div>
	);
};

const containerStyle = {
	display: "flex",
	height: "auto",
	background: "rgb(40, 40, 40)",
};

render(<App />, document.querySelector("#root"));
