import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React from "react";

import { useAtom } from "jotai";

import { USER_META_KEYS } from "@constants/USER";
import { appStateItemMutator } from "@store/atoms/global/appState";
import { projectsAtom } from "@store/atoms/global/project";
import { updateMeta } from "@store/mutators/metaData";

const ProjectList = ({ className, projects }) => {
	const [, updateOnboarding] = useAtom(updateMeta);
	const [, setAppStateItem] = useAtom(appStateItemMutator);
	const router = useRouter();

	const handleProjectItemClick = React.useCallback((projectId) => {
		updateOnboarding({
			type: "user",
			values: [
				{ key: USER_META_KEYS.SELECTED_PROJECT_ID, value: projectId},
				{key: USER_META_KEYS.INITIAL_ONBOARDING, value: true}
			],
			callback: () => {
				setAppStateItem({ key: "selectedProjectId", value: projectId });
				router.push("/projects");
			}
		});
	}, []);

	const projectItems = React.useMemo(() => {
		return projects.map((project, index) => {
			return (
				<li key={index} css={listItemCss} onClick={handleProjectItemClick.bind(this, project.id)}>
					<div css={itemHeadingCss}>{project.name}</div>
					<div css={itemDescriptionCss}>with recorder you can create and run test</div>
				</li>
			);
		});
	}, [projects]);

	return (
		<ul css={ulListCss} className={String(className)}>
			{projectItems}
		</ul>
	);
};

const itemHeadingCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 500;
	font-size: 16rem;

	color: #ffffff;
`;

const itemDescriptionCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.35);
	margin-top: 4rem;
`;
const ulListCss = css`
	background: rgba(217, 217, 217, 0.03);
	border-radius: 12px;

	li:not(:first-child) {
		border-top-color: rgba(217, 217, 217, 0.1);
		border-top-style: solid;
		border-top-width: 0.5px;
	}
`;

const listItemCss = css`
	padding: 14rem 24rem;
	:hover {
		opacity: 0.8;
	}
`;

const SelectProjectContainer = () => {
	const mainRef = React.useRef(null);
	const [projects] = useAtom(projectsAtom);

	const projectsArr = React.useMemo(() => {
		return projects.map((project) => ({
			id: project.id,
			name: project.name,
		}));
	}, [projects]);

	return (
		<div className="flex mt-60 flex-col">
			<div ref={mainRef} css={[contentCss]}>
				<div css={mainContainerCss}>
					<div css={titleContainerCss}>
						<div css={headingCss}>Select project</div>
						<div css={titleTaglineCss}>We found some existing projects</div>
					</div>

					<div css={downloadButtonContainerCss}>
						<div css={downloadButtonCss}>
							new
							<AddIcon css={addIconCss} />
						</div>
					</div>
				</div>

				<div css={listCss}>
					<div css={projectHeadingTextCss}>Projects (01/10)</div>
					<ProjectList css={projectListContainerCss} projects={projectsArr} />
				</div>
			</div>
		</div>
	);
};

const listCss = css`
	margin-top: 48rem;
`;

const projectHeadingTextCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;

	color: rgba(255, 255, 255, 0.54);
`;

const projectListContainerCss = css`
	margin-top: 22rem;
`;

const AddIcon = (props) => (
	<svg viewBox={"0 0 13 13"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.15 4.55a.65.65 0 0 0-1.3 0v1.3h-1.3a.65.65 0 1 0 0 1.3h1.3v1.3a.65.65 0 1 0 1.3 0v-1.3h1.3a.65.65 0 1 0 0-1.3h-1.3v-1.3ZM3.413.252C4.257.064 5.28 0 6.5 0c1.22 0 2.243.064 3.087.252.852.19 1.56.512 2.104 1.057.545.544.868 1.252 1.057 2.104.188.844.252 1.868.252 3.087 0 1.22-.065 2.243-.252 3.087-.19.852-.512 1.56-1.057 2.104-.544.545-1.252.868-2.104 1.057C8.743 12.936 7.72 13 6.5 13c-1.22 0-2.243-.065-3.087-.252-.852-.19-1.56-.512-2.104-1.057C.764 11.147.44 10.44.252 9.587.064 8.743 0 7.72 0 6.5c0-1.22.064-2.243.252-3.087.19-.852.512-1.56 1.057-2.104C1.853.764 2.56.44 3.413.252Z"
			fill="#fff"
		/>
	</svg>
);

const addIconCss = css`
	width: 13rem;
`;

const downloadButtonCss = css`
	background: linear-gradient(0deg, #9651ef, #9651ef), linear-gradient(0deg, #8c45e8, #8c45e8), #cd60ff;
	border: 0.5px solid rgba(169, 84, 255, 0.4);
	border-radius: 8px;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;
	text-align: center;

	color: #ffffff;
	display: flex;
	gap: 10rem;
	padding: 8rem 10rem;
	:hover {
		opacity: 0.8;
	}
`;

const mainContainerCss = css`
	display: flex;
	align-items: center;
`;
const downloadButtonContainerCss = css`
	margin-left: auto;
`;
const titleContainerCss = css`
	display: flex;
	flex-direction: column;
`;

const titleTaglineCss = css`
	margin-top: 6rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	letter-spacing: 0.03em;

	color: rgba(255, 255, 255, 0.35);
`;

const headingCss = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 500;
	font-size: 18rem;
	/* identical to box height */
	color: #ffffff;
`;
const contentCss = css`
	margin-top: 20px;
	width: 100%;
	padding-top: 34px;
	transition: height 0.3s;
	overflow: hidden;
`;

export { SelectProjectContainer };
