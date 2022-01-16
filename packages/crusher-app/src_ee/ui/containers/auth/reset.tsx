import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { useRouter } from "next/router";
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";
import { LoadingSVG } from "@svg/dashboard";
import { useCallback, useState } from "react";
import { validatePassword } from "@utils/common/validationUtils";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { loadUserDataAndRedirect } from "@hooks/user";
import { getBoolean } from "@utils/common";

const RocketImage = (props) => (
	<img
		{...props}
		src={
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJBSURBVHgBndJNSJNxHAfw77ZnPcu5Cb4u3yrnzMhMxQyLOnRQC0yJ9NBFSjHo0k0yIuhSmNClCJUOlpGHDpUkmka+5NSp0Wh7Njc3n/a4ILH26rO5t+efGXWaFX3P38/l9/sC/xnRvxbbOjoUyozy0kBUdCzgX3/9V9ja2io9W3O63UsltLz3yXNo1T4YtLN2yZ/QpE5XQDPWye4nTxvSx0aTKpvqUZgFvJxiV8Tbob6+vqP+Ce1Cz9R04QTzEYrkJBTlZcPD2uCxvhuNCzuLy07yGQf651b9ijO8F90aDaovNcNiYTA8NBxJ8OsfUb/KvkzVBXg8u1YIUfXmV1weN/ISWXoxGrtO4KA6G1bWjumpGTCmpTsL49PGLejLT2umvb6H4dgGFiHFiFiFRD6II0UliAoGmPVa6BkOM7Pz8zYHe/eHocj1HHXYFeykXCFwTnhGuBTZ3pIymWZ3Eg6/7cVAmMYnrxMSj8PImJfrvjrMri0YruDvUztiYmGN/nazJ/Mqu7/03vHEIJTd7eiXZ2FOkIOsfXnBuwwXvRzn/n0IQn6OgHt8qNphqmXPN9WRc8oE0pWbFm1JySODO5XLDUD8t324hhKBq4qG3LfJgwY1GaqRDeoU1PNVMYhbhFfxjJhszk5TntojUsoldt1nVJ4SZnJpLKjFsXp6syCIYI8LLbXYI9kIFkUYW1SJgbGlIbaqIC8clCrIegS4kSLgSjxI8RlIhlR0yzW2+IaxRAyNz8C726SmQGqoJssJLbbJd0nz9aMpv90CAAAAAElFTkSuQmCC"
		}
	/>
);

const resetPasswordRequest = (token: string, password: string) => {
	return backendRequest("/users/actions/reset_password", {
		method: RequestMethod.POST,
		payload: { token, password },
	});
};

const forgotPassword = (email: string) => {
	return backendRequest("/users/actions/forgot_password", {
		method: RequestMethod.POST,
		payload: { email },
	});
};
export default function Signup() {
	const router = useRouter();
	const [data, setData] = useState(null);

	const [password, setPassword] = useState({ value: "", error: "" });
	const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
	const [loading, setLoading] = useState(false);
	const { query, push } = useRouter();

	const confirmPasswordChange = useCallback(
		(e) => {
			setConfirmPassword({ ...confirmPassword, value: e.target.value });
		},
		[confirmPassword.value],
	);
	const passwordChange = useCallback(
		(e) => {
			setPassword({ ...password, value: e.target.value });
		},
		[password.value],
	);

	const verifyInfo = (completeVerify = false) => {
		const shouldValidatePassword = completeVerify || password.value;
		const shouldValidateConfirmPassword = completeVerify || confirmPassword.value;

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter valid password" });
		} else setPassword({ ...password, error: "" });

		if (!validatePassword(confirmPassword.value) && shouldValidateConfirmPassword) {
			setConfirmPassword({ ...confirmPassword, error: "Please enter a password with length > 4" });
		} else setConfirmPassword({ ...confirmPassword, error: "" });

		if (password.value !== confirmPassword.value && completeVerify) {
			setConfirmPassword({ ...confirmPassword, error: "Please enter same password" });
		} else setConfirmPassword({ ...confirmPassword, error: "" });
	};

	const submitForm = async () => {
		verifyInfo(true);
		if (!validatePassword(password.value) || !validatePassword(confirmPassword.value)) return;
		setLoading(true);
		try {
			const { systemInfo } = await resetPasswordRequest(query?.token?.toString(), confirmPassword.value);
			setData(systemInfo);
			push("/app/dashboard");
		} catch (e: any) {
			console.log(e);
			alert(e.message === "USER_EMAIL_NOT_AVAILABLE" ? "User not found" : "Some error occurred while registering");
		}
		setLoading(false);
	};

	const onEnter = useCallback((event: any) => {
		if (event.key === "Enter") {
			submitForm();
		}
	}, []);

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
					<Conditional showIf={!query?.token}>
						<div className="text-32 font-extrabold my-50">Invalid Token</div>;
					</Conditional>
					<Conditional showIf={Boolean(query?.token)}>
						<div css={overlayContainer} className={"mt-36 pt-36 pl-28 pr-28"}>
							<TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-24"} weight={600}>
								Reset your password
							</TextBlock>

							<div className={" mb-72"}>
								<div className="mt-20">
									<Input
										className="md-20 bg"
										value={password.value}
										placeholder={"Enter your password"}
										type={"password"}
										onChange={passwordChange}
										isError={password.error}
										onBlur={verifyInfo}
									/>
									<Conditional showIf={getBoolean(password.error)}>
										<div className={"mt-8 text-12"} css={errorState}>
											{password.error}
										</div>
									</Conditional>
								</div>
								<div className="mt-20">
									<Input
										className="md-20 bg"
										value={confirmPassword.value}
										placeholder={"Confirm your password"}
										type={"password"}
										onChange={confirmPasswordChange}
										onKeyDown={onEnter}
										isError={confirmPassword.error}
										onBlur={verifyInfo}
									/>
									<Conditional showIf={getBoolean(confirmPassword.error)}>
										<div className={"mt-8 text-12"} css={errorState}>
											{confirmPassword.error}
										</div>
									</Conditional>
								</div>
								<Button
									className={"flex items-center justify-center mt-30"}
									css={css(`
									width: 100%;
									height: 38px;
									font-weight: 400;
                                    background:#905CFF;
								`)}
									onClick={submitForm}
								>
									<div className={"flex justify-center items-center"}>
										<Conditional showIf={!loading}>
											<Text fontSize={14} weight={900}>
												Change Password
											</Text>
										</Conditional>
										<Conditional showIf={loading}>
											<span>
												{" "}
												<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
											</span>
											<span className={"mt-2 ml-8"}>Processing</span>
										</Conditional>
									</div>
								</Button>
							</div>
						</div>
					</Conditional>

					<div onClick={() => router.push("/login")} className="flex w-full justify-center mt-40">
						<Text color={"#9692FF"} fontSize={14}>
							or go back
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
	width: 400rem;
	min-height: 200px;
`);
const errorState = css`
	color: #ff4583;
`;
