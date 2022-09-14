import { css } from "@emotion/react";
import React, { useMemo } from "react";

import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";
import { Conditional } from "dyson/src/components/layouts";
import { useAtom } from "jotai";
import { currentProjectSelector } from "../../src/store/selectors/getCurrentProject";
import { userAtom } from "../../src/store/atoms/global/user";
import { getOnboardingStepIndex } from "@utils/core/dashboard/onboardingUtils";
import Input from "dyson/src/components/atoms/input/Input";
import { Button } from "dyson/src/components/atoms";
import { Dolphin } from "@ui/containers/dashboard/icont";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { projectsAtom } from "@store/atoms/global/project";
import Link from "next/link";

function GitIcon(props) {
	return (
		<svg width={15} height={15} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.938.29C4.912.075 6.093 0 7.5 0s2.588.074 3.562.29c.983.22 1.8.592 2.428 1.22.628.628 1 1.445 1.22 2.428.216.974.29 2.155.29 3.562s-.074 2.588-.29 3.562c-.22.983-.592 1.8-1.22 2.428-.628.628-1.445 1-2.428 1.22-.974.216-2.155.29-3.562.29s-2.588-.074-3.562-.29c-.983-.22-1.8-.592-2.428-1.22-.628-.628-1-1.445-1.22-2.428C.075 10.088 0 8.907 0 7.5s.074-2.588.29-3.562c.22-.983.592-1.8 1.22-2.428.628-.628 1.445-1 2.428-1.22zm.21 3.523h.002l.002-.001.004-.001.007-.003.016-.005a.871.871 0 01.117-.03c.358-.07.956-.008 1.819.577a5 5 0 01.065.045l.088-.021a5.552 5.552 0 012.552.02l.065-.044c.86-.583 1.455-.647 1.814-.578a1.012 1.012 0 01.12.031l.016.006.007.002.004.002h.002l.002.001a.75.75 0 01.455.485 3.596 3.596 0 01.15 1.87l.064.109c.323.563.489 1.219.48 1.883 0 1.432-.377 2.452-1.07 3.129-.678.662-1.541.877-2.256.963-.791.133-1.557.14-2.35.021l-.023-.003c-.711-.096-1.568-.322-2.24-.988-.684-.68-1.059-1.696-1.06-3.122a3.71 3.71 0 01.545-1.991 3.61 3.61 0 01.163-1.916.75.75 0 01.44-.44z"
				fill="#FF3E9A"
			/>
		</svg>
	);
}

function Dashboard() {
	usePageTitle("Dashboard");

	const [projects] = useAtom(projectsAtom);
	const [project] = useAtom(currentProjectSelector);
	const [user] = useAtom(userAtom);

	const onboardingIndex = useMemo(() => {
		return getOnboardingStepIndex(project, user);
	}, [project, user]);

	console.log(projects);

	return (
		<SidebarTopBarLayout>
			<div css={containerStyle} className=" pt-36 ">
				<div className="flex items-center">
					<Input css={newInputBoxCSS} size={"medium"} placeholder={"Search project"}></Input>
					<Button css={buttonCss} size="big-medium" className="ml-12">
						+ new project
					</Button>
				</div>
				<div className="flex mt-36 flex-wrap" css={projectItemContainer}>
					{projects.map((project) => (
						<ProjectCard project={project} key={project?.id} />
					))}
				</div>
			</div>
		</SidebarTopBarLayout>
	);
}

const projectItemContainer = css`
	display: grid;
	column-gap: 28px;
	row-gap: 28px;
	grid-template-columns: auto auto auto;
`;

const projectItem = css`
	width: 100%;
	height: 132rem;
	width: 360rem;

	border: 0.5px solid #1b1b1b;
	border-radius: 14px;

	.open {
		visibility: hidden;
		width: 46px;
		height: 25px;

		background: #212121;
		border-radius: 7px;
	}
	:hover {
		.open {
			visibility: visible;
		}
		background: rgba(23, 23, 23, 0.42);
	}
`;

export const newInputBoxCSS = css`
	flex: 1;

	input {
		background: transparent;
		border: 0.5px solid rgba(56, 56, 56, 0.6);
		border-radius: 10rem;
		font-weight: 500;
		:focus {
			// background: #121316;
			background: rgba(77, 77, 77, 0.05);
			border: 0.5px solid #dadada;
			border-color: #dadada;
		}
		::placeholder {
			color: #808080;
		}
		:hover {
			// box-shadow: 0px 0px 0px 3px rgba(28, 28, 28, 0.72);
		}

		height: 40rem;
		padding-top: 2rem;
	}

	@-webkit-keyframes autofill {
		0%,
		100% {
			color: #666;
			background: transparent;
		}
	}

	input:-webkit-autofill {
		-webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
		-webkit-animation-name: autofill;
		-webkit-animation-fill-mode: both;
	}
`;

const buttonCss = css`
	width: 144rem;

	border-radius: 10rem;

	background: #cecece;
	color: #202020;
	border-color: transparent !important;

	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0) !important;

	:hover {
		background: #fff !important;
		color: #202020;
	}

	:focus {
		outline: 1px solid #ae47ff;
	}
`;

const containerStyle = css`
	color: #fff !important;
`;

export default Dashboard;
function ProjectCard({ project }) {
	const { id, name } = project;
	return (
		<Link href="/app/dashboard">
			<div css={projectItem} className={"flex flex-col justify-between pr-18 pl-24 pt-16 pb-22"}>
				<div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Dolphin height={20} width={20} />
							<TextBlock fontSize={17} color="#B6B6B6" weight="600" className="ml-10">
								{name}
							</TextBlock>
						</div>
						<div className="open flex items-center justify-center">Open</div>
					</div>

					<TextBlock fontSize={12.6} color="#B6B6B6" className="mt-11">
						Add github action
					</TextBlock>
				</div>
				<div className="flex items-center">
					<GitIcon className="mr-8" /> git not linked
				</div>
			</div>
		</Link>
	);
}
