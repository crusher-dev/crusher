import { css } from "@emotion/react";
import React from "react";

import { LinkBox } from "@components/common/LinkBox";
import { NewTabSVG } from "@svg/dashboard";

const DeveloperInput = () => {
	const mainRef = React.useRef(null);

	return (
		<div ref={mainRef} css={[contentCss]}>
			<div css={headerCss}>
				<div css={headingCss}>In project, run</div>
				<div css={docsLinkCss}>
					<a href="https://docs.crusher.dev" target="_blank" className="flex">
						Docs <NewTabSVG className={"ml-8 mb-4"} />
					</a>
				</div>
			</div>
			<div css={inputFormContainerCss}>
				<LinkBox css={linkBoxCss} value="npx crusher-cli">
					<ClipboardIcon
						css={css`
							width: 13px;
							height: 13px;
							position: absolute;
							right: 13px;
							top: 13px;
							:hover {
								opacity: 0.8;
							}
						`}
					/>
				</LinkBox>
			</div>
			<div
				css={[
					noteCss,
					css`
						padding-left: 2px;
						margin-top: 10px;
					`,
				]}
			>
				Run in git repo
			</div>

			<div css={waitinContainerCss}>
				<div css={waitingLeftContainerCss}>
					<ClockIcon css={clockIconCss} />
					<div>Waiting for a test to be created.</div>
				</div>

				<div css={howToDoItTextCss}>How to do it?</div>
			</div>
		</div>
	);
};

const clockIconCss = css`
	width: 16rem;
`;
const waitinContainerCss = css`
	display: flex;
	align-items: center;
	margin-top: 100rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13.7rem;
	letter-spacing: 0.01em;

	color: rgba(255, 255, 255, 0.62);
`;
const waitingLeftContainerCss = css`
	display: flex;
	align-items: center;
	gap: 14rem;
`;
const howToDoItTextCss = css`
	margin-left: auto;
	:hover {
		opacity: 0.8;
	}
`;
const ClockIcon = (props: any) => (
	<svg viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.8 4a.8.8 0 1 0-1.6 0v4a.8.8 0 1 0 1.6 0V4ZM14.195.195a.667.667 0 0 0 0 .943l.667.667a.667.667 0 1 0 .943-.943l-.667-.667a.667.667 0 0 0-.943 0Z"
			fill="#D0D0D0"
		/>
	</svg>
);

const headerCss = css`
	display: flex;
	align-items: center;
	width: 100%;
`;
const docsLinkCss = css`
	margin-left: auto;
	display: flex;
	align-items: center;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	text-align: right;
	letter-spacing: 0.03em;

	color: #88868b;
	:hover {
		opacity: 0.8;
	}
`;
const linkBoxCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	text-align: center;
	letter-spacing: 0.01em;
	padding: 10rem 18rem;
	width: 250px;
	background: #000;
	color: #a864ff;
	position: relative;

	border: 0.5px solid rgba(255, 255, 255, 0.21);
	border-radius: 11px;
`;

const headingCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 500;
	font-size: 18rem;
	/* identical to box height */
	color: #ffffff;
`;
const contentCss = css`
	margin-top: 20px;
	width: 100%;
	padding-top: 28px;
	transition: height 0.3s;
	overflow: hidden;
`;
const inputFormContainerCss = css`
	display: flex;
	gap: 10px;
	margin-top: 16px;
	width: 100%;
`;
const noteCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	letter-spacing: 0.03em;
	margin-top: 20px;
	color: rgba(255, 255, 255, 0.35);

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.35);
`;

const ClipboardIcon = (props) => (
	<svg css={css`0 0 13 13`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M12.037 0H4.851a.93.93 0 0 0-.928.929v2.18h4.226c.98 0 1.776.797 1.776 1.776v4.159h2.112a.93.93 0 0 0 .929-.93V.93A.93.93 0 0 0 12.037 0Z"
			fill="#fff"
		/>
		<path d="M8.149 3.957H.963a.93.93 0 0 0-.929.928v7.186a.93.93 0 0 0 .929.93h7.186a.93.93 0 0 0 .929-.93V4.885a.93.93 0 0 0-.93-.928Z" fill="#fff" />
	</svg>
);

export { DeveloperInput };
