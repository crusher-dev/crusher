import React from "react";
import { redirectToFrontendPath } from "@utils/router";

function AppIndex(props) {
	return null;
}

AppIndex.getInitialProps = async ({ req, res }) => {
	await redirectToFrontendPath("/app/dashboard", res);
	return {};
};
export default AppIndex;
