import React from "react";
import { css } from "@emotion/react";
import { performGoToUrl } from "../../../commands/perform";
import { useStore } from "react-redux";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { NormalButton } from "../../components/buttons/NormalButton";
import { getGlobalAppConfig, writeGlobalAppConfig } from "electron-app/src/lib/global-config";
import { setUserAccountInfo } from "electron-app/src/store/actions/app";
import { useNavigate } from "react-router-dom";

const InvalidCredsErrorContainer = () => {
	const store = useStore();
	const navigate = useNavigate();

	const handeLogout = React.useCallback(() => {
		const appConfig = getGlobalAppConfig();
		if (appConfig?.["userInfo"]) {
			delete appConfig["userInfo"];
			writeGlobalAppConfig(appConfig);
		}
		store.dispatch(setUserAccountInfo(null));
		performGoToUrl("/login");
	}, []);

	const handleSettings = React.useCallback(() => {
		navigate("/settings");
	}, []);

	return (
		<CompactAppLayout
			title={null}
			footer={<Footer />}
			css={css`
				z-index: 999;
			`}
		>
			<div css={containerStyle}>
				<div css={contentContainerStyle}>
					<LockIconSvg css={iconStyle} />
					<div css={headingStyle}>
						<span css={highlightStyle}></span>Invalid authorization credentialss!
					</div>
					<div css={descriptionStyle}>
						Possible causes:
						<br />
						<div
							css={css`
								margin-top: 8rem;
							`}
						>
							<ol
								css={css`
									text-align: left;
									list-style: nu;
								`}
							>
								<li>Token is invalid. Try logging out and login again</li>
								<li>Incorrect Server endpoints. Go to Settings to verify</li>
							</ol>
						</div>
						<div
							css={css`
								display: flex;
								gap: 20rem;
							`}
						>
							<NormalButton onClick={handleSettings} css={accountInfoButtonCss}>
								Settings
							</NormalButton>
							<NormalButton onClick={handeLogout} css={logoutButtonCss}>
								Logout
							</NormalButton>
						</div>
					</div>
				</div>
			</div>
		</CompactAppLayout>
	);
};

const LockIconSvg = (props) => (
	<svg viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M467.36 342.46h-10.148v-61.648c0-44.785-36.43-81.219-81.203-81.219-44.785 0-81.219 36.434-81.219 81.219v61.652h-10.148c-17.465 0-31.625 14.156-31.625 31.625v146.71c0 17.465 14.16 31.625 31.625 31.625h182.72c17.465 0 31.629-14.16 31.629-31.625v-146.71c0-17.469-14.168-31.625-31.633-31.625zM323.2 280.812c0-29.117 23.688-52.805 52.805-52.805 29.105 0 52.789 23.688 52.789 52.805v61.652l-105.59-.004zm68.98 165.03v39.488c0 8.938-7.242 16.176-16.184 16.176-8.937 0-16.176-7.242-16.176-16.176v-39.488c-7.578-5.172-12.551-13.875-12.551-23.734 0-15.875 12.863-28.738 28.727-28.738s28.727 12.867 28.727 28.738c.004 9.86-4.969 18.555-12.543 23.734z" />
	</svg>
);

const logoutButtonCss = css`
	margin-top: 16rem;
	width: 52rem;
`;
const accountInfoButtonCss = css`
	margin-top: 16rem;
	width: 84rem;
	background: transparent !important;
`;

const contentContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: -80px;
`;
const headingStyle = css`
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
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	justify-content: center;
`;
const iconStyle = css`
	width: 90rem;
	fill: #8860de;
`;
export { InvalidCredsErrorContainer };
