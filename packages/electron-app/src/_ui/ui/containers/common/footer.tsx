import React from "react";
import { css } from "@emotion/react";
import { Link } from "../../components/Link";
import { LinkPointer } from "../../components/LinkPointer";
import { DiscordSVG, GithubSVG } from "./stickyFooter";
import { linkOpen } from "electron-app/src/utils/url";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";
import DropdownContent from "@dyson/components/sharedComponets/FeedbackContainer";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";
import { ChatSVG } from "@dyson/components/sharedComponets/svg/normal";

const Footer = () => {
	return (
		<div css={containerCss}>
			<div css={leftSectionCss}>
				<Tooltip content={"walkthru"} placement="top" type="hover">
					<div>
						{" "}
						<LinkPointer css={resourcesCss} onClick={linkOpen.bind(this, "https://docs.crusher.dev")}>
							tutorial
						</LinkPointer>
					</div>
				</Tooltip>
				<Tooltip content={"crusher docs"} placement="top" type="hover">
					<div>
						<LinkPointer css={resourcesCss} onClick={linkOpen.bind(this, "https://docs.crusher.dev")}>
							docs
						</LinkPointer>
					</div>
				</Tooltip>
			</div>
			<div css={rightSectionCss}>
				<ShareFeedbak />
				<Link css={socialIcon} href="https://github.com/crusher-dev/crusher" title="Github">
					<GithubSVG height={14} width={14} />
				</Link>
				<Link css={socialIcon} href="https://discord.com/invite/dHZkSNXQrg" title="Discord">
					<DiscordSVG height={16} width={16} />
				</Link>
			</div>
		</div>
	);
};

export function ShareFeedbak() {
	const user = {};
	const asPath = "app page";
	return (
		<HoverCard
			wrapperCSS={wrapperCSS}
			css={userDropdownCSS}
			content={<DropdownContent user={user} asPath={asPath} />}
			placement="top-start"
			type="click"
			padding={2}
			offset={0}
		>
			<div className="flex items-center pt-0" css={feedbackCSS} title="Share feedback">
				<LinkPointer css={resourcesCss} showExternalIcon={false}>
					<ChatSVG />
				</LinkPointer>
			</div>
		</HoverCard>
	);
}

const wrapperCSS = css`
	padding-bottom: 10rem;
	padding-left: 20rem;
	min-height: 320rem;
`;

const userDropdownCSS = css`
	margin-left: -12re;

	padding: 24rem !important;
	width: 356rem;

	border-radius: 16px;
`;
export const feedbackCSS = css`
	:hover {
		div,
		span {
			color: #fff;
		}
		path {
			fill: #fff;
		}
	}
`;

const containerCss = css`
	display: flex;
	align-items: center;
	height: 36px;
	padding: 0px 24px;
	padding-left: 22px;

	background: #0d0d0d;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 0.5px solid rgba(153, 153, 153, 0.12);
`;
const leftSectionCss = css`
	display: flex;
	gap: 6px;
	align-items: center;
`;
const rightSectionCss = css`
	margin-left: auto;
	display: flex;
	gap: 12px;
	align-items: center;
`;
const socialIcon = css`
	font-size: 13px;

	text-decoration-line: underline;
	color: rgba(255, 255, 255, 0.54);

	path {
		fill: #d1d5db;
	}
	color: #d1d5db;
	:hover {
		color: #bc66ff;
		opacity: 1;
		path {
			fill: #bc66ff;
		}
	}
`;
const resourcesCss = css`
	font-size: 13.5px;
	text-align: right;

	color: #828282;
`;
export { Footer };
