import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { Button, Logo } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";

import { LoadingSVG } from "@svg/dashboard";
import { GoogleSVG } from "@svg/social";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";
import { validateEmail, validatePassword } from "@utils/common/validationUtils";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { loadUserDataAndRedirect } from "@hooks/user";
import { RequestMethod } from "@types/RequestOptions";
import { getGoogleAuthUrl } from "@utils/routing";

const emailLogin = (email: string, password: string) => {
	return backendRequest("/users/actions/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

function EmailPasswordBox({ setShowBox }) {
	const router = useRouter();
	const [email, setEmail] = useState({ value: "", error: null });
	const [password, setPassword] = useState({ value: "", error: null });
	const [processingSignup, setProcessingSignup] = useState(false);
	const [data, setData] = useState(null);

	const emailChange = (event: any) => {
		setEmail({ ...email, value: event.target.value });
	};
	const passwordChange = (event: any) => {
		setPassword({ ...password, value: event.target.value });
	};

	const loginOnEnter = (event: any) => {
		if (event.key === "Enter") {
			return onLogin();
		}
	};

	const verifyInfo = (completeVerify = false) => {
		const shouldValidateEmail = completeVerify || email.value;
		const shouldValidatePassword = completeVerify || password.value;
		if (!validateEmail(email.value) && shouldValidateEmail) {
			setEmail({ ...email, error: "Please enter valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter a password with length > 4" });
		} else setPassword({ ...password, error: "" });
	};

	const onLogin = async () => {
		verifyInfo(true);

		if (!validateEmail(email.value) || !validatePassword(password.value)) return;
		setProcessingSignup(true);
		try {
			const { systemInfo } = await emailLogin(email.value, password.value);
			setData(systemInfo);
			router.push("/app/dashboard");
		} catch (e: any) {
			if (e.message === "INVALID_CREDENTIALS") {
				alert("Please add valid ceredentials.");
			} else {
				alert(e);
			}
		}
		setProcessingSignup(false);
	};

	loadUserDataAndRedirect({ fetchData: false, userAndSystemData: data });

	return (
		<div css={[loginBox]}>
			<div className={"mb-12"}>
				<Input
					autoComplete={"email"}
					value={email.value}
					onChange={emailChange}
					placeholder={"Enter email"}
					isError={email.error}
					onBlur={verifyInfo.bind(this, false)}
				/>
				<Conditional showIf={email.error}>
					<div className={"mt-8 text-12"} css={errorState}>
						{email.error}
					</div>
				</Conditional>
			</div>

			<div className={"mb-20"}>
				<Input
					autoComplete={"password"}
					value={password.value}
					placeholder={"Enter your password"}
					type={"password"}
					onChange={passwordChange}
					onKeyUp={loginOnEnter}
					isError={password.error}
					onBlur={verifyInfo.bind(this, false)}
				/>
				<Conditional showIf={password.error}>
					<div className={"mt-8 text-12"} css={errorState}>
						{password.error}
					</div>
				</Conditional>
			</div>

			<Button size={"large"} className={"mb-20"} onClick={onLogin}>
				<div className={"flex justify-center items-center"}>
					<Conditional showIf={!processingSignup}>
						<span className={"mt-2"}>Login</span>
					</Conditional>
					<Conditional showIf={processingSignup}>
						<span>
							{" "}
							<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
						</span>
						<span className={"mt-2 ml-8"}>Processing</span>
					</Conditional>
				</div>
			</Button>
			<div className={"flex justify-between"}>
				<div className="text-13 underline" onClick={setShowBox.bind(this, false)}>
					Go back
				</div>
				<div
					className="text-13 text-blue-800  underline"
					onClick={React.useCallback(() => {
						router.push("/forgot_password");
					}, [])}
				>
					Forget Password?
				</div>
			</div>
		</div>
	);
}

function EmailBox() {
	const [showBox, setShowBox] = useState(false);

	if (showBox) {
		return <EmailPasswordBox setShowBox={setShowBox} />;
	}

	return (
		<div css={loginBox}>
			<Button
				size={"large"}
				onClick={setShowBox.bind(this, true)}
				css={css`
					font-weight: 500;
				`}
				bgColor={"tertiary-dark"}
			>
				<div className={"flex justify-center items-center"}>
					<span>Continue with Email</span>
				</div>
			</Button>

			{/*<Conditional showIf={type !== "signup" && false}>*/}
			{/*	<div*/}
			{/*		className={"text-13 leading-none text-center mt-36"}*/}
			{/*		css={css`*/}
			{/*			color: rgba(255, 255, 255, 0.5);*/}
			{/*		`}*/}
			{/*	>*/}
			{/*		Continue with SAML SSO*/}
			{/*	</div>*/}
			{/*</Conditional>*/}
		</div>
	);
}

export const LoginContainer = () => {
	const { query } = useRouter();

	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<div className={"font-cera text-15 leading-none font-500 mb-38"}>Login to your account</div>

					<a href={getGoogleAuthUrl(query)}>
						<Button size={"large"} css={googleButton} className={"mb-20"}>
							<div className={"flex justify-center items-center"}>
								<GoogleSVG className={"mr-12"} />
								<span className={"mt-2"}>Continue with Google</span>
							</div>
						</Button>
					</a>
					{/*<a href={resolvePathToBackendURI(("/user/authenticate/github"))}>*/}
					{/*	<Button*/}
					{/*		size={"large"}*/}
					{/*		css={css`*/}
					{/*		font-weight: 500;*/}
					{/*	`}*/}
					{/*		bgColor={"tertiary-dark"}*/}
					{/*		className={"mb-32"}*/}
					{/*	>*/}
					{/*		<div className={"flex justify-center items-center"}>*/}
					{/*			<GithubSVG className={"mr-12"} />*/}
					{/*			<span className={"mt-2"}>Continue with Github</span>*/}
					{/*		</div>*/}
					{/*	</Button>*/}
					{/*</a>*/}

					<EmailBox />
					<div className={"font-cera text-15 leading-none font-500"}>
						Don't have an account?
						<a href={"/signup"}>
							<span
								css={css`
									color: #8a96ff;
								`}
								className={"underline ml-8"}
							>
								Signup
							</span>
						</a>
					</div>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const googleButton = css`
	background-color: #6ea5f9;
	border-color: #4675bd;
	font-weight: 600;
	span {
		font-size: 14rem;
	}

	:hover {
		background-color: #588fe2;
	}
`;

const loginBox = css`
	height: 272rem;
`;

const containerCSS = css`
	max-width: 473rem;
`;

const errorState = css`
	color: #ff4583;
`;

export default LoginContainer;
