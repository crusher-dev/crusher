import Head from "next/head";
import { useContext, useState } from "react";
import { resolvePathToBackendURI } from "@utils/url";
import withoutSession from "@hoc/withoutSession";
import { USER_ALREADY_REGISTERED, USER_REGISTERED } from "@utils/constants";
import { _registerUser } from "@services/user";
import { redirectToFrontendPath } from "@utils/router";
import isEmail from "validator/lib/isEmail";
import { AuthenticationTemplate } from "@ui/template/authenticationDark";
import { css } from "@emotion/core";
import { BackSVG, GoogleIcon } from "@ui/components/common/SVGs";
import Link from "next/link";
import { COLORS, ThemeContext } from "@constants/style";

function SignupScreen() {
	const theme = useContext(ThemeContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSignUp = () => {
		const nameArr = name.split(" ");
		const firstName = nameArr[0] ? nameArr[0] : "";
		const lastName = nameArr[1] ? nameArr[1] : "";
		_registerUser(firstName, lastName, email, password).then((res) => {
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
				<title>Get Started | Crusher</title>
			</Head>

			<AuthenticationTemplate>
				<div css={styles.form(theme)}>
					<div css={styles.headingContainer}>
						<div css={styles.formHeading(theme)}>Start 14 days free trial</div>
					</div>

					<form>
						<div css={styles.inputContainer}>
							<input
								css={[styles.phoneInput, styles.inputElement(theme)]}
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
								css={[styles.passwordInput, styles.inputElement(theme)]}
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
								css={[styles.passwordInput, styles.inputElement(theme)]}
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
					<div
						css={styles.requestButton}
						onClick={handleSignUp}
						className={"button"}
					>
						Next
					</div>
					<a href={resolvePathToBackendURI("/user/authenticate/google")}>
						<div css={styles.googleLoginButton(theme)}>
							<GoogleIcon width={"1.5rem"} height={"1.44rem"} />
							<span>Signup with Google</span>
						</div>
					</a>
				</div>

				<div css={styles.accountCreationContainer}>
					<Link href={"/"} prefetch>
						<a css={styles.LoginButton(theme)}>
							<BackSVG
								fill={theme === "dark" ? "#FFFFFF" : COLORS.dark1}
								height={"1.5rem"}
								style={{ marginRight: "1rem" }}
							/>
							Already registered? Login
						</a>
					</Link>
				</div>
			</AuthenticationTemplate>
		</div>
	);
}

SignupScreen.getInitialProps = (ctx) => {
	return {};
};

const styles = {
	form: (theme) => css`
		width: 26rem;
		padding: 1.5rem 1.5rem;

		border: 1px solid ${theme === "dark" ? "#2E3139" : "#d6ddff"};
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
	formHeading: (theme) => css`
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.6;
		color: ${theme === "dark" ? "#fff" : COLORS.dark1};
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
	inputContainer: css`
		margin-bottom: 1.65rem;
	`,
	phoneInput: css`
		width: 100%;
	`,
	inputElement: (theme) => css`
		border: 1px solid ${theme === "dark" ? "#15181E" : "#d6ddff"};
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;

		background: ${theme === "dark" ? "#15181E" : "#fff"};
		color: ${theme === "dark" ? "#B0B2BB" : "#15181E"};
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
		padding: 0.95rem;
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
	googleLoginButton: (theme) => css`
		display: flex;
		align-item: center;
		justify-content: space-between;

		box-sizing: border-box;
		border-radius: 5px;
		width: 100%;
		padding: 1rem 1.75rem;
		margin-bottom: 1rem;

		font-size: 1rem;
		line-height: 1.375rem;
		font-weight: 500;

		cursor: pointer;

		${theme === "light" &&
		`
		 background: ${COLORS.dark1};
		 color: ${COLORS.white};
		`}

		${theme === "dark" &&
		`
		 background: ${COLORS.darkgrey};
		 border: 1px solid ${COLORS.lightgrey};
		 color: ${COLORS.white};
		`}
		
&:hover {
			cursor: pointer;
			color: #fff !important;
			background: ${theme === "dark" ? "#23272f" : "#23272f"};
		}
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
	LoginButton: (theme) => css`
		display: flex;

		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: ${theme === "dark" ? "#FFF" : COLORS.dark1};
		line-height: 1.6rem;
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

export default withoutSession(SignupScreen);
