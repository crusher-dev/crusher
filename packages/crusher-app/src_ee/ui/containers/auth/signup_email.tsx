import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { useAtom } from "jotai";

import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Text } from "dyson/src/components/atoms/text/Text";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

import { loadUserDataAndRedirect } from "@hooks/user";
import { inviteCodeUserKeyAtom } from "@store/atoms/global/inviteCode";
import { RequestMethod } from "@types/RequestOptions";
import { LoginNavBar } from "@ui/containers/common/login/navbar";
import { backendRequest } from "@utils/common/backendRequest";
import { validateEmail, validatePassword, validateName, validateSessionInviteCode } from "@utils/common/validationUtils";

import BaseContainer from "./components/BaseContainer";
import { FormInput } from "./components/FormInput";
import { SubmitButton } from "./components/SubmitButton";

const registerUser = (
	name: string,
	email: string,
	password: string,
	discordInviteCode: string,
	inviteType: string | null = null,
	inviteCode: string | null = null,
) => {
	return backendRequest("/users/actions/signup", {
		method: RequestMethod.POST,
		payload: {
			email,
			password,
			name: name,
			lastName: "",
			discordInviteCode: discordInviteCode,
			inviteReferral: inviteType && inviteCode ? { code: inviteCode, type: inviteType } : null,
		},
	});
};

export default function Signup_email({ loginWithEmailHandler }) {
	const [data, setData] = useState(null);
	const router = useRouter();
	const { query } = router;

	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const [name, setName] = useState({ value: "", error: "" });
	const [sessionInviteCode, setSessionInviteCode] = useAtom(inviteCodeUserKeyAtom);

	const [discordInviteCode, setDiscordInviteCode] = React.useState({ value: "", error: "" });

	React.useEffect(() => {
		if (sessionInviteCode) {
			setDiscordInviteCode({ value: sessionInviteCode, error: "" });
		}
	}, [sessionInviteCode]);
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
	const inviteCodeChange = useCallback(
		(e) => {
			setDiscordInviteCode({ ...discordInviteCode, value: e.target.value });
		},
		[discordInviteCode],
	);

	const verifyInfo = (completeVerify = false) => {
		const shouldValidateEmail = completeVerify || email.value;
		const shouldValidatePassword = completeVerify || password.value;
		const shouldValidateName = completeVerify || name.value;
		const shouldValidateInvitecode = completeVerify || discordInviteCode.value;

		if (!validateEmail(email.value) && shouldValidateEmail) {
			setEmail({ ...email, error: "Please enter valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter a password with length > 4" });
		} else setPassword({ ...password, error: "" });

		if (!validateName(name.value) && shouldValidateName) {
			setName({ ...name, error: "Please enter a valid name" });
		} else setName({ ...name, error: "" });

		if (!validateSessionInviteCode(discordInviteCode.value) && shouldValidateInvitecode) {
			setDiscordInviteCode({ ...discordInviteCode, error: "Please enter correct invite code." });
		} else {
			setName({ ...name, error: "" });
		}
	};

	const signupUser = async () => {
		verifyInfo(true);

		if (!validateEmail(email.value) || !validatePassword(password.value) || !validateName(email.value) || !validateSessionInviteCode(discordInviteCode.value))
			return;
		setLoading(true);
		try {
			const data = await registerUser(
				name.value,
				email.value,
				password.value,
				discordInviteCode.value,
				query?.inviteType?.toString(),
				query?.inviteCode?.toString(),
			);
			setData(data.systemInfo);
			setSessionInviteCode(null);
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
		<BaseContainer>
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
						<FormInput onReturn={signupUser.bind(this)} data={email} onChange={emailChange} placeholder={"Enter email"} onBlur={verifyInfo.bind(this, false)} />
						<FormInput
							type={"password"}
							data={password}
							onChange={passwordChange}
							onEnter={signupOnEnter}
							autoComplete={"new-password"}
							placeholder={"Enter password"}
							onBlur={verifyInfo.bind(this, false)}
						/>
						<FormInput
							type={"text"}
							data={discordInviteCode}
							onReturn={signupUser.bind(this)}
							onChange={inviteCodeChange}
							onEnter={signupOnEnter}
							placeholder={"Enter invite code"}
							onBlur={verifyInfo.bind(this, false)}
						/>
					</div>

					<SubmitButton text="Create an account" onSubmit={signupUser} loading={loading} />
				</div>
				<div className="flex items-center justify-between">
					<Text onClick={loginWithEmailHandler} css={underLineonHover} fontSize={13}>
						Go back
					</Text>

					<div
						css={css`
							display: flex;
							justify-content: flex-end;
						`}
					>
						<a href="https://discord.gg/sWbWNYWv" target="__blank">
							<Text onClick={loginWithEmailHandler} css={underLineonHover} fontSize={13}>
								Don't have code?
							</Text>
						</a>
					</div>
				</div>
			</div>
			{/* <div onClick={() => router.push("/login")} className="flex w-full justify-center mt-40">
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
			</div> */}
		</BaseContainer>
	);
}

const overlayContainer = css(`
	width: 368rem;
`);

const underLineonHover = css`
	color: #bdbdbd;
	:hover {
		text-decoration: underline;
	}
`;
