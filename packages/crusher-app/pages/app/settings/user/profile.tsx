import React from "react";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { getAllSlackIntegrationsForProject } from "@services/alerting";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";

const Profile = () => {
	return <div>Hello</div>;
};

Profile.getInitialProps = async (ctx: any) => {
	const { req, res } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}
		const cookies = getCookies(req);

		const selectedProject = cookies.selectedProject
			? JSON.parse(cookies.selectedProject)
			: null;

		const slackIntegrations = await getAllSlackIntegrationsForProject(
			selectedProject,
			headers,
		);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
			slackIntegrations: slackIntegrations,
		};
	} catch (ex) {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(Profile));
