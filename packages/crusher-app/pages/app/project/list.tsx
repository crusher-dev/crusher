import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import WithSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import { getAllTestsInfosInProject } from "@services/test";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { cleanHeaders } from "@utils/backendRequest";
import { useSelector } from "react-redux";
import { AddProject } from "@ui/components/app/addProject";
import Chrome from "../../../public/svg/project/chrome.svg";

function ProjectItem({ name, id, team_id }) {
	return (
		<div css={projectCard}>
			<Chrome css={icon} />

			<div css={projectContent}>
				<div css={projectName}>{name}</div>
				<div css={projectMeta}>
					<div css={projectTest}>12 test</div>
					<div css={addProjectTest}>Add test</div>
				</div>
			</div>
			<div css={projectRightSection}>
				<div css={projectCreatedOn}>Create on 26/12/2020</div>
				<div css={projectDeleteButton}>Delete</div>
			</div>
		</div>
	);
}

function HeaderComponent() {
	return (
		<div css={headingBlock}>
			<div>
				<div css={heading}>Projects</div>
				<div css={headingText}>List of projects in your workspace</div>
			</div>
			<div>
				<AddProject label={"Add Project"} />
			</div>
		</div>
	);
}

function ProjectTestsList(props) {
	const projects = useSelector(getProjects);

	return (
		<div css={container}>
			<div css={innerContainer}>
				<HeaderComponent />
				<div css={projectCardsContainer}>
					{projects.map((project) => (
						<ProjectItem {...project} />
					))}
				</div>
			</div>
		</div>
	);
}

const projectCardsContainer = css`
	margin-top: 2.25rem;
`;
const heading = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.5rem;
	line-height: 1.5rem;
	color: #2b2b39;
`;
const headingText = css`
	margin-top: 0.6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 500;
	font-size: 1.075rem;
	color: #2b2b39;
`;
const headingBlock = css`
	display: flex;
	justify-content: space-between;
	align-items: start;
`;

const container = css`
	margin: 0 auto;
	display: flex;
	justify-content: center;
`;
const innerContainer = css`
	padding: 3rem 0;
	width: 49rem;
`;

const projectCard = css`
	padding: 1.06rem 1.5rem;
	border: 1px solid #dddddd;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
	margin-bottom: 2.5rem;
`;
const icon = css`
	margin-right: 1.75rem;
`;
const projectContent = css``;
const projectName = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.4rem;
	line-height: 1.4rem;
	margin-bottom: 0.75rem;
`;
const projectMeta = css`
	display: flex;
	font-size: 1rem;
	color: #2b2b39;
`;

const projectTest = css`
	margin-right: 2rem;
`;

const addProjectTest = css`
	text-decoration: underline;
`;
const projectRightSection = css`
	margin-left: auto;
	flex-direction: column;
	display: flex;
	align-items: flex-end;
`;
const projectDeleteButton = css`
	color: #e43756;
	font-size: 0.86rem;
	font-weight: 600;
	margin-top: 1rem;
`;
const projectCreatedOn = css``;

ProjectTestsList.getInitialProps = async (ctx) => {
	const { res, req, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);
		const tests = await getAllTestsInfosInProject(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);
		return {
			tests: tests && Array.isArray(tests) ? tests : [],
		};
	} catch (er) {
		throw er;
		await redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSidebarLayout(ProjectTestsList));
