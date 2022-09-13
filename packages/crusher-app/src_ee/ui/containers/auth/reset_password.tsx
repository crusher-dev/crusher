import { Input } from "dyson/src/components/atoms";

import { useCallback, useState } from "react";
import { validatePassword } from "@utils/common/validationUtils";
import { backendRequest } from "@utils/common/backendRequest";
import { loadUserDataAndRedirect } from "@hooks/user";
import { getBoolean } from "@utils/common";

import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { useRouter } from "next/router";

import { LoginNavBar } from "@ui/containers/common/login/navbar";
import React from "react";
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";
import { LoadingSVG } from "@svg/dashboard";
import { RequestMethod } from "@types/RequestOptions";
import BaseContainer from "./components/BaseContainer";
import { NewButton, newInputBoxCSS } from "./login";

const resetPasswordRequest = (token: string, password: string) => {
	return backendRequest("/users/actions/reset_password", {
		method: RequestMethod.POST,
		payload: { token, password },
	});
};

export const GithubSVG = function (props) {
	return (
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 0a8 8 0 0 0-2.529 15.591c.4.074.529-.174.529-.384v-1.49c-2.225.484-2.689-.944-2.689-.944-.364-.924-.888-1.17-.888-1.17-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.713 1.223 1.871.87 2.328.665.071-.517.279-.87.508-1.07-1.777-.203-3.645-.889-3.645-3.953 0-.874.313-1.588.824-2.148-.082-.202-.356-1.016.078-2.117 0 0 .672-.215 2.201.82A7.673 7.673 0 0 1 8 3.868c.68.004 1.365.093 2.004.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.161 1.916.079 2.117.513.56.823 1.274.823 2.148 0 3.072-1.871 3.749-3.653 3.947.287.248.549.735.549 1.481v2.196c0 .212.128.462.534.384A8.002 8.002 0 0 0 8 0Z"
				fill="#fff"
			/>
		</svg>
	);
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

	const onEnter = (event: any) => {
		if (event.key === "Enter") {
			submitForm();
		}
	};

	loadUserDataAndRedirect({ fetchData: false, userAndSystemData: data });
	return (
		<BaseContainer>
			<div css={overlayContainer} className={"mt-32"}>
				<div className={"mb-42"}>
					<Conditional showIf={!query?.token}>
						<div className="text-18 font-extrabold my-50 font-700 text-center">Invalid Token</div>
					</Conditional>
					<Conditional showIf={Boolean(query?.token)}>
						<div css={overlayContainer} className={"mt-32"}>
							<TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-24"} weight={600}>
								Reset your password
							</TextBlock>

							<div className={" mb-72"}>
								<div className="mt-20">
									<Input
										className="md-20 bg"
										value={password.value}
										placeholder={"Enter new password"}
										type={"password"}
										onChange={passwordChange}
										isError={password.error}
										onBlur={verifyInfo}
										css={newInputBoxCSS}
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
										placeholder={"Confirm new password"}
										type={"password"}
										onChange={confirmPasswordChange}
										onKeyDown={onEnter}
										isError={confirmPassword.error}
										onBlur={verifyInfo}
										css={newInputBoxCSS}
									/>
									<Conditional showIf={getBoolean(confirmPassword.error)}>
										<div className={"mt-8 text-12"} css={errorState}>
											{confirmPassword.error}
										</div>
									</Conditional>
								</div>
								<NewButton className={"flex items-center justify-center mt-30"} onClick={submitForm}>
									<div className={"flex justify-center items-center"}>
										<Conditional showIf={!loading}>Change Password</Conditional>
										<Conditional showIf={loading}>
											<span>
												{" "}
												<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
											</span>
											<span className={"mt-2 ml-8"}>Processing</span>
										</Conditional>
									</div>
								</NewButton>
							</div>
						</div>
					</Conditional>
				</div>
				<div className="flex w-full justify-center">
					<Text css={[underLineonHover, helpCSS]} fontSize={14}>
						Need help?
					</Text>
				</div>
			</div>
		</BaseContainer>
	);
}

const errorState = css``;

const helpCSS = css`
	color: #565657;
`;

const overlayContainer = css(`
	width: 372rem;
`);

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;
