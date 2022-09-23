import { css } from "@emotion/react";
import React, { useMemo, useState } from "react";

import { contentContainer, contentContainerScroll, SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../src/hooks/seo";
import { useAtom } from "jotai";
import Input from "dyson/src/components/atoms/input/Input";
import { Button } from "dyson/src/components/atoms";
import { Dolphin } from "@ui/containers/dashboard/icont";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { projectsAtom } from "@store/atoms/global/project";
import Link from "next/link";
import { Conditional } from "dyson/src/components/layouts";
import { appStateItemMutator } from "@store/atoms/global/appState";
import { useRouter } from "next/router";
import { getIdentifier } from "@utils/routing";

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

function CloseIcon(props) {
	return (
		<svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9 1.688a7.312 7.312 0 100 14.624A7.312 7.312 0 009 1.687zM7.71 6.915a.563.563 0 10-.795.795L8.205 9l-1.29 1.29a.563.563 0 10.795.795L9 9.795l1.29 1.29a.561.561 0 10.795-.795L9.795 9l1.29-1.29a.561.561 0 10-.795-.795L9 8.205l-1.29-1.29z"
				fill="#B5B5B5"
			/>
		</svg>
	);
}

const closeHover = css`
	path {
		fill: white;
	}
`;

export default function Dashboard() {
	usePageTitle("Dashboard");

	const [projects] = useAtom(projectsAtom);
	const [searchProject, setSearchProject] = useState("");

	const onSearchChange = (e) => {
		setSearchProject(e.target.value);
	};

	const filteredProject = useMemo(() => {
		if (searchProject.length === 0) return projects;
		return projects.filter(({ name }) => name.includes(searchProject));
	}, [searchProject]);

	return (
		<SidebarTopBarLayout>
			<div css={[containerStyle, contentContainer]} className=" pt-36 ">
				<div className="flex items-center">
					<Input
						rightIcon={
							<Conditional showIf={searchProject.length > 0}>
								<CloseIcon
									css={closeHover}
									onClick={() => {
										setSearchProject("");
									}}
								/>
							</Conditional>
						}
						css={newInputBoxCSS}
						value={searchProject}
						onChange={onSearchChange.bind(this)}
						size={"medium"}
						placeholder={"Search projects"}
					></Input>
					<Link href="/new-project">
						<Button css={buttonCss} size="big-medium" className="ml-12">
							+ new project
						</Button>
					</Link>
				</div>
				<div className="flex mt-36 flex-wrap" css={projectItemContainer}>
					{filteredProject.map((project) => (
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
	grid-template-columns: 1fr 1fr 1fr;
`;

const projectItem = css`
	width: 100%;
	height: 124rem;

	border: 0.5px solid #1b1b1b;
	border: 0.5px solid #252525;
	border-radius: 14px;
	
	transition: all 0ms ease;

	.open {
		visibility: hidden;
		width: 46px;
		height: 25px;

		background: #212121;
		border-radius: 7px;
		font-size: 12px;
	}
	:hover {
		.open {
			visibility: visible;
		}
		border-color: #aa46ff;
		//background: #c076ff0a;
		background: #832ccc0a;
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
		background: transparent !important;
		color: #cecece;
		border: 0.5px solid #cecece !important;
	}

	:focus {
		outline: 1px solid #ae47ff;
	}
`;

const containerStyle = css`
	color: #fff !important;
`;



function ProjectCard({ project }) {
	const { id, name } = project;
	const router = useRouter();
	const [_, setAppStateItem] = useAtom(appStateItemMutator);

	const selectProject = () => {
		const getAlias = getIdentifier(name, id)
		router.push(`/${getAlias}/dashboard`);
		setAppStateItem({ key: "selectedProjectId", value: id });
	}
	return (

		<div css={projectItem} onClick={selectProject.bind(this)} className={"flex flex-col justify-between pr-16 pl-20 pt-16 pb-22"}>
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Dolphin height={20} width={20} />
						<TextBlock fontSize={15} color="#B6B6B6" weight="600" className="ml-10">
							{name}
						</TextBlock>
					</div>
					<div className="open flex items-center justify-center">Open</div>
				</div>

				<TextBlock fontSize={12.6} color="#4a4a4a" className="mt-11">
					Add github action
				</TextBlock>
			</div>
			<div className="flex items-center">
				<GitIcon className="mr-8" /> git not linked
			</div>
		</div>

	);
}
