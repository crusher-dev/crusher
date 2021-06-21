import React from "react";
import Head from "next/head";
import { useContext, useState } from "react";
import { resolvePathToBackendURI } from "@utils/url";
import withoutSession from "@hoc/withoutSession";
import { USER_ALREADY_REGISTERED, USER_REGISTERED } from "@utils/constants";
import { _registerUser } from "@services/user";
import { redirectToFrontendPath } from "@utils/router";
import { AuthenticationTemplate } from "@ui/template/authenticationDark";
import { css } from "@emotion/core";
import { BackSVG, GoogleIcon } from "@ui/components/common/SVGs";
import Link from "next/link";
import { COLORS, ThemeContext } from "@constants/style";
import { iInviteReferral } from "@crusher-shared/types/inviteReferral";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import isEmail from "validator/lib/isEmail";
import { iPageContext } from "@interfaces/pageContext";

interface iSignupScreenProps {
	inviteReferral: iInviteReferral | null;
}

function getRegisterGoogleUrl(inviteReferral: iInviteReferral | null) {
	const url = new URL(resolvePathToBackendURI("/v2/user/authenticate/google"));

	if (inviteReferral) {
		url.searchParams.append("inviteType", inviteReferral.type);
		url.searchParams.append("inviteType", inviteReferral.code);
	}

	return url.toString();
}

function SignupScreen(props: iSignupScreenProps) {
	const { inviteReferral } = props;
	const theme = useContext(ThemeContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSignUp = () => {
		const nameArr = name.split(" ");
		const firstName = nameArr[0] || "";
		const lastName = nameArr[1] || "";

		if (!isEmail(email)) {
			alert("Please enter a valid email");
			return;
		}

		if (!password || password.length < 1) {
			alert("Please enter password");
			return;
		}

		if (name && firstName.length < 1) {
			alert("Please enter your first name");
			return;
		}

		_registerUser(firstName, lastName, email, password, inviteReferral).then((res: any) => {
			const { status } = res;

			switch (status) {
				case USER_REGISTERED:
                    return redirectToFrontendPath("/app/dashboard");
				case USER_ALREADY_REGISTERED:
					alert("An account with this email has already been registered");
					break;
				default:
					break;
			}
			return false;
		});
	};

	function handleKeyDown(event: any) {
		if (event.keyCode === 13) {
			handleSignUp();
		}
	}

	const isIFrame = window.self !== window.top;

	return (
		<div>
			<Head>
				<title>Signup | Crusher</title>
			</Head>

			<AuthenticationTemplate>
				<div css={formCSS(theme)}>
					<div>
						<div css={formHeadingCSS(theme)}>Start testing</div>
					</div>

					<form css={formContainerCSS}>
						<div css={inputContainerCSS}>
							<input
								css={[phoneInputCSS, inputElementCSS(theme)]}
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
								css={[passwordInputCSS, inputElementCSS(theme)]}
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
								css={[passwordInputCSS, inputElementCSS(theme)]}
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
					<div css={requestButtonCSS} onClick={handleSignUp} className={"button"}>
						Next
					</div>
					<a href={getRegisterGoogleUrl(inviteReferral)} target={isIFrame ? "_blank" : "_self"} className={"noDecoration"}>
						<div css={googleLoginButtonCSS(theme)}>
							<GoogleIcon width={"1.5rem"} height={"1.44rem"} />
							<span style={{marginLeft: 15}}>Signup with Google</span>
						</div>
					</a>
				</div>

				<div>
					<Link href={"/"} prefetch>
						<a css={loginButtonCSS(theme)}>
							<BackSVG fill={theme === "dark" ? "#FFFFFF" : COLORS.dark1} css={{ marginRight: "1rem", height: "1.5rem" }} />
							Already registered? Login
						</a>
					</Link>
				</div>
			</AuthenticationTemplate>
		</div>
	);
}

SignupScreen.getInitialProps = (ctx: iPageContext) => {
	const { inviteType, inviteCode } = ctx.query;

	return {
		inviteReferral:
			inviteType && inviteCode
				? {
						type: inviteType,
						code: inviteCode,
				  }
				: null,
	};
};

const formCSS = (theme: string) => {
	return css`
		width: 26rem;
		padding: 1.5rem 1.5rem;

		border: 1px solid ${theme === "dark" ? "#2E3139" : "#d6ddff"};
		box-sizing: border-box;
		border-radius: 12px;

		margin-bottom: 2rem;
	`;
};

const formHeadingCSS = (theme: string) => {
	return css`
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.6;
		color: ${theme === "dark" ? "#fff" : COLORS.dark1};
	`;
};

const formContainerCSS = css`
	margin-top: 1rem;
`;
const inputContainerCSS = css`
	margin-bottom: 1.65rem;
`;
const phoneInputCSS = css`
	width: 100%;
`;
const inputElementCSS = (theme: string) => {
	return css`
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
	`;
};

const requestButtonCSS = css`
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
`;

const googleLoginButtonCSS = (theme: string) => {
	return css`
    display: flex;
    align-item: center;
    justify-content: center;

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

    ${theme === "dark" && `
 background: ${COLORS.darkgrey};
 border: 1px solid ${COLORS.lightgrey};
 color: ${COLORS.white};
`}
        
        &:hover {
            cursor: pointer;
            span {
                text-decoration: none;
            }

            color: #fff !important;
            background: #23272f;
        }
    `;
};

const loginButtonCSS = (theme: string) => {
	return css`
		display: flex;

		font-size: 1.05rem;
		line-height: 1.05rem;

		margin-bottom: 2rem;
		color: ${theme === "dark" ? "#FFF" : COLORS.dark1};
		line-height: 1.6rem;
	`;
};
const passwordInputCSS = css`
	width: 100%;
`;

export default withoutSession(SignupScreen);
