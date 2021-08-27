import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { atom } from "jotai";
import { useAtom } from "jotai";

import { Input } from "dyson/src/components/atoms";
import { Button, Logo } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";

import { LoadingSVG } from "@svg/dashboard";
import {GoogleSVG} from "@svg/social";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";
import { validateEmail, validateName, validatePassword } from "@utils/common/validationUtils";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { loadUserDataAndRedirect } from "../../../hooks/user";
import { RequestMethod } from "../../../types/RequestOptions";

const showRegistrationFormAtom = atom(false);

const registerUser = (name: string, email: string, password: string, inviteType: string | null = null, inviteCode: string | null = null) => {
	return backendRequest("/users/actions/signup", {
		method: RequestMethod.POST,
		payload: { email, password, name: name, lastName: "", inviteReferral: inviteType && inviteCode ? {code: inviteCode, type: inviteType} : null },
	});
};

function EmailPasswordBox() {
    const [data] = useState(null);

    const [, setShowRegistrationBox] = useAtom(showRegistrationFormAtom);
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [name, setName] = useState({ value: "", error: "" });
    const [processingSignup, setProcessingSignup] = useState(false);
    const { query } = useRouter();

    const emailChange = useCallback(
		(e) => {
			setEmail({ ...email, value: e.target.value });
		},
		[email],
	);
    const passwordChange = useCallback(
		(e) => {
			setPassword({ ...password, value: e.target.value });
		},
		[password],
	);
    const nameChange = useCallback(
		(e) => {
			setName({ ...name, value: e.target.value });
		},
		[name],
	);

    const verifyInfo = (completeVerify = false) => {
		const shouldValidateEmail = completeVerify || email.value;
		const shouldValidatePassword = completeVerify || password.value;
		const shouldValidateName = completeVerify || name.value;
		if (!validateEmail(email.value) && shouldValidateEmail) {
			setEmail({ ...email, error: "Please enter valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter a password with length > 4" });
		} else setPassword({ ...password, error: "" });

		if (!validateName(name.value) && shouldValidateName) {
			setName({ ...name, error: "Please enter a valid name" });
		} else setName({ ...name, error: "" });
	};



    const signupUser = async () => {
		verifyInfo(true);

		if (!validateEmail(email.value) || !validatePassword(name.value) || !validateName(email.value)) return;
		setProcessingSignup(true);
		try {
			await registerUser(name.value, email.value, password.value, query?.inviteType ? query.inviteType : null, query?.inviteCode ? query.inviteCode : null);
			// @TODO: Use router push here
			window.location.href = "/app/dashboard";
		} catch (e: any) {
            alert(e.message === "USER_EMAIL_NOT_AVAILABLE" ? "User already registered" : "Some error occurred while registering");
        }
		setProcessingSignup(false);
	};

    const signupOnEnter = (event: any) => {
		if (event.key === "Enter") {
			signupUser();
		}
	};

    loadUserDataAndRedirect({ fetchData: false, userAndSystemData: data });

    return (
		<div css={loginBoxlarge}>
			<div className={"mb-12"}>
				<Input
					autoComplete="name"
					value={name.value}
					placeholder={"Enter name"}
					onChange={nameChange}
					isError={name.error}
					onBlur={verifyInfo.bind(this, false)}
				/>
				<Conditional showIf={name.error}>
					<div className={"mt-8 text-12"} css={errorState}>
						{name.error}
					</div>
				</Conditional>
			</div>

			<div className={"mb-12"}>
				<Input
					autoComplete="email"
					value={email.value}
					placeholder={"Enter email"}
					onChange={emailChange}
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
					value={password.value}
					placeholder={"Enter your password"}
					type={"password"}
					onChange={passwordChange}
					onKeyDown={signupOnEnter}
					isError={password.error}
					onBlur={verifyInfo.bind(this, false)}
				/>
				<Conditional showIf={password.error}>
					<div className={"mt-8 text-12"} css={errorState}>
						{password.error}
					</div>
				</Conditional>
			</div>

			<Button size={"large"} className={"mb-20"} onClick={signupUser} disabled={processingSignup}>
				<div className={"flex justify-center items-center"}>
					<Conditional showIf={!processingSignup}>
						<span className={"mt-2"}>Create an account</span>
					</Conditional>
					<Conditional showIf={processingSignup}>
						<span>
							{" "}
							<LoadingSVG color={"#fff"} height={16} width={16} />
						</span>
						<span className={"mt-2 ml-8"}>Processing</span>
					</Conditional>
				</div>
			</Button>
			<div className="text-13 underline text-center" onClick={setShowRegistrationBox.bind(this, false)}>
				Go back
			</div>
		</div>
	);
}

function SignupBox() {
	const [showRegistrationBox, setRegistrationBox] = useAtom(showRegistrationFormAtom);
	if (showRegistrationBox) {
		return <EmailPasswordBox />;
	}

	return (
		<div css={loginBox}>
			<Button
				size={"large"}
				onClick={setRegistrationBox.bind(this, true)}
				css={css`
					font-weight: 500;
				`}
				bgColor={"tertiary-dark"}
			>
				<div className={"flex justify-center items-center"}>
					<span>Continue with Email</span>
				</div>
			</Button>
		</div>
	);
}

export const SignupContainer = () => {
	const [showRegistrationBox] = useAtom(showRegistrationFormAtom);
	const { query } = useRouter;

	const googleSignupLink = query?.inviteCode ? `/users/actions/auth.google?inviteCode=${query.inviteCode}` : "/users/actions/auth.google";

	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<div className={"font-cera text-16 leading-none font-700 mb-38"}>Create your account</div>

					<Conditional showIf={!showRegistrationBox}>
						<a href={resolvePathToBackendURI(googleSignupLink)}>
							<Button size={"large"} css={googleButton} className={"mb-20"}>
								<div className={"flex justify-center items-center"}>
									<GoogleSVG className={"mr-12"} />
									<span className={"mt-2"}>Continue with Google</span>
								</div>
							</Button>
						</a>
					</Conditional>

					<SignupBox />
					<div className={"font-cera text-15 leading-none font-500"}>
						Already have an account?
						<a href={"/login"}>
							<span
								css={css`
									color: #8a96ff;
								`}
								className={"underline ml-8"}
							>
								Login
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
const loginBoxlarge = css`
	height: 412rem;
`;

const containerCSS = css`
	max-width: 473rem;
`;

const errorState = css`
	color: #ff4583;
`;

export default SignupContainer;
