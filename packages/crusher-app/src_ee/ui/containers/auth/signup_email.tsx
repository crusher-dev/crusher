import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { loadUserDataAndRedirect } from "@hooks/user";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { validateEmail, validatePassword, validateName } from "@utils/common/validationUtils";
import { SubmitButton } from "./components/SubmitButton";
import { FormInput } from "./components/FormInput";

const RocketImage = (props) => (
	<img
		{...props}
		src={
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJBSURBVHgBndJNSJNxHAfw77ZnPcu5Cb4u3yrnzMhMxQyLOnRQC0yJ9NBFSjHo0k0yIuhSmNClCJUOlpGHDpUkmka+5NSp0Wh7Njc3n/a4ILH26rO5t+efGXWaFX3P38/l9/sC/xnRvxbbOjoUyozy0kBUdCzgX3/9V9ja2io9W3O63UsltLz3yXNo1T4YtLN2yZ/QpE5XQDPWye4nTxvSx0aTKpvqUZgFvJxiV8Tbob6+vqP+Ce1Cz9R04QTzEYrkJBTlZcPD2uCxvhuNCzuLy07yGQf651b9ijO8F90aDaovNcNiYTA8NBxJ8OsfUb/KvkzVBXg8u1YIUfXmV1weN/ISWXoxGrtO4KA6G1bWjumpGTCmpTsL49PGLejLT2umvb6H4dgGFiHFiFiFRD6II0UliAoGmPVa6BkOM7Pz8zYHe/eHocj1HHXYFeykXCFwTnhGuBTZ3pIymWZ3Eg6/7cVAmMYnrxMSj8PImJfrvjrMri0YruDvUztiYmGN/nazJ/Mqu7/03vHEIJTd7eiXZ2FOkIOsfXnBuwwXvRzn/n0IQn6OgHt8qNphqmXPN9WRc8oE0pWbFm1JySODO5XLDUD8t324hhKBq4qG3LfJgwY1GaqRDeoU1PNVMYhbhFfxjJhszk5TntojUsoldt1nVJ4SZnJpLKjFsXp6syCIYI8LLbXYI9kIFkUYW1SJgbGlIbaqIC8clCrIegS4kSLgSjxI8RlIhlR0yzW2+IaxRAyNz8C726SmQGqoJssJLbbJd0nz9aMpv90CAAAAAElFTkSuQmCC"
		}
	/>
);

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
		<div
			css={css(`
				height: 100vh;
				background: #08090b;
				width: 100vw;
			`)}
		>
			<div className={"flex justify-center"}>
				<div className={"mt-84 flex flex-col items-center"}>
					<Heading type={1} fontSize={18}>
						Try crusher for free <RocketImage className={"ml-8"} />
					</Heading>
					<TextBlock fontSize={14.2} color={"#E7E7E7"} className={"mt-12"} leading={false}>
						Million of devs empower their workflow with crusher
					</TextBlock>

					<div css={overlayContainer} className={"mt-36 pt-32 pl-28 pr-28"}>
						<TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-24"} weight={"600"}>
							Create a new account
						</TextBlock>

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

						<div className="flex items-center justify-between mt-20">
							<Text onClick={loginWithEmailHandler.bind(this, false)} className={"underline-on-hover"} fontSize={12}>
								Go back
							</Text>
						</div>
					</div>
					<div onClick={() => router.push("/login")} className="mt-40">
						<Text color="#9692FF" className={"underline-on-hover"} fontSize={14}>
							or go to login
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

const overlayContainer = css(`
	background: #0a0b0c;
	border: 1px solid #21252f;
	border-radius: 10px;
	width: 372rem;
	min-height: 440px;
`);

export const errorState = css(`
	color: #ff4583;
`);
