import { css } from "@emotion/react";
import React from "react";

import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

import { contentContainerScroll } from "@ui/layout/DashboardBase";

export function TutorialContent({ setLessionIndex }: any): JSX.Element {
	return (
		<div className={"flex flex-row mt-28 justify-center"}>
			<div css={contentContainerScroll}>
				<Content
					setLessionIndex={setLessionIndex}
					heading="Creating first test"
					desc=" Crusher required apps to create and run test locally. It’s made primarily for devs, althoug people familiar with devterm like HTML, basic JS can also use it"
				/>
			</div>
		</div>
	);
}
function Content(props) {
	const { heading, desc, setLessionIndex } = props;
	return (
		<div className="flex">
			<div css={videoBlock} className={"mr-44"}>
				<iframe
					width="100%"
					height="320"
					src="https://www.loom.com/embed/4d7671daaea5401c89731d2f7c333388?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
					frameborder="0"
					webkitallowfullscreen
					mozallowfullscreen
					allowfullscreen
				></iframe>
			</div>
			<div>
				<LinkBlock type="plain" css={tutorialBack} onClick={setLessionIndex.bind(this, null)}>
					go back
				</LinkBlock>
				<TextBlock weight={600} fontSize={18} color="#898989" className="mb-20">
					{heading}
				</TextBlock>
				<TextBlock weight={400} fontSize={13} color="#464646" showLineHeight={true} className="mb-70">
					{desc}
				</TextBlock>

				<TextBlock weight={400} fontSize={13} color="#464646" className="mb-10">
					Use Crusher With
				</TextBlock>
				<TextBlock weight={400} fontSize={13} color="#464646" className="mb-10">
					CLI
				</TextBlock>
				<TextBlock weight={400} fontSize={13} color="#464646">
					CLI
				</TextBlock>
			</div>
		</div>
	);
}

export const videoBlock = css`
	width: 570px;
	height: 300px;

	overflow: hidden;

	background: rgba(0, 0, 0, 0.19);
	border: 1px solid #1f1f1f;
	// border-radius: 20px;
`;
export const tutorialBack = css`
	color: #5e5e5e;
	font-size: 13rem;
	margin-left: -12rem;
	margin-top: 10rem;
	margin-bottom: 12rem;
`;
