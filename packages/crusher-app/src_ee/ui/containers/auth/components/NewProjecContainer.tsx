import { css } from "@emotion/react";
import Link from "next/link";
import React from "react";

import { Logo, Text } from "dyson/src/components/atoms";
import { LinkBlock } from "dyson/src/components/atoms/Link/Link";

export default function NewProjectContainer({ children }) {
	return (
		<div css={containerCSS}>
			<div className="pt-18">
				<TopBar />
			</div>
			<div className={"flex justify-center"}>
				<div
					className={"flex flex-col items-center"}
					css={css`
						margin-top: 95rem;
					`}
				>
					{children}
				</div>
			</div>
		</div>
	);
}

const containerCSS = css(`
height: 100vh;
// background: linear-gradient(180deg, #0A0A0A 0%, #0A0A0A 100%);
// background: linear-gradient(180deg,#0c0c0c 0%,#0A0A0A 100%);
background: #080808;
width: 100vw;
`);

function ExternalLink(props: any) {
	return (
		<svg width={9} height={9} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.651 1.001c.24.216.259.585.043.824L2 8c-.215.24-.76.216-1 0-.239-.216-.215-.76 0-1l5.827-5.956a.583.583 0 01.824-.043z"
				fill="#3C3C3D"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.853 1.77a.583.583 0 01.552-.613L7.23.852a.583.583 0 01.613.552l.305 5.826a.583.583 0 11-1.165.06L6.71 2.049l-5.243.275a.583.583 0 01-.613-.552z"
				fill="#3C3C3D"
			/>
		</svg>
	);
}

export const TopBar = () => {
	return (
		<div className="flex justify-between items-center" css={topBar}>
			<Link href={"/projects"}>
				<Text css={hoverUnderline}>← Go back</Text>
			</Link>

			<a href="https://crusher.dev" css={logoCSS}>
				<Logo height={20} />
			</a>

			<div css={linkSection} className="flex">
				<a className="text-14" href="https://docs.crusher.dev" target="_blank">
					<LinkBlock paddingY={4} className="flex items-center text-14">
						<span className="mr-4">Docs</span> <ExternalLink />
					</LinkBlock>
				</a>
			</div>
		</div>
	);
};

const hoverUnderline = css`
	:hover {
		text-decoration: underline !important;
		color: #ae47ff;
	}
`;

const logoCSS = css`
	:hover {
		filter: brightness(0.75);
	}
`;

const topBar = css`
	margin: 0 auto;
	width: 800rem;
	padding: 0 30px;
	max-width: 100%;
`;

const linkSection = css`
	a:hover {
		color: #c5c5c5;
		text-decoration: underline;
	}
	a {
		color: #c5c5c5;
		font-size: 14px;
	}
`;
