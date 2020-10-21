import Head from "next/head";
import { useState } from "react";
import { resolvePathToBackendURI } from "@utils/url";
import WithoutSession from "@hoc/withoutSession";
import { USER_ALREADY_REGISTERED, USER_REGISTERED } from "@utils/constants";
import { registerUser } from "@services/user";
import { redirectToFrontendPath } from "@utils/router";
import isEmail from "validator/lib/isEmail";
import { AuthenticationDarkTemplate } from "@ui/template/authenticationDark";
import { css } from "@emotion/core";
import { BackSVG, GoogleIcon } from "@components/SVGs";
import Link from "next/link";

function Home() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSignUp = () => {
		const nameArr = name.split(" ");
		const firstName = nameArr[0] ? nameArr[0] : "";
		const lastName = nameArr[1] ? nameArr[1] : "";
		registerUser(firstName, lastName, email, password).then((res) => {
			const { status } = res;

			if (!isEmail(email)) {
				alert("Please enter a valid email");
				return;
			}

			if (!password || password.length < 1) {
				alert("Please enter password");
				return;
			}

			if (firstName.length < 1) {
				alert("Please enter your first name");
				return;
			}

			switch (status) {
				case USER_REGISTERED:
					return redirectToFrontendPath("/app/dashboard");
					break;
				case USER_ALREADY_REGISTERED:
					alert("An account with this email has already been registered");
					break;
				default:
					break;
			}
		});
	};

	function handleKeyDown(event) {
		if (event.keyCode === 13) {
			handleSignUp();
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
						<div css={styles.formHeading}>Create account</div>
					</div>

					<form>
						<div css={styles.emailPassContainer}>
							<input
								css={[styles.emailInput, styles.inputElement]}
								placeholder={"Your name"}
								onKeyDown={handleKeyDown}
								onChange={(event) => {
									setName(event.target.value);
								}}
								value={name}
								name={"name"}
								type="text"
								autoComplete={"on"}
							/>
							<input
								css={[styles.passwordInput, styles.inputElement]}
								onKeyDown={handleKeyDown}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								placeholder={"Email"}
								type="email"
								name={"email"}
								autoComplete={"on"}
							/>
							<input
								css={[styles.passwordInput, styles.inputElement]}
								onKeyDown={handleKeyDown}
								onChange={(event) => {
									setPassword(event.target.value);
								}}
								placeholder={"A strong password"}
								type="password"
								name={"password"}
								autoComplete={"on"}
							/>
						</div>
					</form>
					<div css={styles.requestButton} onClick={handleSignUp}>
						Create account
					</div>
					<a href={resolvePathToBackendURI("/user/authenticate/google")}>
						<div css={styles.googleLoginButton}>
							<GoogleIcon width={"1.5rem"} height={"1.44rem"} />
							<span>Authenticate with Google</span>
						</div>
					</a>
				</div>

				<div css={styles.accountCreationContainer}>
					<Link href={"/"} prefetch>
						<a css={styles.LoginButton}>
							<BackSVG
								fill="#FFFFFF"
								height={"1.5rem"}
								style={{ marginRight: "1rem" }}
							/>
							Already have an account?
						</a>
					</Link>
				</div>
			</AuthenticationDarkTemplate>
		</div>
	);
}

Home.getInitialProps = (ctx) => {
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
	`,
	inputElement: css`
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;
		&:not(:first-child) {
			margin-top: 1.55rem;
		}
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
		color: #fff;
		text-decoration: underline;
	`,
	LoginButton: css`
		display: flex;

		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: #ffffff;
		line-height: 1.6rem;
		&:hover {
			color: #fff !important;
		}
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
	`,
	passwordInput: css`
		width: 100%;
	`,
};

export default WithoutSession(Home);
