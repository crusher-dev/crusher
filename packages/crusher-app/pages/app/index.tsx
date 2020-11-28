import { redirectToFrontendPath } from "@utils/router";

function AppIndex() {
	return null;
}

AppIndex.getInitialProps = async ({ res }: any) => {
	await redirectToFrontendPath("/app/dashboard", res);
	return {};
};
export default AppIndex;
