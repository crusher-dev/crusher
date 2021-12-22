import React from "react";
import { css, Global } from '@emotion/react'
import { render } from "react-dom";
import { Toolbar } from './components/toolbar';
import { DeviceFrame } from './components/device-frame';
import { Sidebar } from './components/sidebar';
import "../assets/styles/tailwind.css";
import configureStore from "../store/configureStore";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getCurrentOnboardingStep } from "../store/selectors/onboarding";
import { updateCurrentOnboardingStep } from "../store/actions/onboarding";
import { getInitialStateRenderer } from 'electron-redux';

const App = () => {
    const currentStep = useSelector(getCurrentOnboardingStep);
	const dispatch = useDispatch();

    const updateState = React.useCallback(() => {
        dispatch(updateCurrentOnboardingStep(currentStep + 1));
    }, [currentStep]);

	return (
        <div css={containerStyle}>
            <Global styles={globalStyles} />
            <div css={bodyStyle}>
                    <Toolbar css={toolbarStyle} />
                    <DeviceFrame css={deviceFrameContainerStyle} />
            </div>
                <button css={css`background:red; color:white; font-size: 24rem;`} onClick={updateState}>Click me {currentStep}</button>
            <Sidebar />
        </div>
	);
};

const containerStyle = css`
	display: flex;
	background: #020202;
	width: 100%;
	overflow-x: hidden;
	height: 100vh;
	color: white;
`;
const bodyStyle = css`
	flex: 1;
	max-width: calc(100% - 350rem);
	display: grid;
	grid-template-rows: 62rem;
	flex-direction: column;
`;
const sidebarStyle = css`
	padding: 1rem;
	width: 350rem;
	background-color: #111213;
`;
const toolbarStyle = css`
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
`;
const deviceFrameContainerStyle = css`
	flex: 1;
	overflow: auto;
`;
const globalStyles = css`
	body {
		margin: 0;
		padding: 0;
		min-height: "100vh";
		max-width: "100vw";
	}
	.custom-scroll::-webkit-scrollbar {
		width: 12rem;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background-color: #0a0b0e;
		box-shadow: none;
	}

	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #1b1f23;
		border-radius: 100rem;
	}

	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #272b31;
		border-radius: 100rem;
	}
`;

console.log("Intial state is", getInitialStateRenderer());
const store = configureStore(getInitialStateRenderer(), "renderer");
render(
<Provider store={store}>
        <App store={store} />
</Provider>
, document.querySelector("#app-container"));
