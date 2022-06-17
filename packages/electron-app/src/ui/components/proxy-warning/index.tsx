import React from "react";
import { css } from "@emotion/react";
import { ConnectivityWarningIcon, PlayV2Icon } from "../../icons";
import { Link } from "../../layouts/modalContainer";
import { Button } from "@dyson/components/atoms/button/Button";
import { shell } from "electron";
import { turnOnProxy } from "../../commands/perform";
import { getProxyState } from "electron-app/src/store/selectors/app";
import { useSelector, useStore } from "react-redux";

const ReadDocsButton = ({ title, className, onClick }) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
			className={`${className}`}
			bgColor="tertiary-outline"
			size="x-small"
			css={saveButtonStyle}
		>
			<span>{title}</span>
		</Button>
	);
};

const saveButtonStyle = css`
	width: 100rem;
	background: transparent;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 13.6rem;
	border: 0.5px solid #ffffff;
	color: #ffffff;
	:hover {
		background: transparent;
		border: 0.6px solid #ffffff;
	}
`;

const ProxyWarningContainer = ({ onSkip }) => {
	const [selectedProject, setSelectedProject] = React.useState(null);
	const proxyState = useSelector(getProxyState);
	const store = useStore();

	const turnOnProxyServers = () => {
		const proxyState = getProxyState(store.getState());
		if (Object.keys(proxyState).length) {
			console.error("Proxy is already enabled", proxyState);
			return;
		}
		if (window.localStorage.getItem("projectConfigFile")) {
			const projectConfigFile = window.localStorage.getItem("projectConfigFile");
			const projectConfigFileJson = JSON.parse(projectConfigFile);
			console.log("projectConfigFileJson", projectConfigFileJson, selectedProject);
			if (projectConfigFileJson[selectedProject]) turnOnProxy(projectConfigFileJson[selectedProject]);
		}
	};

	React.useEffect(() => {
		setSelectedProject(window.localStorage.getItem("projectId"));
		// turnOnProxyServers();
	}, [selectedProject]);

	const openDocs = React.useCallback(() => {
		shell.openExternal("https://docs.crusher.dev");
	}, []);

	const handleRetry = React.useCallback(() => {
		turnOnProxyServers();
	}, [selectedProject, proxyState]);

	return (
		<div css={containerStyle}>
			<div css={contentContainerStyle}>
				<ConnectivityWarningIcon css={iconStyle} />
				<div css={headingStyle}>
					<span css={highlightStyle}>Warning:</span> Add proxy config to test fast
				</div>
				<div css={descriptionStyle}>
					Test for endpoint <span css={highlightStyle}>http://localhost:3000 is not reachable</span>. To test in cloud, add proxy config.
				</div>
			</div>
			<div css={actionsBarContainerStyle}>
				<ReadDocsButton title={"Read docs"} onClick={openDocs} />
				<Link onClick={onSkip} css={skipLinkStyle}>
					Skip
				</Link>
			</div>
			<div css={waitingTextStyle}>
				<Link onClick={handleRetry}>Retry</Link>
			</div>
			<div css={watch}>
				<PlayV2Icon /> Watch video
			</div>
		</div>
	);
};

const skipLinkStyle = css`
	margin-left: 20rem;
`;

const contentContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const headingStyle = css`
	margin-top: 24rem;
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: 18rem;
	text-align: center;
	letter-spacing: -0.1px;
	color: #ffffff;
`;
const highlightStyle = css`
	color: #ffec87;
`;
const descriptionStyle = css`
	margin-top: 12rem;

	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.2px;
	color: rgba(255, 255, 255, 0.64);
`;
const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	justify-content: center;
`;
const iconStyle = css`
	width: 43rem;
	height: 35rem;
`;
const actionsBarContainerStyle = css`
	display: flex;
	align-items: center;
	margin-top: 20rem;
`;
const waitingTextStyle = css`
	margin-top: 40rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	text-align: center;
	letter-spacing: 0.01em;

	color: #ffffff;
`;
const watch = css`
	font-size: 14rem;
	display: flex;
	align-items: center;

	column-gap: 8rem;
	align-self: center !important;
	justify-self: end;

	margin-top: 100rem;

	:hover {
		color: #a966ff;
		text-decoration: underline;
		cursor: pointer;
	}
`;
export { ProxyWarningContainer };
