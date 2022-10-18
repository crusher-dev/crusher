import React from "react";
import { css } from "@emotion/react";
import { performGoToUrl } from "../../../commands/perform";
import { getCurrentSelectedProjct, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { useStore } from "react-redux";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { NormalButton } from "../../components/buttons/NormalButton";
import { getGlobalAppConfig, writeGlobalAppConfig } from "electron-app/src/lib/global-config";
import { setUserAccountInfo } from "electron-app/src/store/actions/app";
import { TextBlock } from "@dyson/components/atoms";
import { shell } from "electron";
import path from "path";
import os from 'os';
import { underlineOnHover } from "electron-app/src/_ui/constants/style";
import {useSelector} from "react-redux";
import { getCurrentProjectConfigPath } from "electron-app/src/_ui/utils/project";

const Info = ({className}) => {
	const selectedProject = useSelector(getCurrentSelectedProjct)
	const configPath = getCurrentProjectConfigPath();

	return (
		<div css={css`display: flex; justify-content: center;`}>
			<div className={`flex items-center ${className}`}>
				<TextBlock fontSize={13}  css={css`display: flex; justify-content: flex-end;`} color="#909090">
					<span>project:</span>
					<span className="ml-2" css={[linkCSS]}>{selectedProject}</span>
				</TextBlock>

				<TextBlock  fontSize={13} color="#909090" className="ml-4 flex-1">
					<span>config path:</span>
					<span onClick={() => { shell.openPath(configPath); }} className="ml-2" css={[linkCSS, underlineOnHover]}>~/{path.relative(os.homedir(), configPath)}</span>
				</TextBlock>
			</div>
		</div>);
}

const UnAuthorizedErrorContainer = () => {
	const store = useStore();


	const handleAccountInfo = React.useCallback(() => {
		const acc = getUserAccountInfo(store.getState() as any);
		if (acc) {
			alert(`Account info\n\nTeam: ${acc.teamName}\nName: ${acc.name}\nLogin: ${acc.email}`);
		} else {
			alert("No account info available.");
		}
	}, []);

	return (
		<CompactAppLayout title={null} footer={<Footer />} css={containerCss}>
			<div css={containerStyle}>
				<div css={contentContainerStyle}>
					<LockIconSvg height={24} width={24} className="mb-16" />
					<div css={headingStyle}>
						You don't have access to this project
					</div>
					<Info css={css`width: 100%; gap: 20rem;`} className={"mt-18"}/>

					<div css={descriptionStyle}>
						<div>Please contact your org admin to gain access or go back.</div>
					

						<div
							className="mt-20"
							css={css`
								display: flex;
								gap: 20rem;
							`}
						>
							<NormalButton onClick={handleAccountInfo} css={accountInfoButtonCss}>
								Account Info
							</NormalButton>
						</div>
					</div>
				</div>
			</div>
		</CompactAppLayout>
	);
};

const linkCSS = css`
	color: #6CB7FC !important;
`

const containerCss = css`
	height: 100%;
	background: #080808;
	position: relative;
`;

const LockIconSvg = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
		<path fill="#4E4E4E" fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
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

	font-weight: 800;
	font-size: 18rem;
	text-align: center;
	color: #ffffff;
`;
const highlightStyle = css`
	color: #ffec87;
`;
const descriptionStyle = css`
	margin-top: 12rem;

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
export { UnAuthorizedErrorContainer };
