import { redirectToFrontendPath } from "@utils/router";
import { getCookies } from "@utils/cookies";
import { serialize } from "cookie";

const handleClIToken = (ctx) => {
	const {
		query: { cli_token },
		res,
	} = ctx;
	if (cli_token) {
		res.setHeader(
			"Set-Cookie",
			serialize("cli_token", cli_token, { path: "/", maxAge: 90000 }),
		);
	}
};

function WithoutSession(Component) {
	const WrappedComponent = function (props) {
		return <Component {...props} />;
	};

	WrappedComponent.getInitialProps = async (ctx) => {
		const { req, res } = ctx;
		const cookies = getCookies(req);
		handleClIToken(ctx);

		const isLoggedIn = cookies.isLoggedIn;

		if (isLoggedIn === "true" || cookies.token) {
			await redirectToFrontendPath("/app/project/dashboard", res);
		}

		const pageProps =
			Component.getInitialProps && (await Component.getInitialProps(ctx));

		if (!pageProps) {
			return {};
		}

		return { ...pageProps };
	};

	return WrappedComponent;
}

export default WithoutSession;
