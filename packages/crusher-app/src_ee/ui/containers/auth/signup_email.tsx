import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { loadUserDataAndRedirect } from "@hooks/user";
import { validateEmail, validatePassword, validateName } from "@utils/common/validationUtils";
import { SubmitButton } from "./components/SubmitButton";
import { FormInput } from "./components/FormInput";

import { LoginNavBar } from "@ui/containers/common/login/navbar";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "@types/RequestOptions";

const registerUser = (name: string, email: string, password: string, inviteType: string | null = null, inviteCode: string | null = null) => {
	return backendRequest("/users/actions/signup", {
		method: RequestMethod.POST,
		payload: { email, password, name: name, lastName: "", inviteReferral: inviteType && inviteCode ? { code: inviteCode, type: inviteType } : null },
	});
};

export default function Signup_email({ loginWithEmailHandler }) {
	const [data, setData] = useState(null);
	const router = useRouter();
	const { query } = router;

	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const [name, setName] = useState({ value: "", error: "" });
	const [loading, setLoading] = useState(false);

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

		if (!validateEmail(email.value) || !validatePassword(password.value) || !validateName(email.value)) return;
		setLoading(true);
		try {
			const data = await registerUser(name.value, email.value, password.value, query?.inviteType?.toString(), query?.inviteCode?.toString());
			setData(data.systemInfo);
		} catch (e: any) {
			console.error(e);
			alert(e.message === "USER_EMAIL_NOT_AVAILABLE" ? "User already registered" : "Some error occurred while registering");
		}
		setLoading(false);
	};

	const signupOnEnter = (event: any) => {
		if (event.key === "Enter") {
			signupUser();
		}
	};

	loadUserDataAndRedirect({ fetchData: false, userAndSystemData: data });

	return (
		<div css={containerCSS}>
			<div className="pt-28">
				<LoginNavBar />
			</div>
			<div className={"flex justify-center"}>
				<div
					className={"flex flex-col items-center"}
					css={css`
						margin-top: 144rem;
					`}
				>
					<Heading type={1} fontSize={22} weight={900}>
						Get superpowers to{" "}
						<span
							css={css`
								color: #d4eb79;
							`}
						>
							ship fast
						</span>{" "}
						and{" "}
						<span
							css={css`
								color: #8c67f5;
								margin-right: 12px;
							`}
						>
							better
						</span>
						🚀
					</Heading>
					<TextBlock
						fontSize={14.2}
						color={"#606060"}
						className={"mt-16"}
						css={css`
							letter-spacing: 0.2px;
						`}
						leading={false}
					>
						Devs use crusher to test & ship fast with confidence. Get started in seconds
					</TextBlock>

					<div css={overlayContainer} className={"mt-48 pb-60"}>
						<div className={" mb-72"}>
							<div className={" mb-20"}>
								<FormInput
									onReturn={signupUser.bind(this)}
									data={name}
									onChange={nameChange}
									autoComplete={"name"}
									placeholder={"Enter name"}
									onBlur={verifyInfo.bind(this, false)}
								/>
								<FormInput
									onReturn={signupUser.bind(this)}
									data={email}
									onChange={emailChange}
									autoComplete={"email"}
									placeholder={"Enter email"}
									onBlur={verifyInfo.bind(this, false)}
								/>
								<FormInput
									type={"password"}
									data={password}
									onReturn={signupUser.bind(this)}
									onChange={passwordChange}
									onEnter={signupOnEnter}
									autoComplete={"new-password"}
									placeholder={"Enter password"}
									onBlur={verifyInfo.bind(this, false)}
								/>
							</div>

							<SubmitButton text="Create an account" onSubmit={signupUser} loading={loading} />
						</div>
						<div className="flex items-center justify-between">
							<Text onClick={loginWithEmailHandler} css={underLineonHover} fontSize={12}>
								Go back
							</Text>
							<Text onClick={() => router.push("/forgot_password")} css={underLineonHover} fontSize={12}>
								Forgot Password
							</Text>
						</div>
					</div>
					<div onClick={() => router.push("/login")} className="flex w-full justify-center mt-40">
						<Text
							color={"#565657"}
							fontSize={14}
							css={css`
								font-size: 14.5rem;
								:hover {
									text-decoration: underline;
								}
							`}
						>
							Already registered?{" "}
							<span
								css={css`
									color: #855aff;
								`}
							>
								Login
							</span>
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

const helpCSS = css`
	color: #565657;
`;
const containerCSS = css(`
height: 100vh;
background: #0C0C0D;
width: 100vw;
`);

const overlayContainer = css(`
	width: 372rem;
`);

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;
