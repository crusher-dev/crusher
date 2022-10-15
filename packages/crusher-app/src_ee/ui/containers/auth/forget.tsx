import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import React from "react";

import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Input } from "dyson/src/components/atoms/input/Input";
import { Text } from "dyson/src/components/atoms/text/Text";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts/Conditional/Conditional";

import { LoadingSVG } from "@svg/dashboard";
import { RequestMethod } from "@types/RequestOptions";
import { LoginNavBar } from "@ui/containers/common/login/navbar";
import { backendRequest } from "@utils/common/backendRequest";
import { validateEmail } from "@utils/common/validationUtils";

import BaseContainer from "./components/BaseContainer";
import { NewButton, newInputBoxCSS } from "./login";

const forgotPassword = (email: string) => {
	return backendRequest("/users/actions/forgot_password", {
		method: RequestMethod.POST,
		payload: { email },
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

export default function ForgotPassword() {
	const router = useRouter();
	const [email, setEmail] = useState({ value: "", error: null });
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);

	const emailChange = (event: any) => {
		setEmail({ error: null, value: event.target.value });
	};

	const onEnter = (event: any): void | Promise => {
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
			console.log(status);
		} catch (e: any) {
			if (e.message === "USER_NOT_EXISTS") {
				alert("Email not registered");
			} else {
				alert("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	}, [email.value]);

	return (
		<BaseContainer>
			<div css={overlayContainer} className={"mt-32"}>
				<div className={" mb-42"}>
					<Conditional showIf={data && !loading}>
						<TextBlock fontSize={15} className="text-17 text-center mt-48">Please check your email</TextBlock>
					</Conditional>
					<Conditional showIf={!data}>
						<div css={overlayContainer} className={"mt-32"}>
							<TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-12"}>
								Reset your password
							</TextBlock>

							<div className={" mb-72"}>
								<div className="mt-20">
									<Input
										className="md-20 bg"
										value={email.value}
										onChange={emailChange}
										placeholder={"Enter email"}
										isError={email.error}
										onBlur={verifyInfo.bind(this, false)}
										onKeyUp={onEnter}
										css={newInputBoxCSS}
									/>
									<Conditional showIf={email.error}>
										<div className={"mt-8 text-12"} css={errorState}>
											{email.error}
										</div>
									</Conditional>
								</div>
								<NewButton className={"flex items-center justify-center mt-16"} onClick={onSubmit}>
									<div className={"flex justify-center items-center"}>
										<Conditional showIf={!loading}>
											<Text fontSize={14} weight={600}>
												Send reset link
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
								</NewButton>
							</div>
						</div>
					</Conditional>
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
					Or go back to{" "}
					<span
						css={css`
							color: #855aff;
							margin-left: 3px;
						`}
					>
						Login
					</span>
				</Text>
			</div>
		</BaseContainer>
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
	width: 368rem;
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
