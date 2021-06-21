import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";

function ProjectDashboard() {
	return null;
}

ProjectDashboard.getInitialProps = async ({
    res
}) => {
	await redirectToFrontendPath("/app/project/dashboard", res);
	return {};
};
export default withSession(ProjectDashboard);
