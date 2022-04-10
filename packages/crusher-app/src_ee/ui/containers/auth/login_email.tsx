import React, { useState } from "react";
import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { useRouter } from "next/router";
import { validateEmail, validatePassword } from "@utils/common/validationUtils";
import { loadUserDataAndRedirect } from "@hooks/user";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "@types/RequestOptions";
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";
import { LoadingSVG } from "@svg/dashboard";

const RocketImage = (props) => (
	<img
		{...props}
		src={
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJBSURBVHgBndJNSJNxHAfw77ZnPcu5Cb4u3yrnzMhMxQyLOnRQC0yJ9NBFSjHo0k0yIuhSmNClCJUOlpGHDpUkmka+5NSp0Wh7Njc3n/a4ILH26rO5t+efGXWaFX3P38/l9/sC/xnRvxbbOjoUyozy0kBUdCzgX3/9V9ja2io9W3O63UsltLz3yXNo1T4YtLN2yZ/QpE5XQDPWye4nTxvSx0aTKpvqUZgFvJxiV8Tbob6+vqP+Ce1Cz9R04QTzEYrkJBTlZcPD2uCxvhuNCzuLy07yGQf651b9ijO8F90aDaovNcNiYTA8NBxJ8OsfUb/KvkzVBXg8u1YIUfXmV1weN/ISWXoxGrtO4KA6G1bWjumpGTCmpTsL49PGLejLT2umvb6H4dgGFiHFiFiFRD6II0UliAoGmPVa6BkOM7Pz8zYHe/eHocj1HHXYFeykXCFwTnhGuBTZ3pIymWZ3Eg6/7cVAmMYnrxMSj8PImJfrvjrMri0YruDvUztiYmGN/nazJ/Mqu7/03vHEIJTd7eiXZ2FOkIOsfXnBuwwXvRzn/n0IQn6OgHt8qNphqmXPN9WRc8oE0pWbFm1JySODO5XLDUD8t324hhKBq4qG3LfJgwY1GaqRDeoU1PNVMYhbhFfxjJhszk5TntojUsoldt1nVJ4SZnJpLKjFsXp6syCIYI8LLbXYI9kIFkUYW1SJgbGlIbaqIC8clCrIegS4kSLgSjxI8RlIhlR0yzW2+IaxRAyNz8C726SmQGqoJssJLbbJd0nz9aMpv90CAAAAAElFTkSuQmCC"
		}
	/>
);
const emailLogin = (email: string, password: string) => {
	return backendRequest("/users/actions/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

export default function EmailLogin({ goBackHandler }) {
	const router = useRouter();
	const [email, setEmail] = useState({ value: "", error: null });
	const [password, setPassword] = useState({ value: "", error: null });
	const [loading, setLoading] = useState(false);
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
			setEmail({ ...email, error: "Please enter a valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter min 5 char password" });
		} else setPassword({ ...password, error: "" });
	};

	const onLogin = async () => {
		verifyInfo(true);

		if (!validateEmail(email.value) || !validatePassword(password.value)) return;
		setLoading(true);
		try {
			const { systemInfo } = await emailLogin(email.value, password.value);
			setData(systemInfo);
			router.push("/app/dashboard");
		} catch (e: any) {
			if (e.message === "INVALID_CREDENTIALS") {
				alert("Invalid email and password.");
			} else {
				alert(e);
			}
		}
		setLoading(false);
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
						Ready to ship faster & better <RocketImage className={"ml-8"} />
					</Heading>
					<TextBlock fontSize={14.2} color={"#E7E7E7"} className={"mt-12"} leading={false}>
						Million of devs empower their workflow with crusher
					</TextBlock>

					<div css={overlayContainer} className={"mt-36 pt-32 pl-28 pr-28 pb-60"}>
						<TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-24"} weight={600}>
							Continue with email (LOCALHOST)
						</TextBlock>

						<div className={" mb-72"}>
							<div>
								<Input
									className="bg"
									autoComplete={"email"}
									value={email.value}
									onChange={emailChange}
									placeholder={"Enter email"}
									isError={email.error}
									onReturn={onLogin.bind(this)}
									onBlur={verifyInfo.bind(this, false)}
								/>
								<div className={"mt-4 mb-5 text-11"} css={errorState}>
									{email.error}
								</div>
							</div>
							<div className="">
								<Input
									autoComplete={"password"}
									value={password.value}
									placeholder={"Enter your password"}
									type={"password"}
									onChange={passwordChange}
									onKeyUp={loginOnEnter}
									isError={password.error}
									onBlur={verifyInfo.bind(this, false)}
									onReturn={onLogin.bind(this)}
								/>
								<div className={"mt-4 mb-5 text-11"} css={errorState}>
									{password.error}
								</div>
							</div>
							<Button
								disabled={loading}
								className={"flex items-center justify-center mt-30"}
								css={css(`
									width: 100%;
									height: 38px;
									font-weight: 400;
                                    background:#905CFF;

								`)}
								size={"large"}
								onClick={onLogin}
							>
								<div className={"flex justify-center items-center"}>
									<Conditional showIf={!loading}>
										<Text fontSize={14} weight={600}>
											Login
										</Text>
									</Conditional>
									<Conditional showIf={loading}>
										<span>
											{" "}
											<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
										</span>
										<Text fontSize={14} weight={600} className={"ml-8"}>
											Loading
										</Text>
									</Conditional>
								</div>
							</Button>
						</div>
						<div className="flex items-center justify-between">
							<Text onClick={goBackHandler} css={underLineonHover} fontSize={12}>
								Go back
							</Text>
							<Text onClick={() => router.push("/forgot_password")} css={underLineonHover} fontSize={12}>
								Forgot Password
							</Text>
						</div>
					</div>
					<div onClick={() => router.push("/signup")} className="flex w-full justify-center mt-40">
						<Text color={"#9692FF"} fontSize={14} css={underLineonHover}>
							Create an account
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

const errorState = css`
	color: #ff4583;
	height: 12rem;
	width: 100%;
`;

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;
