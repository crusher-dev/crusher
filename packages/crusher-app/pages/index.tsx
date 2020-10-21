import Head from "next/head";
import Link from "next/link";
import { css } from "@emotion/core";
import { serialize } from "cookie";
import React, { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { resolvePathToBackendURI } from "@utils/url";
import WithoutSession from "@hoc/withoutSession";
import { USER_NOT_REGISTERED } from "@utils/constants";
import { authenticateUser } from "@services/user";
import {
	EMAIL_NOT_VERIFIED,
	NO_TEAM_JOINED,
	SIGNED_IN,
} from "@utils/constants";
import { redirectToFrontendPath } from "@utils/router";
import { AuthenticationDarkTemplate } from "@ui/template/authenticationDark";
import { GoogleIcon } from "@components/SVGs";

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

function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleLogin = () => {
		if (!isEmail(email)) {
			alert("Please enter a valid email");
			return;
		}

		if (!password || password.length < 1) {
			alert("Please enter password");
			return;
		}

		authenticateUser(email, password).then((res) => {
			const { status } = res;
			switch (status) {
				case NO_TEAM_JOINED:
					return redirectToFrontendPath("/onboarding");
					break;
				case EMAIL_NOT_VERIFIED:
					return redirectToFrontendPath("/verification");
					break;
				case SIGNED_IN:
					return redirectToFrontendPath("/app/dashboard");
					break;
				case USER_NOT_REGISTERED:
					alert("Wrong email or password");
					break;
				default:
					break;
			}
		});
	};

	function handleInputFormkeyDown(event) {
		if (event.keyCode === 13) {
			handleLogin();
		}
	}

	return (
		<div>
			<Head>
				<title>Login | Crusher</title>
			</Head>

			<AuthenticationDarkTemplate>
				<div css={styles.form}>
					<div css={styles.headingContainer}>
						<div css={styles.formHeading}>Sign In</div>
					</div>

					<div css={styles.emailPassContainer}>
						<form>
							<input
								css={[styles.emailInput, styles.inputElement]}
								placeholder={"Email"}
								onKeyDown={handleInputFormkeyDown}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								value={email}
								type="email"
								name={"email"}
								autoComplete={"on"}
							/>
							<input
								css={[styles.passwordInput, styles.inputElement]}
								onKeyDown={handleInputFormkeyDown}
								onChange={(event) => {
									setPassword(event.target.value);
								}}
								autoComplete={"current-password"}
								placeholder={"Password"}
								type="password"
							/>
						</form>
					</div>
					<div css={styles.requestButton} onClick={handleLogin}>
						Signin
					</div>
					<a href={resolvePathToBackendURI("/user/authenticate/google")}>
						<div css={styles.googleLoginButton}>
							<GoogleIcon width={"1.5rem"} height={"1.44rem"} />
							<span>Login with Google</span>
						</div>
					</a>
				</div>

				<div css={styles.accountCreationContainer}>
					<div css={styles.signupButton}>Or create your account</div>
					<Link href={"/signup"} prefetch>
						<a href={"/signup"} css={styles.registerButton}>
							Start no-code testing for free
						</a>
					</Link>
				</div>
			</AuthenticationDarkTemplate>
		</div>
	);
}

Home.getInitialProps = (ctx) => {
	handleClIToken(ctx);
	return {};
};

const styles = {
	form: css`
		width: 26rem;
		padding: 1.5rem 1.5rem;
		background: #ffffff;
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 12px;

		margin-bottom: 2rem;
	`,
	headingContainer: css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	`,
	formHeading: css`
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.6;
		color: #513879;
	`,
	forgotPassword: css`
		font-weight: normal;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #2b2b39;
		:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	`,
	emailPassContainer: css`
		margin-bottom: 1.65rem;
	`,
	emailInput: css`
		width: 100%;
		margin-bottom: 1.55rem;
	`,
	inputElement: css`
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;

		::placeholder {
			font-size: 1rem;
			line-height: 1rem;
			color: #afb2bb;
		}
	`,
	requestButton: css`
		padding: 1.05rem;
		background: #5b76f7;
		border: 1px solid #5b76f7;
		box-sizing: border-box;
		border-radius: 5px;
		color: #fff;

		display: flex;
		justify-content: center;

		font-weight: 500;
		font-size: 1.057rem;
		line-height: 1.3rem;

		cursor: pointer;

		margin-bottom: 2.75rem;
	`,
	googleLoginButton: css`
		display: flex;
		align-item: center;
		justify-content: space-between;

		border: 1px solid #e1e1e1;
		box-sizing: border-box;
		border-radius: 5px;
		width: 100%;
		padding: 1rem 1.75rem;
		margin-bottom: 1rem;
		font-size: 1rem;
		line-height: 1.375rem;
		font-weight: 500;
		color: #513879;

		cursor: pointer;
	`,
	accountCreationContainer: css`
		width: 26rem;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		flex-direction: column;
	`,
	signupButton: css`
		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: #ffffff;
	`,
	registerButton: css`
		display: flex;
		justify-content: center;
		width: 100%;
		background: #5b76f7;
		border-radius: 5px;
		font-size: 1.06rem;
		padding: 1.13rem;
		color: #fff;
		cursor: pointer;
		&:hover {
			color: #fff !important;
		}
	`,
	passwordInput: css`
		width: 100%;
	`,
};

export default WithoutSession(Home);
