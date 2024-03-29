import React from "react";
import { css } from "@emotion/react";
import { shell } from "electron";
import { MenuDropdown } from "electron-app/src/_ui/ui/containers/dashboard/dashboardTopMenu";
import { LinkPointer } from "../components/LinkPointer";
import { Conditional } from "@dyson/components/layouts";

interface IProps {
	showHeader: boolean;
	headerRightSection?: any;
	title?: any;
	footer?: any;
	className?: any;
	children: any;
}
const CompactAppLayout = ({ className, title, headerRightSection, showHeader = true, footer, children, ...props }: IProps) => {
	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);

	const handleOpenDocs = React.useCallback(() => shell.openExternal("https://docs.crusher.dev"), []);
	const handleOpenApp = React.useCallback(() => shell.openExternal("https://app.crusher.dev"), []);

	return (
		<div className={String(className)} css={containerCss} {...props}>
			<div css={dragCss} className={"drag"}></div>
			<Conditional showIf={showHeader}>
				<div css={headerCss} className={"header"}>
					<div css={headerLeftSectionCss}>
						<MenuDropdown isRecorder={false} css={menuDropdownCss} />
					</div>
					<div css={titleCss} className={"header-title"}>
						{title}
					</div>
					{headerRightSection || (
						<div css={headerRightSectionCss}>
							<LinkPointer css={linkCss} onClick={handleOpenDocs}>
								Docs
							</LinkPointer>
							<LinkPointer onClick={handleOpenApp} css={[linkCss, openAppLinkCss]}>
								Open app
							</LinkPointer>
						</div>
					)}
				</div>
			</Conditional>
			<div css={contentCss} className={"content-section pt-10"}>
				{children}
			</div>
			<Conditional showIf={!!footer}>
				<div css={footerCss}>{footer}</div>
			</Conditional>
		</div>
	);
};

const menuDropdownCss = () => {
	return css`
		.crusher-hammer-icon {
			margin-left: ${process.platform !== "darwin" ? "0" : "50"}rem;
		}
	`;
};
const linkCss = css`
	font-size: 12.8rem;
	font-weight: 400;
	color: #e8e8e8;
`;
const openAppLinkCss = css`
	display: flex;
	align-items: center;
`;

const containerCss = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	transition: width 0.3s, height 0.3s;
	display: flex;
	flex-direction: column;

	width: 100%;
	height: 100%;

	border: none;
	border-radius: 0px;
	background: #080808;
`;

const dragCss = css`
	height: 36px;
	width: 100%;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;

const headerCss = css`
	display: flex;
	padding: 8px 8px 2px 28px;
	align-items: center;
	position: relative;
	height: 38rem;
	justify-content: space-between;
	z-index: 1000000;
`;

const headerLeftSectionCss = css`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
`;

const titleCss = css`
	flex: 1;
	display: flex;
	justify-content: center;

	font-family: Cera Pro;

	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;

	position: absolute;
    top: calc(50% + 5px);
    left: 50%;
    transform: translate(-50%, -50%);
`;
const headerRightSectionCss = css`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	padding-bottom: 1rem;
	padding-right: 8px;
	font-size: 13rem;
	gap: 8px;
	display: flex;
	align-items: center;

	height: 22px;
`;

const contentCss = css`
	flex: 1;
	padding-top: 20px;
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
const footerCss = css`
	margin-top: auto;
	border-top-style: solid;
	border-top-color: rgba(153, 153, 153, 0.12);
`;

export { CompactAppLayout };
