import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { Input } from "dyson/src/components/atoms";
import { Button, Logo } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";

import { loadUserDataAndRedirect } from "@hooks/user";
import { LoadingSVG } from "@svg/dashboard";
import { RequestMethod } from "@types/RequestOptions";
import { getBoolean } from "@utils/common";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI } from "@utils/common/url";
import { validatePassword } from "@utils/common/validationUtils";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

const resetPasswordRequest = (token: string, password: string) => {
	return backendRequest("/users/actions/reset_password", {
		method: RequestMethod.POST,
		payload: { token, password },
	});
};

function EmailPasswordBox() {
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
			push("/app/projects");
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
		<div css={loginBoxlarge}>
			<div className={"mb-20"}>
				<Input
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
			<div className={"mb-20"}>
				<Input
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

			<Button size={"large"} className={"mb-20"} onClick={submitForm} disabled={loading}>
				<div className={"flex justify-center items-center"}>
					<Conditional showIf={!loading}>
						<span className={"mt-2"}>Change Password</span>
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
			<div
				className="text-13 underline text-center"
				onClick={useCallback(() => {
					push("/login");
				}, [])}
			>
				Go back
			</div>
		</div>
	);
}

export const ResetPasswordContainer = () => {
	const { query } = useRouter();

	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<Conditional showIf={!query?.token}>
						<span className={"mt-2 text-32"}>Invalid Token</span>
					</Conditional>
					<Conditional showIf={Boolean(query?.token)}>
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
					</Conditional>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const loginBoxlarge = css`
	height: 412rem;
`;

const containerCSS = css`
	max-width: 473rem;
`;

const errorState = css`
	color: #ff4583;
`;

export default ResetPasswordContainer;
