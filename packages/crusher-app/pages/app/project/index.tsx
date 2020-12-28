import React from "react";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";

function ProjectDashboard(props) {
	return null;
}

ProjectDashboard.getInitialProps = async ({ req, res }) => {
	await redirectToFrontendPath("/app/project/dashboard", res);
	return {};
};
export default withSession(ProjectDashboard);
