import React from "react";
import { css } from "@emotion/react";
import { CenterLayout } from "dyson/src/components/layouts";
import { Button } from "dyson/src/components/atoms";
import { AppleSVG, LoadingSVG } from "@svg/dashboard";
import { OverlayTransparent } from "dyson/src/components/layouts/OverlayTransparent/OverlayTransparent";
import { getOSType } from "@utils/common";
import { useCallback, useMemo, useState } from "react";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";

function DownloadButton() {
	const osType = useMemo(getOSType, []);
	const { downloadLink, label } = OS_INFO[osType];
	const [isDownloading, setDownload] = useState(false);

	const DownloadButton = useCallback(({ downloadLink, label }) => {
		return (
			<a href={downloadLink} onClick={setDownload.bind(this, true)}>
				<Button
					className={"mt-28"}
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
	}, []);

	if (osType === OS.Linux) {
		const linuxZIP = LINUX_INFO.Linux_ZIP;
		const linuxDeb = LINUX_INFO.Linux_DEB;
		return (
			<div className={"flex flex-col items-center"}>
				<div className={"flex  items-center"}>
					<DownloadButton downloadLink={linuxZIP.downloadLink} label={linuxZIP.label} icon={null} />
					<div className={"ml-20"}>
						<DownloadButton downloadLink={linuxDeb.downloadLink} label={linuxDeb.label} icon={null} />
					</div>
				</div>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				{isDownloading && <div className={"mt-32 text-13"}>Initiaing download, if it doesn't download. Open link in new tab.</div>}
			</div>
		);
	}

	return (
		<div className={"flex flex-col items-center"}>
			<div>
				<DownloadButton downloadLink={downloadLink} label={label} icon={null} />
			</div>
			{isDownloading && <div className={"mt-32 text-13"}>Iniitiaing download, if it doesn't download. Open link in new tab.</div>}
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
				<div css={downloadSection} className={"flex flex-col items-center pb-16"}>
					<div>
						<LoadingSVG height={28} />
					</div>
					<div className={"font-cera text-15 font-500 mt-24"}>Opening recorder for you</div>
					<div className={"mt-68 text-16 font-600"}>Not opening? Install and open recorder</div>
					<DownloadButton />
					<div className={"mt-28 underline text-13"}>View downloads for other platform</div>
				</div>
			</CenterLayout>
		</OverlayTransparent>
	);
}

const downloadSection = css`
	color: #d0d0d0 !important;
`;

export default Download;
