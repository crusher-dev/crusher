import React from "react";
import { css } from "@emotion/react";
import { CrusherHammerColorIcon, CrusherIcon, GithubIcon, LoadingIcon, LoadingIconV2 } from "../icons";
import { Button } from "@dyson/components/atoms/button/Button";
import { useNavigate } from "react-router-dom";
import { ipcRenderer, shell } from "electron";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { waitForUserLogin } from "electron-app/src/utils/renderer";
import { focusOnWindow, saveAndGetUserInfo } from "../commands/perform";
import { sendSnackBarEvent } from "../components/toast";
import { useSelector } from "react-redux";
import { getAppSettings } from "electron-app/src/store/selectors/app";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { CommonFooter } from "../layouts/commonFooter";

const GithubButton = (props) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
			}}
			bgColor="tertiary-outline"
			css={githubButtonStyle}
			{...props}
		>
			<GithubIcon
				css={css`
					width: 18rem;
					margin-left: 2rem;
				`}
			/>
			<span css={buttonTextStyle}>Github</span>
		</Button>
	);
};

const GitlabButton = (props) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
			}}
			bgColor="tertiary-outline"
			css={gitlabButtonStyle}
			{...props}
		>
			<GithubIcon
				css={css`
					width: 18rem;
				`}
			/>
			<span css={buttonTextStyle}>Gitlab</span>
		</Button>
	);
};

export const LinkBox = ({ value, children, ...props }) => {
	const ref = React.useRef(null);

	const handleOnClick = () => {
		ref.current.select();
		document.execCommand("copy");
		sendSnackBarEvent({ type: "success", message: `Copied to clipbaord!` });
	};
	return (
		<div css={linkContainerStyle} onClick={handleOnClick} {...props}>
			<input
				ref={ref}
				css={css`
					background: transparent;
					border: none;
					outline: none;
					width: 100%;
				`}
				type={"text"}
				value={value}
			/>
			{children}
		</div>
	);
};

const linkContainerStyle = css`
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 6px;
	padding: 12rem 18rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 11rem;

	color: #888888;
`;

const buttonTextStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 700;
	font-size: 14rem;
	text-align: center;
	letter-spacing: -0.0032em;

	color: #ffffff;
	margin-left: auto;
	margin-right: 12rem;
`;
const githubButtonStyle = css`
	box-sizing: content-box;

	height: 38rem;
	width: 112rem;
	display: flex;
	align-items: center;
	background: linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	border: none;
	:hover {
		background: linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
		opacity: 0.8;
		border: none;
	}
`;
const gitlabButtonStyle = css`
	box-sizing: content-box;
	height: 40rem;
	width: 112rem;
	display: flex;
	align-items: center;
	background: linear-gradient(0deg, #0b0b0d, #0b0b0d), linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
	border: 0.5rem solid rgba(70, 76, 87, 0.45);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	:hover {
		background: linear-gradient(0deg, #0b0b0d, #0b0b0d), linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
		border: 0.5px solid rgba(70, 76, 87, 0.45);
		opacity: 0.8;
	}
`;
function LoginScreen() {
	let navigate = useNavigate();
	const appSettings = useSelector(getAppSettings);
	const [backendEndPoint, setBackendEndPoint] = React.useState(appSettings.backendEndPoint || "");
	const [frontendEndPoint, setFrontendEndPoint] = React.useState(appSettings.frontendEndPoint || "");
	const [interval, setInterval] = React.useState(null);
	const [loginText, setLoginText] = React.useState("");

	const handlePostLogin = () => {
		navigate("/");
	};

	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);
	React.useEffect(() => {
		waitForUserLogin((loginToken: string) => {
			setInterval(null);
			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
				handlePostLogin();
			});
		}).then(async ({ loginKey, interval: intervalMain }) => {
			setInterval(interval);
			setLoginText(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
		});
	}, []);

	const handleLogin = React.useCallback(async () => {
		if (interval) {
			clearInterval(interval);
			setInterval(null);
		}
		const { loginKey, interval: intervalMain } = await waitForUserLogin((loginToken: string) => {
			setInterval(null);

			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
				handlePostLogin();
			});
		});
		setInterval(intervalMain);
		setLoginText(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
		await shell.openExternal(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
	}, [interval]);


	return (
		<ModelContainerLayout
			css={css`
				padding-top: 0rem;
			`}
			header={null}
			title={null}
			footer={<CommonFooter />}
		>
			<div css={mainContentStyle}>
				<div
					css={css`
						text-align: center;
					`}
				>
					<div css={css`display: flex; justify-content: center;`}>
						<UserProfileIcon css={css`width: 29rem; height: 29rem;`}/>
					</div>

					<div css={headingStyle}>Login to continue</div>
					<div css={descriptionStyle}>change login info</div>
				</div>
				<div
					css={css`
						display: flex;
						gap: 22rem;
						margin-top: 18rem;
					`}
				>
					<div css={loginButtonCss} onClick={handleLogin}>
						login
					</div>
				</div>
				{interval && (
					<div
						css={css`
							margin-top: 34rem;
							display: flex;
							align-items: center;
							gap: 14rem;
						`}
					>
						<span
							css={css`
								font-size: 14rem;
								color: #565657;
							`}
						>
							Waiting for you to finish
						</span>
						<LoadingIconV2
							css={css`
								width: 20rem;
								height: 20rem;
							`}
						/>
					</div>
				)}
			</div>
		</ModelContainerLayout>
	);
}

const loginButtonCss = css`
	background: linear-gradient(0deg, #933EFF, #933EFF), #4D4D4D;
	border: 1px solid rgba(114, 114, 114, 0.4);
	border-radius: 8px;
	padding: 6rem;
	width: 125rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;

	color: #FFFFFF;
	display: flex;
	justify-content: center;
	:hover {
		opacity: 0.8;
	}
`;
const UserProfileIcon = (props) => (
	<svg
      viewBox={"0 0 29 29"}
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	  {...props}
	>
	  <path
		opacity={0.1}
		fillRule="evenodd"
		clipRule="evenodd"
		d="M1 14.114C1 3.314 3.35 1 14.313 1c10.962 0 13.312 2.315 13.312 13.114 0 6.28-.795 9.692-3.617 11.446l-.466-1.424c-.496-1.76-1.4-2.929-2.925-3.635-1.492-.691-3.547-.923-6.305-.923-2.76 0-4.814.25-6.307.961-1.523.725-2.426 1.91-2.921 3.668l-.46 1.358C1.796 23.812 1 20.4 1 14.114ZM9.505 11.2c0-2.616 2.152-4.736 4.807-4.736 2.656 0 4.808 2.12 4.808 4.736 0 2.615-2.152 4.735-4.808 4.735-2.654 0-4.807-2.12-4.807-4.735Z"
		fill="#121418"
	  />
	  <path
		d="M1 14.114C1 3.314 3.35 1 14.313 1c10.962 0 13.312 2.315 13.312 13.114 0 10.799-2.35 13.114-13.313 13.114C3.35 27.228 1 24.913 1 14.114Z"
		fill="#121418"
		stroke="#989898"
		strokeWidth={2}
	  />
	  <path
		d="M18.75 11.2c0 2.414-1.987 4.37-4.438 4.37-2.45 0-4.437-1.956-4.437-4.37 0-2.415 1.987-4.372 4.438-4.372 2.45 0 4.437 1.957 4.437 4.371Z"
		fill="#121418"
		stroke="#989898"
		strokeWidth={2}
	  />
	  <path
		d="M5.438 24.314c.943-3.362 3.372-4.372 8.875-4.372 5.502 0 7.93.937 8.874 4.298"
		fill="#121418"
	  />
	  <path
		d="M5.438 24.314c.943-3.362 3.372-4.372 8.875-4.372 5.502 0 7.93.937 8.874 4.298"
		stroke="#989898"
		strokeWidth={2}
		strokeLinecap="round"
	  />
	</svg>
  )


const openThisLinkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	letter-spacing: -0.0032em;

	color: #9c9c9c;
`;

const headingStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 700;
	font-size: 18rem;
	margin-top: 14rem;
	color: #ffffff;
`;
const descriptionStyle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 13.5rem;
	text-align: center;
	letter-spacing: -0.0032em;

	color: #565657;
	margin-top: 8rem;
`;
const mainContentStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 160rem;
	flex: 1;
	height: 100%;
`;
const contentStyle = css`
	flex: 1;
	padding: 38rem 44rem;
	display: flex;
	flex-direction: column;
`;
const navBarStyle = css`
	display: flex;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 16rem;

	color: #ffffff;
	.navItem {
		:hover {
			opacity: 0.8;
		}
	}
`;

const footerStyle = css`
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding: 20rem 28rem;
`;

const containerStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 100%;
	height: 100%;
	background: #161617;
	border-radius: 16rem;
	border: 1px solid rgba(255, 255, 255, 0.08);

	display: flex;
	flex-direction: column;
`;

const statusTextStyle = css`
	margin-top: 24rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 16rem;
	color: #ffffff;
`;

export { LoginScreen };
