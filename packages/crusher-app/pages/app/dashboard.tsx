import React from "react";
import { redirectToFrontendPath } from "@utils/router";

function Dashboard(props) {
	return null;
}

Dashboard.getInitialProps = async ({ req, res }) => {
	await redirectToFrontendPath("/app/project/dashboard", res);
	return {};
};

export default Dashboard;
