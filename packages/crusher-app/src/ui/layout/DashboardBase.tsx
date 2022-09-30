import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { useProjectDetails } from "@hooks/common";
import { BackSVG, CorrentSVG } from "@svg/builds";
import { External, PlayIcon, PlusCircle } from "@svg/dashboard";
import { ShowSidebar } from "@svg/onboarding";
import Download from "@ui/containers/dashboard/Download";
import { buildContainerWidth } from "@ui/containers/testReport/testReportScreen";
import { handleTestRun } from "@utils/core/testUtils";

import { projectsAtom } from "../../store/atoms/global/project";
import { buildFiltersAtom } from "../../store/atoms/pages/buildPage";
import { updateMeta } from "../../store/mutators/metaData";
import { LeftSection } from "./LeftSection";

export const iconCSS = css`
	width: 16rem;
	height: 16rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const selectedCSS = css`
	background: rgba(255, 255, 255, 0.04);
	border: 0.5px solid rgba(255, 255, 255, 0.08);

	.label,
	span {
		color: #b960ff;
	}

	path {
		fill: #b960ff;
	}
`;

export const dropDown = css`
	bottom: -10px;
	left: calc(100% - 4px);
	position: absolute;
	width: 206.03px;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4);
	padding: 8rem 0;
	z-index: 1;
`;

function CreateTest() {
	const [showCreateTest, setShowCreateTest] = useState(false);

	const runProjectTest = useCallback(() => {
		setShowCreateTest(true);
	}, []);

	return (
		<React.Fragment>
			<Conditional showIf={showCreateTest}>
				<Download onClose={setShowCreateTest.bind(this, false)} />
			</Conditional>
			<Button title="Create a new test" bgColor={"tertiary"} onClick={runProjectTest} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<PlusCircle className={"mr-6"} />
					<span className="mt-1">new test</span>
				</div>
			</Button>
		</React.Fragment>
	);
}

function RunTest() {
	const router = useRouter();
	const { currentProject } = useProjectDetails();
	const { query } = router;
	const [filters] = useAtom(buildFiltersAtom);
	const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			await handleTestRun(currentProject?.id, query, filters, router, updateMetaData);

			updateMetaData({
				type: "user",
				key: USER_META_KEYS.RAN_TEST,
				value: true,
			});

			updateMetaData({
				type: "project",
				key: PROJECT_META_KEYS.RAN_TEST,
				value: true,
			});
		})();
	}, []);

	return (
		<Button title="Run test in this project" bgColor={"tertiary"} onClick={runProjectTest} css={runTestCSS}>
			<div className={"flex items-center"}>
				<PlayIcon className={"mr-6"} />
				<span className="mt-2">Run tests</span>
			</div>
		</Button>
	);
}

const runTestCSS = css`
	padding: 0 10rem;
	height: 30rpx;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #a742f7;
	border: 1px solid #7d41ad;
	border-radius: 8px;

	:hover {
		background: #a742f7;
		filter: brighntess(0.7);
		border: 1px solid #7d41ad;
	}
`;

const creatTestCSS = css`
	padding: 0 10rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #0d0d0d;
	border: 0.5px solid rgba(219, 222, 255, 0.16);
	border-radius: 8px;

	:hover {
		background: #313131;
		filter: brighntess(0.8);
	}
`;

function TopNavbar({ children }) {
	const { currentProject } = useProjectDetails();
	const isCurrentProject = !!currentProject;
	const { asPath } = useRouter();

	const isBuildReport = isCurrentProject && asPath.includes("build/");
	return (
		<div css={[nav]}>
			<div css={[containerWidth, isBuildReport && buildContainerWidth, contentContainer]}>{children}</div>
		</div>
	);
}

function NavbarLeft() {
	const { currentProject } = useProjectDetails();
	const [projects] = useAtom(projectsAtom);
	const isCurrentProject = !!currentProject;
	const { asPath, query } = useRouter();

	const isBuildReport = isCurrentProject && asPath.includes("build/");
	if (isBuildReport) {
		return (
			<div css={reportLabel} className={"flex items-center w-full"}>
				<Link href={`/projects`}>
					<div className="flex items-center">
						<BackSVG height={12} width={12} className="mr-8" />
						<span css={projectIcon}>projects</span>
					</div>
				</Link>
				<Link href={`/${currentProject?.id}/builds`}>
					<div className="flex items-center">
						<span className="ml-1 mr-1">/ </span> <span css={projectIcon}>{currentProject.name}</span>
					</div>
				</Link>
				<div className="flex items-center">
					<span className="ml-1 mr-1">/ </span> <span css={projectIcon}># {query.id}</span>
				</div>
				<CorrentSVG className="ml-8" height={18} width={18} />
			</div>
		);
	}
	if (isCurrentProject) {
		return (
			<div css={projectsLabel} className={"flex items-center w-full"}>
				<Link href="/projects">
					<span css={projectIcon}>projects</span>
				</Link>
				<span>/ {currentProject.name}</span>
			</div>
		);
	}
	return (
		<div css={projectsLabel} className={"flex items-center w-full"}>
			<span>projects</span>
			<span className="badge flex items-center justify-center pt-1 ml-8">{projects.length}</span>
		</div>
	);
}

const projectIcon = css`
	font-size: 13rex;
	margin-right: 3px;
	:hover {
		text-decoration: underline;
		color: #fff;
		transition: all 0ms linear;
	}
`;

const sidebarIconCSS = css`
	position: absolute;
	top: 18px;
	left: 20px;
	cursor: pointer;
	z-index: 20;
	/* padding: 8px 12px; */
	height: 20px;
	width: 20px;
	display: flex;
	align-items: center;
	justify-content: center;

	border-radius: 6px;
	:hover {
		background: #323232;
	}
`;

export const SidebarTopBarLayout = ({ children, noContainerWidth = false, hideSidebar = false, setContainerWidth = true }): JSX.Element => {
	const [showSidebar, setShowSidebar] = useState(hideSidebar);
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!showSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full relative"} id="right-section">
				<TopNavbar>
					<Conditional showIf={showSidebar}>
						<div css={sidebarIconCSS} onClick={setShowSidebar.bind(this, !showSidebar)}>
							<ShowSidebar />
						</div>
					</Conditional>

					<div className="flex items-center h-full">
						<NavbarLeft />
						<NavbarRight />
					</div>
				</TopNavbar>
				<div css={[scrollContainer, noContainerWidth ? noContainerWidthCSS : null]} className={"custom-scroll relative"}>
					<div css={[!noContainerWidth ? setContainerWidth && containerWidth : null]}>{children}</div>
				</div>
			</div>
		</div>
	);
};

const noContainerWidthCSS = css`
	overflow-y: overlay;
`;
const textLink = css`
	:hover {
		color: #d378fe;
		path {
			fill: #d378fe;
		}
	}
`;

const projectsLabel = css`
	gap: 2rem;
	font-weight: 400;
	font-size: 13px;
	color: #6b6565;
	letter-spacing: 0.02em;

	height: 56rem;

	.badge {
		width: 32px;
		height: 20px;
		background: rgba(78, 78, 78, 0.06);
		border: 1px solid #c275ff;
		border-radius: 16px;
		font-weight: 500;
		color: #aaaaaa;
		font-size: 12.5rem;
	}
`;

const reportLabel = css`
	gap: 2rem;
	font-weight: 400;
	font-size: 14rem;
	color: #6b6565;
	letter-spacing: 0.06em;

	height: 56rem;
`;

const background = css`
	background: #080808;
	min-height: 100vh;
`;

const nav = css`
	width: 100%;
	border-bottom: 0.5px solid #1b1b1b;
	height: 56rem;
`;
const containerWidth = css`
	margin: 0 auto;
`;

export const contentContainer = css`
	max-width: 1280rem;
	width: calc(100vw - 352rem);
	margin: 0 auto;
`;

export const contentContainerScroll = css`
	width: 1280rem;
	max-width: calc(100vw - 328rem);
	padding-left: 20rem;
`;
const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh - 56rem);
`;
function NavbarRight(): JSX.Element {
	const { asPath } = useRouter();
	const { currentProject } = useProjectDetails();
	const isCurrentProject = !!currentProject;
	const isBuildReport = isCurrentProject && asPath.includes("build");
	return (
		<div className="flex items-center" css={rightNavbar}>
			<Conditional showIf={isCurrentProject}>
				<RunTest />
				<CreateTest />
			</Conditional>

			<Conditional showIf={!isBuildReport}>
				<a href="https://docs.crusher.dev" target="_blank">
					<TextBlock color={"#6b6565"} className={"flex ml-4"} css={textLink}>
						<External className="mr-8" />
						<span className="mt-1">Docs</span>
					</TextBlock>
				</a>
			</Conditional>
		</div>
	);
}

const rightNavbar = css`
	gap: 8px;
`;
