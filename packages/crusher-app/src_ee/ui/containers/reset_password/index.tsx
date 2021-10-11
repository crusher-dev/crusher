import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { atom } from "jotai";
import { useAtom } from "jotai";

import { Input } from "dyson/src/components/atoms";
import { Button, Logo } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";

import { LoadingSVG } from "@svg/dashboard";
import { GoogleSVG } from "@svg/social";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";
import { validateEmail, validateName, validatePassword } from "@utils/common/validationUtils";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { loadUserDataAndRedirect } from "@hooks/user";
import { RequestMethod } from "@types/RequestOptions";
import { getBoolean } from "@utils/common";

const showRegistrationFormAtom = atom(false);

const registerUser = (name: string, email: string, password: string, inviteType: string | null = null, inviteCode: string | null = null) => {
	return backendRequest("/users/actions/signup", {
		method: RequestMethod.POST,
		payload: { email, password, name: name, lastName: "", inviteReferral: inviteType && inviteCode ? { code: inviteCode, type: inviteType } : null },
	});
};

function EmailPasswordBox() {
	const [data] = useState(null);

	const [email, setEmail] = useState({ value: "", error: "" });
	const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const [name, setName] = useState({ value: "", error: "" });
	const [processingSignup, setProcessingSignup] = useState(false);
	const router = useRouter();
	const { query } = router;

	const confirmPasswordChange = useCallback(
		(e) => {
			setConfirmPassword({ ...confirmPassword, value: e.target.value });
		},
		[confirmPassword],
	);
	const passwordChange = useCallback(
		(e) => {
			setPassword({ ...password, value: e.target.value });
		},
		[password],
	);

	const verifyInfo = (completeVerify = false) => {
		const shouldValidateEmail = completeVerify || email.value;
		const shouldValidatePassword = completeVerify || confirmPassword.value;
		const shouldValidateName = completeVerify || name.value;
		if (!validateEmail(email.value) && shouldValidateEmail) {
			setEmail({ ...email, error: "Please enter valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(confirmPassword.value) && shouldValidatePassword) {
			setConfirmPassword({ ...confirmPassword, error: "Please enter a password with length > 4" });
		} else setConfirmPassword({ ...confirmPassword, error: "" });

		if (!validateName(name.value) && shouldValidateName) {
			setName({ ...name, error: "Please enter a valid name" });
		} else setName({ ...name, error: "" });
	};

	const signupUser = async () => {
		verifyInfo(true);

		if (!validateEmail(email.value) || !validatePassword(name.value) || !validateName(email.value)) return;
		setProcessingSignup(true);
		try {
			await registerUser(name.value, email.value, confirmPassword.value, query?.inviteType?.toString(), query?.inviteCode?.toString());
			router.push("/app/dashboard");
		} catch (e: any) {
			console.log(e);
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
				<Conditional showIf={getBoolean(password.error)}>
					<div className={"mt-8 text-12"} css={errorState}>
						{password.error}
					</div>
				</Conditional>
			</div>
			<div className={"mb-20"}>
				<Input
					value={confirmPassword.value}
					placeholder={"Confirm your password"}
					type={"password"}
					onChange={confirmPasswordChange}
					onKeyDown={signupOnEnter}
					isError={confirmPassword.error}
					onBlur={verifyInfo.bind(this, false)}
				/>
				<Conditional showIf={getBoolean(confirmPassword.error)}>
					<div className={"mt-8 text-12"} css={errorState}>
						{confirmPassword.error}
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
							<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
						</span>
						<span className={"mt-2 ml-8"}>Processing</span>
					</Conditional>
				</div>
			</Button>
			<div className="text-13 underline text-center" onClick={useCallback(()=>{router.push("/login")},[])}>
				Go back
			</div>
		</div>
	);
}


export const SignupContainer = () => {
	const { query } = useRouter();

	const googleSignupLink = query?.token 

	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<div className={"font-cera text-16 leading-none font-700 mb-38"}>Enter your new password</div>


					<EmailPasswordBox />
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
