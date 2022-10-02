import React from "react";
import { css } from "@emotion/react";
import { AddedIcon, CloseIcon } from "electron-app/src/_ui/constants/icons";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import { LinkPointer } from "../../components/LinkPointer";
import { HoverButton } from "../../components/hoverButton";
import { shell } from "electron";
import { getCurrentProjectConfig } from "electron-app/src/_ui/utils/project";

const ProxyConfigModifedToast = ({ meta, onClose }) => {
	const [projectConfigFile, setProjectConfigFile] = React.useState(null);

	React.useEffect(() => {
		const projectConfigFile = getCurrentProjectConfig();
		setProjectConfigFile(projectConfigFile);
	}, []);
	const handleOpenConfig = () => {
		if(!projectConfigFile) {
			alert("Project not linked locally");
			return;
		}
		shell.openPath(projectConfigFile);
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<div className={"flex items-center"} css={containerCss}>
			<div css={messageCss} className={"ml-8 flex-1 ml-14 pr-8 my-10"}>
				Modified proxy based on last test
			</div>
			<div css={viewConfigSectionCss} className={"py-6 px-2"}>
				<LinkPointer onClick={handleOpenConfig} showExternalIcon={false}>
					view config
				</LinkPointer>
			</div>
			<div>
				<LinkPointer className={"ml-8 mr-8"} showExternalIcon={false}>
					<CloseIcon onClick={handleClose}  css={closeIconCss} />
				</LinkPointer>
			</div>
		</div>
	);
};

const viewConfigSectionCss = css`
	font-size: 13px;
	border: 1px solid rgba(50, 50, 50, 0.8);
	border-bottom: none;
	border-top: none;
`;

const closeIconCss = css`
	width: 8px;
	height: 8px;
`;

const containerCss = css`
	position: fixed;
	bottom: 60rem;
	background: #171718;
	border: 0.5px solid rgba(50, 50, 50, 0.78);
	box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.88);
	border-radius: 12px;
	z-index: 9999;
	left: 50%;
	transform: translateX(-50%);
	z-index: 999999;

	font-size: 13.4rem;
	font-weight: 400;
	color: #AFAFAF;
`;
const actionTextCss = css`
	color: rgba(255, 114, 68, 1);
	font-weight: 600;
`;
const messageCss = css`
`;
export { ProxyConfigModifedToast };
