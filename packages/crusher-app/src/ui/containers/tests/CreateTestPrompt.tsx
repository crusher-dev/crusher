import { css } from "@emotion/react";
import React, { useMemo } from "react";
import { Input } from "dyson/src/components/atoms/input/Input";
import { Button, Text } from "dyson/src/components/atoms";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import Link from "next/link";
import { LINUX_INFO, OS, OS_INFO } from "@constants/app";
import useSWR from "swr";
import { RELEASE_API } from "@constants/api";
import { getOSType } from "@utils/common";

function LayerSVG(props) {
	return (
		<svg width={"48rem"} height={"48rem"} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g opacity={0.4} fill="#787D85">
				<path d="M48 14.941L24.001 1.896 0 14.941l24.001 13.047L48 14.941z" />
				<path d="M24.001 32.194L4.461 21.578 0 24.003l24.001 13.04L48 24.003l-4.462-2.425-19.537 10.616z" />
				<path d="M24.001 41.253L4.461 30.635 0 33.055l24.001 13.047L48 33.055l-4.462-2.42-19.537 10.618z" />
			</g>
		</svg>
	);
}

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
			<div className={"text-18 font-800 mb-12 leading-none"}>
				Record your tests <span className={"text-13 ml-12 font-400 leading-none"}>(1/3)</span>
			</div>
			<Text fontSize={14} color={"#C8C8C8"}>
				Create tests for core flow, new features or bug fixes
			</Text>

			<div className={"flex justify-between mt-40"}>
				<div
					className={"flex items-center"}
					css={css`
						color: #c8c8c8;
					`}
				>
					<Terminal /> <span className={"ml-12 text-16 font-500"}>In your project, run</span>
				</div>

				<div>
					<Input
						css={css`
							input {
								width: 305rem;
							}
						`}
						size={"medium"}
						initialValue={"npx crusher-cli test:create"}
					/>
				</div>
			</div>
			<RenderDownloadLink>
				<div
					className={"flex text-12 justify-end mt-12 underline"}
					css={css`
						color: #c8c8c8;
					`}
				>
					Or download recorder
				</div>
			</RenderDownloadLink>
		</div>
	</div>
);

const ViewDemoSection = () => {
	return (
		<div className={"flex mt-40 justify-between"} css={demoCSS}>
			<div>
				<TextBlock color={"#E3E3E3"} fontSize={16} weight={600}>
					Or view demo project to see crusher in action
				</TextBlock>
				<TextBlock color={"#E3E3E3"} fontSize={13} className={"mt-16"}>
					-&nbsp;&nbsp;Create test &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;Break something&nbsp;&nbsp;&nbsp; -&nbsp;&nbsp;Run test
				</TextBlock>
			</div>

			<Button bgColor={"tertiary-white"}>View demo</Button>
		</div>
	);
};

const demoCSS = css`
	margin: 0 auto;
	margin-top: 40px;
	width: 784rem;
	transform: translateX(-20px);
`;

const boxCSS = css`
	background: #101215;
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-sizing: border-box;
	border-radius: 12px;
	width: 784rem;
	padding: 28rem 32rem;
	margin: 0 auto;
	transform: translateX(-20px);
	padding-bottom: 40rem;
`;
export default CreateTestPrompt;

function Terminal(props) {
	return (
		<svg width={14} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M12.133 0H1.867c-.495 0-.97.181-1.32.503C.197.824.001 1.26 0 1.714v8.572c0 .454.197.89.547 1.211.35.322.825.502 1.32.503h10.266c.495 0 .97-.181 1.32-.503.35-.321.546-.757.547-1.211V1.714c0-.454-.197-.89-.547-1.211A1.956 1.956 0 0012.133 0zm-9.8 6a.496.496 0 01-.27-.079.434.434 0 01-.17-.208.395.395 0 01-.008-.26.428.428 0 01.157-.216l1.878-1.38-1.878-1.38a.44.44 0 01-.118-.128.404.404 0 01-.04-.326.418.418 0 01.085-.148.497.497 0 01.656-.067l2.333 1.714c.055.04.1.091.13.15a.4.4 0 010 .37.437.437 0 01-.13.15L2.625 5.906A.493.493 0 012.333 6zM7 6H5.133a.489.489 0 01-.33-.126.412.412 0 01-.136-.303c0-.113.049-.222.136-.303a.489.489 0 01.33-.125H7c.124 0 .242.045.33.125.088.08.137.19.137.303 0 .114-.05.223-.137.303A.488.488 0 017 6z"
				fill="#cfc573"
			/>
		</svg>
	);
}
