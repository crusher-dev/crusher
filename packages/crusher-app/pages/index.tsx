import Head from "next/head";
import Link from "next/link";
import { css } from "@emotion/core";
import { serialize } from "cookie";
import React, { useContext, useState } from "react";
import isEmail from "validator/lib/isEmail";
import { resolvePathToBackendURI } from "@utils/url";
import withoutSession from "@hoc/withoutSession";
import { USER_NOT_REGISTERED } from "@utils/constants";
import { _authenticateUser } from "@services/user";
import { EMAIL_NOT_VERIFIED, NO_TEAM_JOINED, SIGNED_IN } from "@utils/constants";
import { redirectToFrontendPath } from "@utils/router";
import { AuthenticationTemplate } from "@ui/template/authenticationDark";
import { GoogleIcon } from "@ui/components/common/SVGs";
import { getStyleFromObject } from "@utils/styleUtils";
import { COLORS, COMPONENTS, ThemeContext } from "@constants/style";
import { emitter } from "@utils/mitt";

const handleClIToken = (ctx) => {
	const {
		query: { cli_token },
		res,
	} = ctx;
	if (cli_token) {
		res.setHeader("Set-Cookie", serialize("cli_token", cli_token, { path: "/", maxAge: 90_000 }));
	}
};

function Home() {
	const theme = useContext(ThemeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleLogin = () => {
		if (!isEmail(email)) {
			emitter.emit("error", "Please enter a valid email");
			return;
		}

		if (!password || password.length < 1) {
			emitter.emit("normal", "Please enter a password");
			return;
		}

		_authenticateUser(email, password).then((res) => {
			const { status } = res;
			switch (status) {
				case NO_TEAM_JOINED:
                    return redirectToFrontendPath("/onboarding");
				case EMAIL_NOT_VERIFIED:
                    return redirectToFrontendPath("/");
				case SIGNED_IN:
                    return redirectToFrontendPath("/app/dashboard");
				case USER_NOT_REGISTERED:
					alert("Wrong email or password");
					break;
				default:
					break;
			}
		});
	};

	function handleReturnKey(event) {
		if (event.keyCode === 13) {
			handleLogin();
		}
	}

	const isIFrame = window.self !== window.top;

	return (
		<div>
			<Head>
				<title>Login | Crusher</title>
			</Head>

			<AuthenticationTemplate>
				<div css={styles.form(theme)}>
					<div css={styles.headingContainer}>
						<div css={styles.formHeading(theme)} className={"font-cera text-100 "}>
							Login to Crusher
						</div>
					</div>

					<div css={styles.inputContainer}>
						<form>
							<input
								css={[styles.phoneInput, styles.inputElement(theme)]}
								placeholder={"Email"}
								onKeyDown={handleReturnKey}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								value={email}
								type="email"
								name={"email"}
								autoComplete={"on"}
								className={"font-medium"}
							/>
							<input
								css={[styles.passwordInput, styles.inputElement(theme)]}
								onKeyDown={handleReturnKey}
								className={"font-medium"}
								onChange={(event) => {
									setPassword(event.target.value);
								}}
								autoComplete={"current-password"}
								placeholder={"Password"}
								type="password"
							/>
						</form>
					</div>
					<div css={styles.requestButton} onClick={handleLogin} className={"font-medium button"}>
						Next
					</div>
					<a href={resolvePathToBackendURI("/v2/user/authenticate/google")} target={isIFrame ? "_blank" : "_self"} css={styles.loginGoogleLink}>
						<div css={styles.googleLoginButton(theme)}>
							<GoogleIcon width={"1.5rem"} height={"1.44rem"} />
							<span className={"font-medium button"} style={{marginLeft: 12}}>Login with Google</span>
						</div>
					</a>
				</div>

				<div css={styles.accountCreationContainer}>
					<div css={styles.signupButton(theme)} className={"font-medium font-cera"}>
						Ship faster, better without bugs
					</div>
					<Link href={"/get-started"} prefetch>
						<a href={"/get-started"} css={styles.registerButton(theme)} className={"font-medium button"}>
							Try no-code testing free
						</a>
					</Link>
				</div>
			</AuthenticationTemplate>
		</div>
	);
}

Home.getInitialProps = (ctx) => {
	handleClIToken(ctx);
	return {};
};

const styles = {
	loginGoogleLink: css`
		:hover {
			text-decoration: none !important;
		}
	`,
	form: (theme) => css`
		width: 26rem;
		// padding: 1.5rem 1.5rem 0 1.5rem;
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
		font-weight: 600;
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
		margin-bottom: 1.55rem;
	`,
	inputElement: (theme) => css`
		border: 1px solid ${theme === "dark" ? "#15181E" : "#d6ddff"};
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.9rem 1.5rem;

		background: ${theme === "dark" ? "#15181E" : "#fff"};
		color: ${theme === "dark" ? "#B0B2BB" : "#15181E"};
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
	googleLoginButton: (theme) => css`
		display: flex;
		align-item: center;
		justify-content: center;

		border: ${theme === "dark" ? "0" : "1px"} solid #e1e1e1;
		box-sizing: border-box;
		border-radius: 5px;
		width: 100%;
		padding: 1rem 1.75rem;
		margin-bottom: 1rem;
		font-size: 1rem;
		line-height: 1.375rem;
		font-weight: 500;
		color: ${theme === "light" ? COLORS.dark1 : "#fff"};
		background: ${theme === "dark" ? "#17191E" : "#fff"};

		cursor: pointer;

		:hover {
			background: ${theme === "dark" ? "#15181d" : "#f6f6f6"};
		}
	`,
	accountCreationContainer: css`
		width: 26rem;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		flex-direction: column;
	`,
	signupButton: (theme) => css`
		font-size: 1.15rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: ${getStyleFromObject(COMPONENTS.font.primary, theme)};
	`,
	registerButton: (theme) => css`
    :hover {
        text-decoration: none !important;
    }
    display: flex;
    justify-content: center;
    width: 100%;

    ${theme === "light" &&
    `
     background: ${COLORS.dark1};
     color: ${COLORS.white};
    `}

    ${theme === "dark" && `
 background: ${COLORS.darkgrey};
 border: 1px solid ${COLORS.lightgrey};
 color: ${COLORS.white};
`}

        border-radius: 5px;
        font-size: 1.06rem;
        padding: 1.13rem;
        color: #fff;
        cursor: pointer;
        &:hover {
            cursor: pointer;
            color: #fff !important;
            background: #23272f;
        }
    `,
	passwordInput: css`
		width: 100%;
	`,
};

export default withoutSession(Home);
