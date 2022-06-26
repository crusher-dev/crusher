import React from "react";
import { css } from "@emotion/react";
import { CrossIcon, CrusherHammerColorIcon, LoadingIconV2, MiniCrossIcon } from "../icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { getBuildReport, performExit } from "../commands/perform";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { useStore } from "react-redux";
import { getAppSettings } from "electron-app/src/store/selectors/app";
import { Dropdown } from "@dyson/components/molecules/Dropdown";

export function Link({ children, ...props }) {
	return (
		<span css={[linkStyle]} {...props}>
			{children}
		</span>
	);
}

const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	color: #ffffff;
	:hover {
		opacity: 0.8;
	}

	font-weight: 500;
	font-size: 13px;
`;

export { Link };
function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
function StatusMessageBar({ isLoadingScreen }) {
	const [shouldShow, setShouldShow] = React.useState(false);
	const [testStatus, setTestStatus] = React.useState(null);
	const [buildId, setBuildId] = React.useState(null);
	const [testType, setTestType] = React.useState(null);

	const store = useStore();

	React.useEffect(() => {
		if (window["triggeredTest"]) {
			setShouldShow(true);
			setTestType(window["triggeredTest"].type);
		}

		window["messageBarCallback"] = (buildId) => {
			setShouldShow(false);
			setTestType(null);
			setTestStatus(null);
			window["triggeredTest"] = { id: buildId };
			setShouldShow(true);
		};

		return () => {
			window["messageBarCallback"] = null;
		};
	}, []);

	React.useEffect(() => {
		if (shouldShow) {
			const buildId = window["triggeredTest"].id;
			// if(!isLoadingScreen) {
			//     window["triggeredTest"] = null;
			//     setBuildId(buildId);
			//     return;
			// }
			if(window["triggeredTest"]) window["triggeredTest"] = null;
			if(buildId === -1) return;
			setBuildId(buildId);
			const interval = setInterval(() => {
				getBuildReport(buildId).then((res) => {
					setTestStatus(res.status);
					if (res.status != "RUNNING") {
						clearInterval(interval);
					}
				});
			}, 5000);
			return () => {
				clearInterval(interval);
			};
		}
	}, [shouldShow]);
	const handleViewReport = React.useCallback(() => {
		const appSettings = getAppSettings(store.getState() as any);
		shell.openExternal(resolveToFrontEndPath("/app/build/" + buildId, appSettings.frontendEndPoint));
	}, [buildId]);

	const handleClose = () => {
		setShouldShow(false);
		setTestStatus(null);
		setBuildId(null);
	};

	if (!shouldShow) return null;

	return (
		<div css={statusMessageBarContainerStyle}>
			<div css={statusMessageBarInnerContainerStyle}>
				<div css={statusMessageBarLeftStyle}>
					<CliIcon css={statusCliIconStyle} />
					<span css={statusTextStyle}>
						Last test: &nbsp;<span>{capitalize(testStatus || (testType === "local" ? "Completed" : "Queued"))}</span>
					</span>
					{testType !== "local" && ["RUNNING", null].includes(testStatus) ? (
						<LoadingIconV2
							css={css`
								display: block;
								margin-left: -10rem;
								position: relative;
								top: -1rem;
								width: 18rem;
							`}
						/>
					) : (
						""
					)}
				</div>
				<div css={statusMessageBarRightStyle}>
					{/* <Link css={statusLinkStyle}>Logs</Link> */}
					{testStatus !== "RUNNING" && testStatus ? (
						<Link css={statusLinkStyle} onClick={handleViewReport}>
							View Report
						</Link>
					) : (
						""
					)}
					<MiniCrossIcon
						onClick={handleClose}
						css={css`
							width: 10px;
							height: 12px;
							:hover {
								opacity: 0.8;
							}
						`}
					/>
				</div>
			</div>
		</div>
	);
}

const statusCliIconStyle = css`
	width: 12px;
	height: 12px;
`;

const statusMessageBarContainerStyle = css`
	transition: bottom 0.25s ease;
	position: relative;
	bottom: 0px;
`;
const statusMessageBarInnerContainerStyle = css`
	display: flex;
	padding: 14px 24px;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), #161617;
`;
const statusMessageBarLeftStyle = css`
	display: flex;
	align-items: center;
	gap: 16px;
`;
const statusMessageBarRightStyle = css`
	margin-left: auto;
	display: flex;
	gap: 16px;
`;

const statusLinkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	letter-spacing: 0.03em;

	color: #ffffff;
`;
const statusTextStyle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	letter-spacing: 0.03em;
	margin-top: 2px;
	color: #ffffff;
`;

function ActionButtonDropdown({ setShowActionMenu, isRecorder, ...props }) {
	const navigate = useNavigate();
	const [projectConfigFile, setProjectConfigFile] = React.useState(null);

	React.useEffect(() => {
		try {
			const projectId = window.localStorage.getItem("projectId");
			const projectConfigFile = window.localStorage.getItem("projectConfigFile");
			const projectConfigFileJson = JSON.parse(projectConfigFile);
			if (projectConfigFileJson[projectId]) {
				setProjectConfigFile(projectConfigFileJson[projectId]);
			}
		} catch (ex) {}
	}, []);

	const MenuItem = ({ label, onClick, ...props }) => {
		return (
			<div
				css={css`
					padding: 6rem 13rem;
					color: #fcfcfc;
					font-family: Cera Pro;
					font-style: normal;
					font-weight: 400;
					font-size: 13rem;
					:hover {
						background: #8b63ff !important;
						color: #fffbfb !important;
					}
				`}
				onClick={onClick}
			>
				{label}
			</div>
		);
	};

	const handleOpenConfigFile = React.useCallback(() => {
		setShowActionMenu(false);
		shell.openPath(projectConfigFile);
	}, [projectConfigFile]);

	const handleSettings = () => {
		setShowActionMenu(false);
		alert("Settings not implemented yet");
	};

	const handleOpenApp = () => {
		setShowActionMenu(false);
		shell.openExternal(resolveToFrontEndPath("/"));
	};

	const handleExit = () => {
		setShowActionMenu(false);
		performExit();
	};

	const handleSelectProject = () => {
		setShowActionMenu(false, true);
		return navigate("/select-project");
	};

	const handleGoBackToDashboard = () => {
		setShowActionMenu(false, true);
		return navigate("/");
	};

	const handleHelpAccount = () => {
		shell.openExternal("https://docs.crusher.dev");
	};

	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				{isRecorder ? (
					<MenuItem onClick={handleGoBackToDashboard} label={<span>Go Back</span>} className={"close-on-click"} />
				) : (
					<MenuItem onClick={handleSelectProject} label={<span>Back to projects</span>} className={"close-on-click"} />
				)}
				{projectConfigFile ? <MenuItem onClick={handleOpenConfigFile} label={<span>Edit Project config</span>} className={"close-on-click"} /> : ""}
				<MenuItem onClick={handleHelpAccount} label={<span>Help & account</span>} className={"close-on-click"} />
				<MenuItem onClick={handleExit} label={<span>Exit</span>} className={"close-on-click"} />
			</div>
		</div>
	);
}

export const MenuDropdown = ({ className, isRecorder, callback }) => {
	const [showAppMenu, setShowAppMenu] = React.useState(false);

	const handleCallback = React.useCallback(
		(value, isNavigating = false) => {
			setShowAppMenu(value);
			if (callback) {
				callback(value, isNavigating);
			}
		},
		[callback],
	);

	return (
		<Dropdown
			className={className}
			initialState={showAppMenu}
			component={<ActionButtonDropdown isRecorder={isRecorder} setShowActionMenu={handleCallback.bind(this)} />}
			callback={handleCallback.bind(this)}
			dropdownCSS={css`
				left: 38rem;
				width: 162rem;
				background: linear-gradient(0deg, #1e1e1f, #1e1e1f), #151516;
			`}
		>
			<div css={crusherDropdownContainerStyle}>
				<CrusherHammerColorIcon className={"crusher-hammer-icon"} css={[logoStyle]} />
				<DropdownIconSVG />
			</div>
		</Dropdown>
	);
};
function ModelContainerLayout({ children, title, titleContainerCss, footer, className, isLoadingScreen, headerStyle, ...props }) {
	const navigate = useNavigate();

	const handleOpenAppClick = React.useCallback(() => {
		shell.openExternal("https://app.crusher.dev");
	}, []);

	const handleDocsClick = () => {
		shell.openExternal("https://docs.crusher.dev");
	};

	return (
		<div css={containerStyle} {...props}>
			<div css={dragStyle} className={"drag"}></div>
			<div css={headerStyleCSS} style={headerStyle}>
				<div css={leftNavBarStyle}>
					<MenuDropdown css={[css`.crusher-hammer-icon{ margin-left: ${process.platform !== "darwin" ? "0" : "50"}rem`]} />
				</div>
				<div css={[mainTitleContainerStyle, titleContainerCss]}>{title}</div>
				<div css={rightNavStyle}>
					<Link
						onClick={handleDocsClick}
						css={[
							css`
								margin-right: 12rem;
							`,
							topLinkStyle,
						]}
					>
						Docs
					</Link>
					<Link onClick={handleOpenAppClick} css={topLinkStyle}>
						Open app{" "}
						<ExternalLink
							css={css`
								margin-left: 4rem;
								margin-top: -2px;
								zoom: 0.95;
							`}
						/>
					</Link>
				</div>
			</div>
			<div css={contentStyle} className={className}>
				{children}
			</div>
			{footer ? <div css={footerStyle}>{footer}</div> : ""}

			{!isLoadingScreen ? (<StatusMessageBar isLoadingScreen={isLoadingScreen} />) : ""}
		</div>
	);
}

const topLinkStyle = css`
	font-size: 12.8rem;
	font-weight: 400;
	color: #e8e8e8;
	display: flex;
	align-items: center;

	letter-spacing: 0.25rem;
	:hover {
		color: #aa83ff;
		path {
			fill: #aa83ff;
		}
	}
`;

function ExternalLink(props) {
	return (
		<svg width={10} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M3.889 1.667v1.11H1.11V8.89h6.111V6.11h1.111v3.333a.556.556 0 01-.555.556H.556A.556.556 0 010 9.444V2.222a.556.556 0 01.556-.555h3.333zM10 0v4.444H8.889V1.896l-4.33 4.33-.785-.785 4.329-4.33H5.556V0H10z"
				fill="#fff"
			/>
		</svg>
	);
}

const CliIcon = (props) => (
	<svg viewBox={"0 0 11 11"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M9.533 0H1.467A1.42 1.42 0 0 0 .43.46C.155.756 0 1.156 0 1.572V9.43c0 .416.155.816.43 1.11.275.295.648.46 1.037.461h8.066a1.42 1.42 0 0 0 1.037-.46c.275-.295.43-.695.43-1.111V1.57c0-.416-.155-.816-.43-1.11A1.42 1.42 0 0 0 9.533 0Zm-7.7 5.5a.35.35 0 0 1-.212-.072.391.391 0 0 1-.134-.19.42.42 0 0 1-.006-.24.396.396 0 0 1 .123-.198L3.08 3.536 1.604 2.27a.413.413 0 0 1 .052-.651.35.35 0 0 1 .407.037L3.896 3.23a.39.39 0 0 1 .101.136.416.416 0 0 1-.101.477L2.063 5.414a.352.352 0 0 1-.23.086Zm3.667 0H4.033a.355.355 0 0 1-.259-.115.408.408 0 0 1-.107-.278c0-.104.038-.204.107-.278a.355.355 0 0 1 .26-.115H5.5c.097 0 .19.042.26.115a.408.408 0 0 1 .107.278.408.408 0 0 1-.108.278.355.355 0 0 1-.259.115Z"
			fill="#C2FF74"
		/>
	</svg>
);

const crusherDropdownContainerStyle = css`
	display: flex;
	gap: 8rem;
	align-items: center;
	:hover {
		opacity: 0.8;
	}
`;

const logoStyle = css`
	width: 23px;
	height: 23px;

	rect {
		fill: #5a5a5a !important;
	}
`;

const rightNavStyle = css`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	padding-bottom: 1rem;

	font-size: 13rem;

	display: flex;
	align-items: center;
`;
const leftNavBarStyle = css`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
`;

const dragStyle = css`
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;
const contentStyle = css`
	flex: 1;
	padding-top: 18px;
	overflow-y: overlay;
	::-webkit-scrollbar {
		background: transparent;
		width: 8rem;
	}
	::-webkit-scrollbar-thumb {
		background: white;
		border-radius: 14rem;
	}
`;
const footerStyle = css`
	margin-top: auto;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding: 12rem 24rem;
	display: flex;
`;
const headerStyleCSS = css`
	display: flex;
	padding: 12px 28px;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	position: relative;
	z-index: 23424234324234234;
`;

const mainTitleContainerStyle = css`
	flex: 1;
	display: flex;
	justify-content: center;
	padding-top: 3rem;
`;

const containerStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 100%;
	height: 100%;
	background: #161617;
	border-radius: 16px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	transition: width 0.3s, height 0.3s;
	display: flex;
	flex-direction: column;

	width: 100%;
	height: 100%;

	border: none;
	border-radius: 0px;
`;

export { ModelContainerLayout };
