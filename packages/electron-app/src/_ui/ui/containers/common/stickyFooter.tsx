import React from "react";
import { css } from "@emotion/react";
import { CloudIcon, ConsoleIcon, DisabledCloudIcon, DocsIcon } from "../../../constants/icons";
import { Link } from "../../components/Link";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";

import { linkOpen } from "electron-app/src/utils/url";
import { getAppSettings, getIsProxyInitializing, getProxyState } from "electron-app/src/store/selectors/app";
import { useSelector, useStore } from "react-redux";
import { useBuildNotifications } from "../../../hooks/tests";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { shell } from "electron";
import { CloudCrusher } from "electron-app/src/lib/cloud";

interface IProps {
	className?: string;
}
const StickyFooter = ({ className }: IProps) => {
	const { latestNotification, updateNotification } = useBuildNotifications();
	const store = useStore();
	const proxyIsInitializing = useSelector(getIsProxyInitializing);
	const proxyState = useSelector(getProxyState);

	const isProxyWorking = Object.keys(proxyState).length;

	const isProxyDisabled = !proxyIsInitializing && !isProxyWorking;

	const handleViewReport = (reportId) => {
		const appSettings = getAppSettings(store.getState() as any);
		shell.openExternal(resolveToFrontEndPath("/app/build/" + reportId, appSettings.frontendEndPoint));
	};

	React.useEffect(() => {
		if (latestNotification?.id && !latestNotification.status) {
			const interval = setInterval(() => {
				CloudCrusher.getBuildReport(latestNotification.id).then((res) => {
					updateNotification(latestNotification.id, {
						status: res.status,
					});
					if (res.status !== "RUNNING") {
						clearInterval(interval);
					}
				});
			}, 5000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [latestNotification?.id]);

	const statusMessage =
		latestNotification?.status && latestNotification?.status !== "RUNNING" ? "has " + latestNotification.status.toLowerCase() : "is running";
	return (
		<div css={containerCss} className={String(className)}>
			<div css={contentCss}>
				{latestNotification ? (
					<div css={notificationContainerCss}>
						<div css={notificationContentCss}>
							<ConsoleIcon css={consoleIconCss} />
							<span css={notificationTextCss}>2: Last build {statusMessage}</span>
						</div>
						<div css={notificationActionCss}>
							<Link css={linkCss} onClick={handleViewReport.bind(this, latestNotification.id)}>
								view report
							</Link>
						</div>
					</div>
				) : (
					<span css={footerBottomLabel}>test page</span>
				)}

				<div css={contextContainerCss}>
					<Tooltip content={isProxyDisabled ? "disabled" : proxyIsInitializing ? "initializng" : "active"} placement="top" type="hover">
						{!proxyIsInitializing && !isProxyWorking ? (
							<DisabledCloudIcon
								css={[
									cloudIconCss,
									css`
										width: 22px;
										height: 16px;
									`,
									clickableCss,
								]}
								shouldAnimateGreen={false}
							/>
						) : (
							<CloudIcon css={[cloudIconCss, clickableCss]} shouldAnimateGreen={proxyIsInitializing} />
						)}
					</Tooltip>
					{/* <NotepadIcon css={[notepadIconCss, clickableCss]} /> */}
				</div>
			</div>
			<HoverCard content={<HelpContent />} placement="top" type="hover" padding={8} offset={0}>
				<div css={docsButtonCss}>
					<DocsIcon css={docsIconCss} />
					<span css={docsButtonTextCss}>Docs & help</span>
				</div>
			</HoverCard>
		</div>
	);
};

const containerCss = css`
	background: #0d0d0e;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 0.5px solid rgba(255, 255, 255, 0.08);
`;
const docsButtonCss = css`
	background: #0f1010;
	border-left: 0.5px solid #242424;
	font-family: "Cera Pro";

	font-weight: 500;
	font-size: 12px;

	color: #ffffff;
	width: 124px;
	height: 42px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	border-left: 1px solid #242424;

	:hover {
		opacity: 0.8;
	}
`;
const docsIconCss = css`
	width: 16px;
	height: 16px;
`;
const docsButtonTextCss = css`
	margin-left: 7px;
`;

const contextContainerCss = css`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
	margin-left: auto;
`;
const notificationContainerCss = css`
	flex: 1;
	display: flex;
	align-items: center;
`;
const contentCss = css`
	flex: 1;
	display: flex;
	padding-left: 27px;
	padding-right: 13px;
`;
const cloudIconCss = css`
	width: 16px;
	height: 11px;
`;
const clickableCss = css`
	:hover {
		opacity: 0.8;
	}
`;
const consoleIconCss = css`
	width: 11px;
	height: 11px;
`;
const notificationContentCss = css`
	display: flex;
	align-items: center;
`;
const notificationTextCss = css`
	font-weight: 400;
	font-size: 13px;
	letter-spacing: 0.027em;
	margin-left: 8px;
	color: rgba(255, 255, 255, 0.69);
`;

const footerBottomLabel = css`
	font-size: 13px;
	letter-spacing: 0.027em;
	color: #828282;
`;

const notificationActionCss = css`
	margin-left: auto;
	padding-right: 12px;
`;
const linkCss = css`
	font-weight: 400;
	font-size: 12px;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.43);
`;
export { StickyFooter };

//  🔴🔴 Do not edit, this is copy of DashboardBase help section
export function HelpContent({ ...props }) {
	return (
		<div className=" pt-3 pb-6" {...props}>
			<a onClick={linkOpen.bind(this, "https://docs.crusher.dev")} target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} css={linkCSS}>
					Documentation <ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
			<a onClick={linkOpen.bind(this, "https://github.com/crusher-dev/crusher")} target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<GithubSVG height={11} width={11} className={"mr-6"} /> <span className="mt-2">Github</span>
					<ExternalIcon className="ml-4" />
				</TextBlock>
			</a>
			<a onClick={linkOpen.bind(this, "https://discord.com/invite/dHZkSNXQrg")} target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<DiscordSVG height={12} width={13} className={"mr-6"} css={discordIcons} /> <span className="mt-1">Discord</span>
					<ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
		</div>
	);
}

const discordIcons = css`
	margin-left: -1rem;
`;

const linkCSS = css`
	display: flex;
	align-items: center;
	padding-left: 8rem;
	padding-right: 8rem;
	path {
		fill: #d1d5db;
	}
	color: #d1d5db;
	:hover {
		background: rgba(43, 43, 43, 0.4);
		color: #bc66ff;
		path {
			fill: #bc66ff;
		}
	}
	height: 28rem;
	width: 148rem;
	border-radius: 6px;
	padding-top: 1rem;

	transition: all 0ms linear;

	path,
	* {
		transition: all 0ms;
	}
`;

export function ExternalIcon(props: any) {
	return (
		<svg width={8} height={8} fill="none" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.32.487c.24.216.26.584.044.824L1.67 7.486c-.216.239-.76.215-1 0-.24-.216-.216-.761 0-1L6.497.53A.583.583 0 017.32.487z"
				fill="#3C3C3D"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.522 1.256a.583.583 0 01.552-.613L6.9.338a.583.583 0 01.613.552l.305 5.825a.583.583 0 01-1.165.061l-.275-5.242-5.242.274a.583.583 0 01-.614-.552z"
				fill="#3C3C3D"
			/>
		</svg>
	);
}

export const DiscordSVG = (props) => (
	<svg width={26} height={27} viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<g clipPath="url(#a)">
			<path
				d="M22.01 5.776a21.697 21.697 0 0 0-5.292-1.615.08.08 0 0 0-.085.04c-.229.4-.482.92-.66 1.331a20.114 20.114 0 0 0-5.943 0A13.38 13.38 0 0 0 9.36 4.2a.084.084 0 0 0-.084-.04 21.636 21.636 0 0 0-5.293 1.616.075.075 0 0 0-.034.03C.578 10.76-.346 15.592.107 20.365a.087.087 0 0 0 .034.06 21.698 21.698 0 0 0 6.493 3.23c.033.01.07-.002.09-.03.5-.672.947-1.38 1.329-2.126a.08.08 0 0 0-.045-.112 14.302 14.302 0 0 1-2.028-.951.081.081 0 0 1-.008-.137c.136-.1.272-.204.402-.31a.082.082 0 0 1 .084-.011c4.255 1.911 8.862 1.911 13.067 0a.082.082 0 0 1 .085.01c.13.105.267.211.404.311a.081.081 0 0 1-.007.137c-.648.372-1.321.687-2.03.95a.081.081 0 0 0-.044.113c.39.745.837 1.453 1.328 2.125.02.029.057.04.09.03a21.627 21.627 0 0 0 6.503-3.229.082.082 0 0 0 .034-.058c.542-5.519-.908-10.312-3.844-14.562a.066.066 0 0 0-.034-.03ZM8.688 17.46c-1.28 0-2.336-1.157-2.336-2.578 0-1.422 1.035-2.579 2.336-2.579 1.312 0 2.357 1.167 2.337 2.579 0 1.42-1.035 2.578-2.337 2.578Zm8.64 0c-1.281 0-2.337-1.157-2.337-2.578 0-1.422 1.035-2.579 2.337-2.579 1.311 0 2.357 1.167 2.336 2.579 0 1.42-1.025 2.578-2.336 2.578Z"
				fill="#5865F2"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" transform="translate(0 .91)" d="M0 0h26v26H0z" />
			</clipPath>
		</defs>
	</svg>
);

export const GithubSVG = function (props) {
	return (
		<svg width={16} height={16} viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 0a8 8 0 0 0-2.529 15.591c.4.074.529-.174.529-.384v-1.49c-2.225.484-2.689-.944-2.689-.944-.364-.924-.888-1.17-.888-1.17-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.713 1.223 1.871.87 2.328.665.071-.517.279-.87.508-1.07-1.777-.203-3.645-.889-3.645-3.953 0-.874.313-1.588.824-2.148-.082-.202-.356-1.016.078-2.117 0 0 .672-.215 2.201.82A7.673 7.673 0 0 1 8 3.868c.68.004 1.365.093 2.004.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.161 1.916.079 2.117.513.56.823 1.274.823 2.148 0 3.072-1.871 3.749-3.653 3.947.287.248.549.735.549 1.481v2.196c0 .212.128.462.534.384A8.002 8.002 0 0 0 8 0Z"
				fill="#fff"
			/>
		</svg>
	);
};
