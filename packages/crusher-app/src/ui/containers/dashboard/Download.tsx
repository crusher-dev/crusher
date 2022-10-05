import { css } from "@emotion/react";
import React, { useCallback, useMemo, useState } from "react";

import useSWR from "swr";

import { Button } from "dyson/src/components/atoms";
import { CenterLayout } from "dyson/src/components/layouts";
import { OverlayTransparent } from "dyson/src/components/layouts/OverlayTransparent/OverlayTransparent";

import { RELEASE_API } from "@constants/api";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";
import { AppleSVG } from "@svg/dashboard";
import { getOSType } from "@utils/common";


export function DownloadButton(props) {
	const osType = useMemo(getOSType, []);
	const [isDownloading, setDownload] = useState(false);
	const { data } = useSWR(RELEASE_API);

	const DownloadButton = useCallback(
		({ downloadLink, label }) => {
			return (
				<a href={downloadLink} onClick={setDownload.bind(this, true)}>
					<Button
						className={""}
						css={css`
							width: 164rem;
						`}
					>
						<div className={"flex items-center justify-center"}>
							<AppleSVG className={"mr-12"} />
							<span className={"mt-2"}>{label}</span>
						</div>
					</Button>
				</a>
			);
		},
		[data],
	);

	if (osType === OS.Linux) {
		const zipLink = LINUX_INFO.Linux_DEB.downloadLink || data?.assets?.filter(({ name }: any) => name.includes("linux-x64"))[0]?.browser_download_url;

		return (
			<div className={"flex flex-col items-center"} {...props}>
				<div className={"flex  items-center"}>
					{/*<DownloadButton downloadLink={zipLink} label={LINUX_INFO.Linux_ZIP.label} icon={null} />*/}
					<div className={"ml-0"}>
						<DownloadButton downloadLink={zipLink} label={LINUX_INFO.Linux_DEB.label} icon={null} />
					</div>
				</div>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				{isDownloading && <div className={"mt-16 text-13"}>Initiating download, if it doesn't download. Open link in new tab.</div>}
			</div>
		);
	}

	if (osType === OS.MAC) {
		const dmgLink = OS_INFO.MAC.downloadLink || data?.assets?.filter(({ name }: any) => name.includes("darwin"))[0]?.browser_download_url;
		return (
			<div className={"flex flex-col items-center"} {...props}>
				<div className={"flex  items-center"}>
					<DownloadButton downloadLink={dmgLink} label={OS_INFO.MAC.label} icon={null} />
				</div>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				{isDownloading && <div className={"mt-16 text-13"}>Initiating download, if it doesn't download. Open link in new tab.</div>}
			</div>
		);
	}

	return (
		<div className={"flex flex-col items-center"} {...props}>
			<div>Recorder is only available in dmg and dev :(</div>
		</div>
	);
}



import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";


function TerminalIcon(props) {
	return (
		<svg width={15} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M12.633.5H2.367c-.495 0-.97.196-1.32.545-.35.348-.546.82-.547 1.312v9.286c0 .492.197.964.547 1.313.35.348.825.543 1.32.544h10.266c.495 0 .97-.196 1.32-.544.35-.349.546-.82.547-1.313V2.357c0-.492-.197-.964-.547-1.312A1.874 1.874 0 0012.633.5zM2.833 7a.468.468 0 01-.44-.31.462.462 0 01.149-.517L4.42 4.68 2.542 3.184a.465.465 0 11.583-.726l2.333 1.858a.465.465 0 010 .725L3.125 6.898A.468.468 0 012.833 7zM7.5 7H5.633a.468.468 0 01-.466-.464.463.463 0 01.466-.465H7.5a.468.468 0 01.467.465A.463.463 0 017.5 7z"
				fill="#7B7B7B"
			/>
		</svg>
	);
}
function CreateTest() {
	return (
		<React.Fragment>
			<div>
				<div className="wexdsf-frame532 flex justify-center">
					<div
						className="flex flex-col items-center margin-auto"
						css={css`
							margin: 0 auto;
						`}
					>
						<div className=" flex flex-col items-center mb-40">
							<span className="run-headline">
								<span>Use recorder/CLI to create a test</span>
							</span>

							<TextBlock color="#FDFDFD" fontSize="18" weight="800">
								Create a new test
							</TextBlock>
						</div>
						<div className="run-local-box">
							<div className="run-locally">
								<TextBlock fontSize={15} color={"#A7A7A7"} className="flex items-center">
									run in a git repo <TerminalIcon className="ml-12" />
								</TextBlock>
							</div>
							<div className="wexdsf-frame420">
								<span className="run-headline06 flex items-center " css={commandBox}>
									<span className="next-sign mr-8">&gt;</span>
									<TextBlock color="#acec6d" weight={"600"} fontSize={17} className="command">
										npx crusher-cli test:create
									</TextBlock>
								</span>
							</div>
						</div>
						<TextBlock color="#646464" fontSize="13.5">
							Not a dev?{" "}
							<a href="https://docs.crusher.dev/getting-started/create-your-first-test#or-install-recorder" target="_blank" css={hoverUnderline}>
								Download recorder
							</a>
						</TextBlock>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="demo-video" css={videoCSS}>
						<img
							src="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/aad05f7f-1781-414b-ae1f-64cb800c56f3/9faa2efe-c366-499f-93d4-f1b83cb14661?org_if_sml=1503"
							alt="Rectangle15107233"
							className="wexdsf-rectangle1510"
						/>
						<div className="wexdsf-frame537 justify-center ml-12">
							<span className="video-name">getting started with crusher</span>
							<span className="run-headline14">
								<span>1:20</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			<style jsx>
				{`
					.wexdsf-frame532 {
						margin-top: -100px;
						display: flex;
						padding: 42rem 0 74rem 0;
						min-width: 680rem;
						position: relative;

						align-items: flex-start;
						border: 0.5px solid rgba(142,142,142,0.1);
						border-style: solid;
						max-width: 680rem;
						border-width: 0.5rem;

						border-radius: 20rem;
						margin-bottom: 42rem;
						flex-direction: column;
						background-color: rgb(12 12 12);
					}

					.run-headline {
						color: #dcdcdc;
						width: 409rem;

						font-size: 13rem;

						text-align: center;

						font-weight: 400;
						line-height: 15.5rem;

						margin-bottom: 17rem;
					}

					.run-local-box {
						display: flex;
						position: relative;

						align-items: center;

						margin-bottom: 40rem;
					}
					.run-locally {
						display: flex;
						position: relative;

						align-items: center;

						margin-right: 18rem;
					}

					.wexdsf-frame420 {
						width: 275rem;
						height: 40rem;
						display: flex;
						padding: 7rem 14rem;
						position: relative;

						align-items: center;
						flex-shrink: 0;
						border-color: rgba(76, 76, 76, 0.5400000214576721);
						border-style: solid;
						border-width: 0.6000000238418579rem;

						border-radius: 10rem;

						justify-content: space-between;
						background-color: rgba(0, 0, 0, 0.4000000059604645);
					}
					.run-headline06 {
						color: rgba(58, 58, 58, 1);

						font-size: 14rem;

						font-style: Medium;
						text-align: center;
						font-family: Cera Pro;
						font-weight: 500;
						line-height: normal;
					}
					.next-sign {
						color: rgba(58, 58, 58, 1);
					}

					.wexdsf-group {
						width: 12rem;
						height: 12rem;
						display: flex;
						padding: 0;
						position: relative;

						align-items: flex-start;
						flex-shrink: 1;

						border-style: none;
						border-width: 0;

						flex-direction: row;
						justify-content: flex-start;
						background-color: transparent;
					}
					.wexdsf-group1 {
						display: flex;

						align-items: flex-start;
						flex-shrink: 1;

						border-style: none;
						border-width: 0;

						flex-direction: row;
						justify-content: flex-start;
						background-color: transparent;
					}

					.run-headline10 {
						color: #dcdcdc;

						font-size: 13rem;

						font-weight: 400;
						line-height: 15.5rem;
					}
					.wexdsf-frame538 {
						display: flex;
						position: relative;

						align-items: flex-start;

						justify-content: center;
					}
					.demo-video {
						display: flex;
					}

					.wexdsf-frame537 {
						display: flex;
						position: relative;

						align-items: flex-start;

						flex-direction: column;
					}
					.video-name {
						color: #dcdcdc;

						font-size: 13rem;

						font-style: Medium;

						font-weight: 500;
						line-height: 15.5rem;

						margin-bottom: 6rem;
					}
					.run-headline14 {
						color: #dcdcdc;

						font-size: 13rem;

						font-weight: 400;
						line-height: 15.5rem;
					}
				`}
			</style>
		</React.Fragment>
	);
}

const commandBox = css`
	cursor: text;
	.command {
		-moz-user-select: text;
		-khtml-user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}
`;
const videoCSS = css`
	:hover {
		.video-name {
			text-decoration: underline !important;
			color: #ae47ff;
		}
	}
`;

const hoverUnderline = css`
	:hover {
		text-decoration: underline !important;
		color: #ae47ff;
	}
`;

/*
	@Note - Extract component overlay to dyson
 */
export function Download({ onClose }: { onClose: Function }) {
	return (
		<OverlayTransparent onClose={onClose} css={overLayCSS}>
			<CenterLayout>
				<CreateTest />
			</CenterLayout>
		</OverlayTransparent>
	);
}

const overLayCSS = css`
	background: rgb(0 0 0 / 75%) !important;
	backdrop-filter: blur(3px);
`

export default Download;
