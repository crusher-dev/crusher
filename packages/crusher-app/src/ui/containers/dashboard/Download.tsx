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

import CreateTestPrompt from "../tests/CreateTestPrompt";

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

/*
	@Note - Extract component overlay to dyson
 */
export function Download({ onClose }: { onClose: Function }) {
	return (
		<OverlayTransparent onClose={onClose}>
			<CenterLayout>
				<CreateTestPrompt
					css={css`
						margin-top: -160rem;
					`}
				/>
			</CenterLayout>
		</OverlayTransparent>
	);
}

export default Download;
