import React from "react";

import { cleanHeaders } from "@utils/backendRequest";
import { getAllSlackIntegrationsForProject } from "@services/alerting";
import { getCookies } from "@utils/cookies";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { Accordion, AccordionTab } from "@ui/components/accordion";

interface iItemsListProps {
	items: { title: string; date: string }[];
}
const ItemsList = (props: iItemsListProps) => {
	const { items } = props;

	const listOut = items.map((item, index) => {
		const { title, date } = item;
		return (
			<li key={index}>
				<div css={repositoryNameCSS}>{title}</div>
				<div css={repositoryDateCSS}>{date}</div>
			</li>
		);
	});

	return <ul css={listCSS}>{listOut}</ul>;
};

const DUMMY_REPOSITORIES = [
	{ title: "Next-Deimos", date: "March 2020" },
	{ title: "Proteus", date: "Jan 2019" },
	{ title: "Absolut", date: "Feb 2020" },
];

const DUMMY_INTEGRATIONS = [
	{ title: "Atlassian", date: "March 2020" },
	{ title: "Jira", date: "Jan 2019" },
	{ title: "Linear", date: "Feb 2020" },
];

const DUMMY_ALERTING = [
	{ title: "Slack", date: "March 2020" },
	{ title: "Email", date: "Jan 2019" },
	{ title: "Message", date: "Feb 2020" },
	{ title: "Call", date: "April 2020" },
];

const ProjectIntegrationSettings = () => {
	return (
		<SettingsContent contentCSS={settingContentCSS}>
			<SettingsContentHeader title={"Integration"} desc={"Integrate crusher in CI Pipelines, community channel and emails"} />
			<div css={mainContainerCSS}>
				<Accordion>
					<AccordionTab title={"Repositories"}>
						<div css={accordionContentCSS}>
							<ItemsList items={DUMMY_REPOSITORIES} />
							<div css={addRepoContainerCSS}>
								<a href={"https://github.com/invite/test"} rel="noreferrer" target={"_blank"}>
									Add a repo source
								</a>
								<span>from github, gitlab, etc</span>
							</div>
						</div>
					</AccordionTab>
					<AccordionTab title={"Integration"}>
						<div css={accordionContentCSS}>
							<ItemsList items={DUMMY_INTEGRATIONS} />
						</div>
					</AccordionTab>
					<AccordionTab title={"Alerting & Notification"}>
						<div css={accordionContentCSS}>
							<ItemsList items={DUMMY_ALERTING} />
						</div>
					</AccordionTab>
				</Accordion>
			</div>
		</SettingsContent>
	);
};

const settingContentCSS = css`
	width: ${490 / PIXEL_REM_RATIO}rem;
`;

const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
`;

const listCSS = css`
	li {
		display: flex;
		&:not(:first-child) {
			margin-top: ${25 / PIXEL_REM_RATIO}rem;
		}
	}
`;

const accordionContentCSS = css`
	padding: ${22 / PIXEL_REM_RATIO}rem ${35 / PIXEL_REM_RATIO}rem;
	padding-bottom: ${20 / PIXEL_REM_RATIO}rem;
`;

const repositoryNameCSS = css`
	font-family: Gilroy;
	font-weight: 500;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	color: #404040;
`;
const repositoryDateCSS = css`
	margin-left: auto;
	font-family: Gilroy;
	font-size: ${13 / PIXEL_REM_RATIO}rem;
	font-weight: 500;
	color: #636363;
`;
const addRepoContainerCSS = css`
	font-family: Gilroy;
	margin-top: ${30 / PIXEL_REM_RATIO}rem;
	a {
		font-weight: 700;
		font-size: ${17 / PIXEL_REM_RATIO}rem;
		text-decoration-line: underline;
		color: #0f0f0f;
	}
	span {
		margin-left: ${16 / PIXEL_REM_RATIO}rem;
		font-size: ${14 / PIXEL_REM_RATIO}rem;
		color: #636363;
		font-weight: 500;
	}
`;

ProjectIntegrationSettings.getInitialProps = async (ctx: any) => {
	const {
        req
    } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}
		const cookies = getCookies(req);

		const selectedProject = cookies.selectedProject ? JSON.parse(cookies.selectedProject) : null;

		const slackIntegrations = await getAllSlackIntegrationsForProject(selectedProject, headers);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
			slackIntegrations: slackIntegrations,
		};
	} catch (ex) {
        throw ex;
    }
};

export default withSession(WithSettingsLayout(ProjectIntegrationSettings));
