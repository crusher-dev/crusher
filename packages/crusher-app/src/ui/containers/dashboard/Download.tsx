import React from "react";
import { css } from "@emotion/react";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";
import { Button } from "dyson/src/components/atoms";
import { AppleSVG, LoadingSVG } from "@svg/dashboard";
import { OverlayTransparent } from "dyson/src/components/layouts/OverlayTransparent/OverlayTransparent";
import { getOSType } from "@utils/common";
import { useCallback, useMemo, useState } from "react";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";
import useSWR from "swr";
import { RELEASE_API } from "@constants/api";
import { useEffect } from "react";

export function DownloadButton(props) {
	const osType = useMemo(getOSType, []);
	const { downloadLink, label } = OS_INFO[osType];
	const [isDownloading, setDownload] = useState(false);

	const { data } = useSWR(RELEASE_API);

	const DownloadButton = useCallback(
		({ downloadLink, label }) => {
			return (
				<a href={downloadLink} onClick={setDownload.bind(this, true)}>
					<Button
						className={""}
						css={css`
							width: 182rem;
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
		const zipLink = data?.assets?.filter(({ name }) => name.includes("linux-x64"))[0].browser_download_url;

		return (
			<div className={"flex flex-col items-center"} {...props}>
				<div className={"flex  items-center"}>
					<DownloadButton downloadLink={zipLink} label={LINUX_INFO.Linux_ZIP.label} icon={null} />
					<div className={"ml-20"}>
						<DownloadButton downloadLink={zipLink} label={LINUX_INFO.Linux_DEB.label} icon={null} />
					</div>
				</div>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				{isDownloading && <div className={"mt-16 text-13"}>Initiating download, if it doesn't download. Open link in new tab.</div>}
			</div>
		);
	}

	if (osType === OS.MAC) {
		const dmgLink = data?.assets?.filter(({ name }) => name.includes(".dmg"))[0].browser_download_url;

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
			<Conditional>
				<div>
					<DownloadButton downloadLink={downloadLink} label={label} icon={null} />
				</div>
			</Conditional>
			{isDownloading && <div className={"mt-32 text-13"}>Initiaing download, if it doesn't download. Open link in new tab.</div>}
		</div>
	);
}

/*
	@Note - Extract component overlay to dyson
 */
export function Download({ onClose }: { onClose: Function }) {

	const [time, setTime] = useState(2);

	useEffect(() => {
		window.location = "crusher://test";

		(()=>{
			let timerValue = time;
			const timer = setInterval(()=>{
				setTime(timerValue--)
			},1000)
			if(timerValue<1){
				clearInterval(timer)
			}
		})()
	}, []);

	const launchTimePassed = time<0;
	return (
		<OverlayTransparent onClose={onClose}>
			<CenterLayout>
				<div css={downloadSection} className={"flex flex-col items-center pb-16"}>
					<div css={css`height: 32rem;`}>
						<Conditional showIf={!launchTimePassed}>
							<div className={"font-cera text-32 font-700"} css={css`color: #fff;`}>
								{time}
							</div>
						</Conditional>
						<Conditional showIf={launchTimePassed}>
							<div>
								<LoadingSVG height={28} />
							</div>
						</Conditional>
					</div>
					<div className={"font-cera text-15 font-500 mt-24"}>Opening recorder for you</div>
					<div className={"w-full flex flex-col items-center"} css={css`height: 185rem;`}>
						<Conditional showIf={launchTimePassed}>

							<div className={"mt-68 text-16 font-600"}>Not opening? Install and open recorder</div>
							<div className={"mt-28"}>
								<DownloadButton />
							</div>
							<div className={"mt-28 underline text-13"}>View downloads for other platform</div>
						</Conditional>
					</div>

				</div>
			</CenterLayout>
		</OverlayTransparent>
	);
}

const downloadSection = css`
	color: #d0d0d0 !important;
`;

export default Download;
