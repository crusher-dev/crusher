import { css } from "@emotion/react";
import React, { useState } from "react";

import { contentContainerScroll, SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";

import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import { EditTestSVG, IntegrationSVG, PlayIconCircleSVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { TutorialContent } from "../../src/ui/containers/dashboard/TutorialContent";

function Dashboard() {
	usePageTitle("Dashboard");

	const [lessonIndex, setLessionIndex] = useState(null)

	return (
		<SidebarTopBarLayout>
			<div css={[containerStyle]} className=" ">


				<div className={"flex flex-row items-center justify-center"} css={onboardingLesson}>
					<div css={contentContainerScroll}>
						<div className="flex justify-between items-center">
							<TextBlock weight={600} fontSize={19} color="#b0b0b0">Get started with short videos</TextBlock>

							<div className="flex">
								<LinkBlock type="plain" css={topLink}>guide</LinkBlock>
								<LinkBlock type="plain" css={topLink} href="https://docs.crusher.dev">view docs</LinkBlock>
							</div>
						</div>
						<div className={"text-14 mt-20 flex items-center"} css={footerPlaceholderStyle}>
							{links.map((link, index) => {
								const { icon, text } = link;
								const selected = index + 1 === lessonIndex;
								return (
									<div className="flex items-center" css={[linkCSS, selected && selectedCSS]} onClick={setLessionIndex.bind(this, index + 1)}>
										{icon}
										<TextBlock className="ml-8 mt-1" fontSize={14} color="#5E5E5E">{text}</TextBlock>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				<Conditional showIf={!!lessonIndex}>
					<TutorialContent lessonIndex={lessonIndex} setLessionIndex={setLessionIndex}></TutorialContent>
				</Conditional>

			</div>
		</SidebarTopBarLayout>
	);
}

const selectedCSS = css`


	color: #D378FE;
	div{
		color: #D378FE;
		text-decoration: underline;
	}
	path{
		fill: #D378FE;
	}

	:hover{
		color: #D378FE;
	div{
		color: #D378FE;
		text-decoration: underline;
	}
	path{
		fill: #D378FE;
	}
	}

`

const topLink = css`
	color: #5E5E5E;
	font-size: 14rem;
`

const linkCSS = css`

	:hover{
		color: #fff;
		div{
			color: #fff;
			text-decoration: underline;
		}
		path{
			fill: #fff;
		}
	}
`
const links = [
	{
		text: "Create first test",
		icon: <EditTestSVG />
	}, {
		text: "Run test",
		icon: <PlayIconCircleSVG />
	}
	, {
		text: "integrationg in project",
		icon: <IntegrationSVG />
	}

]

const containerStyle = css`
	color: #fff !important;
`;

const onboardingLesson = css`
	border-bottom: 1rem solid #191e25;
	height: 148rem;
	background: rgba(0, 0, 0, 0.87);

`;
const footerPlaceholderStyle = css`
	color: rgba(255, 255, 255, 0.5);
	gap: 40rem;
`;

export default Dashboard;

