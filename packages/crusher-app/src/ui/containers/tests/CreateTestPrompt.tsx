import { css } from "@emotion/react";
import Link from "next/link";
import React, { useMemo } from "react";

import useSWR from "swr";

import { Text, TextBlock } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms/input/Input";

import { RELEASE_API } from "@constants/api";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";
import { getOSType } from "@utils/common";
import { Heading } from "dyson/src/components/atoms/heading/Heading";

export function RenderDownloadLink(props) {
	const osType = useMemo(getOSType, []);
	const [dmgLink, setDmgLink] = React.useState(null);
	const { data } = useSWR(RELEASE_API);

	React.useEffect(() => {
		if (!osType) return;

		if (osType === OS.MAC) {
			const dmgLink = OS_INFO.MAC.downloadLink || data?.assets?.filter(({ name }: any) => name.includes("darwin"))[0]?.browser_download_url;
			setDmgLink(dmgLink);
		} else if (osType === OS.Linux) {
			const zipLink = LINUX_INFO.Linux_DEB.downloadLink || data?.assets?.filter(({ name }: any) => name.includes("linux-x64"))[0]?.browser_download_url;
			setDmgLink(zipLink);
		}
	}, [osType]);

	if (dmgLink) {
		return <Link href={dmgLink}>{props.children}</Link>;
	}

	return null;
}

export const CreateTestPrompt = ({ className }: { className?: any }) => (
	<div
		css={css`
			margin-top: 40rem;
		`}
		className={className}
	>
		<div css={boxCSS}>
			<Heading fontSize={18} className="mb-10">
				Record a test
			</Heading>
			<Text fontSize={13} color={"#888888"}>
				Create tests for core flow, new features or bug fixes
			</Text>

			<div className={"flex mt-32"}>
				<div
					className={"flex items-center mr-20"}
				>
					<Terminal height={16} width={16} /> <span className={"ml-10 text-16 font-500"}>run</span>
				</div>

				<div className="flex items-center">
					<Input
						css={css`
							input {
								width: 324rem;
								font-size: 15rem;
							}
						`}
						size={"medium"}
						className={"mr-10"}
						initialValue={"npx crusher-cli test:create"}
					/>

					<RenderDownloadLink>
						<Text color="#c8c8c8" >
							Or download
						</Text>
					</RenderDownloadLink>
				</div>
			</div>

		</div>
	</div>
);

const boxCSS = css`
border: 1px solid rgb(255 255 255 / 8%);
	box-sizing: border-box;
	border-radius: 20px;
	width: 684rem;
    padding: 28rem 36rem;
	margin: 0 auto;
	transform: translateX(-20px);
	padding-bottom: 40rem;

`;
export default CreateTestPrompt;

function Terminal(props) {
	return (
		<svg height={14} width={14} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8af742" {...props}>
			<path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
		</svg >

	);
}
