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
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";
import { LoadingSVG } from "@svg/dashboard";
import { LoginNavBar } from "@ui/containers/common/login/navbar";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "@types/RequestOptions";

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
								className={"flex items-center justify-center mt-20"}
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
							New user?{" "}
							<span
								css={css`
									color: #855aff;
								`}
							>
								Signup
							</span>
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

const containerCSS = css(`
height: 100vh;
background: #0D0E11;
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

const errorState = css`
	color: #ff4583;
	height: 12rem;
	width: 100%;
`;
