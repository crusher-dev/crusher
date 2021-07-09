import { redirectToFrontendPath } from "@utils/router";

function Dashboard() {
	return null;
}

Dashboard.getInitialProps = async ({ res }: any) => {
	await redirectToFrontendPath("/app/project/dashboard", res);
	return {};
};

export default Dashboard;
