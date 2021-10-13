import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useState, useCallback } from "react";
import { Button, Logo } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { CenterLayout, Conditional } from "dyson/src/components/layouts";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { validateEmail } from "@utils/common/validationUtils";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";
import { loadUserDataAndRedirect } from "@hooks/user";
import { RequestMethod } from "@types/RequestOptions";

const forgotPassword = (email: string) => {
	return backendRequest("/users/actions/forgot_password", {
		method: RequestMethod.POST,
		payload: { email },
	});
};

function ForgotPasswordBox() {
	const router = useRouter();
	const [email, setEmail] = useState({ value: "", error: null });
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);

	const emailChange = (event: any) => {
		setEmail({ error: null, value: event.target.value });
	};

	const onEnter = (event: any) => {
		if (event.key === "Enter") {
			return onSubmit();
		}
	};

	const verifyInfo = useCallback(
		(completeVerify = false) => {
			const shouldValidateEmail = completeVerify || email.value;
			if (!validateEmail(email.value) && shouldValidateEmail) {
				setEmail({ ...email, error: "Please enter valid email" });
			} else setEmail({ ...email, error: "" });
		},
		[email.value],
	);

	const onSubmit = useCallback(async () => {
		verifyInfo(true);

		if (!validateEmail(email.value)) return;
		setLoading(true);
		try {
			const { status } = await forgotPassword(email.value);
			setData(status);
		} catch (e: any) {
			if (e.message === "USER_NOT_EXISTS") {
				alert("Please add valid email.");
			} else {
				alert("Something went wrong");
			}
		}
		setLoading(false);
	}, [email.value]);

	if (data) {
		return <div className="text-16 font-extrabold my-50">Please Check your email</div>;
	}

	return (
		<div>
			<div className={"font-cera text-15 leading-none font-500 mt-20 mb-5"}>Reset Password</div>
			<div className=" font-cera text-12 font-light mb-20">We'll send you link to reset password</div>
			<div css={[boxCss]}>
				<div className={"mb-12"}>
					<Input
						autoComplete={"email"}
						value={email.value}
						onChange={emailChange}
						placeholder={"Enter email"}
						isError={email.error}
						onBlur={verifyInfo.bind(this, false)}
						onKeyUp={onEnter}
					/>
					<Conditional showIf={email.error}>
						<div className={"mt-8 text-12"} css={errorState}>
							{email.error}
						</div>
					</Conditional>
				</div>

				<Button size={"large"} className={"mb-20"} onClick={onSubmit}>
					<div className={"flex justify-center items-center"}>
						<Conditional showIf={!loading}>
							<span className={"mt-2"}>Send verification Link</span>
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
				<div className="text-13 underline text-center" onClick={React.useCallback(() => router.push("/login"), [])}>
					Go back
				</div>
			</div>
		</div>
	);
}

export const Container = () => {
	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />

					<ForgotPasswordBox />
					<div className={"font-cera text-15 leading-none font-500"}>
						Don't have an account?
						<a href={"/signup"}>
							<span
								css={css`
									color: #8a96ff;
								`}
								className={"underline ml-8"}
							>
								Signup
							</span>
						</a>
					</div>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const boxCss = css`
	height: 272rem;
`;

const containerCSS = css`
	max-width: 473rem;
`;

const errorState = css`
	color: #ff4583;
`;

export default Container;
