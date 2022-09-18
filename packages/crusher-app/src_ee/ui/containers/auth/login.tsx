import { css } from "@emotion/react";
import { loadUserDataAndRedirect } from "@hooks/user";
import { getGithubLoginURL } from "@utils/core/external";
import { Button, Input } from "dyson/src/components/atoms";

import { Text } from "dyson/src/components/atoms/text/Text";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Conditional } from "dyson/src/components/layouts";
import { validateEmail, validatePassword } from "@utils/common/validationUtils";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { LoadingSVG } from "@svg/dashboard";
import BaseContainer from "./components/BaseContainer";

const GitlabSVG = (props: any) => (
	<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path fillRule="evenodd" clipRule="evenodd" d="m8.001 15.37 2.946-9.07H5.055l2.946 9.07Z" fill="#E24329" />
		<path fillRule="evenodd" clipRule="evenodd" d="M8 15.37 5.056 6.3H.925l7.076 9.07Z" fill="#FC6D26" />
		<path fillRule="evenodd" clipRule="evenodd" d="M.926 6.3.03 9.058a.61.61 0 0 0 .221.682l7.749 5.63L.926 6.3Z" fill="#FCA326" />
		<path fillRule="evenodd" clipRule="evenodd" d="M.926 6.3h4.129L3.28.842a.305.305 0 0 0-.58 0L.926 6.3Z" fill="#E24329" />
		<path fillRule="evenodd" clipRule="evenodd" d="m8 15.37 2.946-9.07h4.129L8 15.37Z" fill="#FC6D26" />
		<path fillRule="evenodd" clipRule="evenodd" d="m15.075 6.3.895 2.755a.61.61 0 0 1-.222.682L8 15.37 15.075 6.3Z" fill="#FCA326" />
		<path fillRule="evenodd" clipRule="evenodd" d="M15.074 6.3h-4.13L12.72.839a.305.305 0 0 1 .58 0L15.074 6.3Z" fill="#E24329" />
	</svg>
);

function EmailIcon(props: any) {
	return (
		<svg width={12} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g clipPath="url(#prefix__clip0_7467_5625)">
				<path
					d="M8.58 10.97a.472.472 0 01-.282.58c-.871.333-1.686.45-2.746.45C2.69 12 .172 9.948.172 6.569.173 3.052 2.726 0 6.623 0c3.033 0 5.206 2.086 5.206 4.983 0 2.517-1.414 4.103-3.276 4.103-.81 0-1.397-.414-1.483-1.328h-.034c-.534.88-1.31 1.328-2.224 1.328-1.121 0-1.93-.827-1.93-2.241 0-2.104 1.55-4.017 4.033-4.017.455 0 .946.068 1.36.174.4.103.653.492.587.9L8.45 6.448c-.172 1.017-.052 1.483.43 1.5.742.018 1.673-.93 1.673-2.913 0-2.242-1.448-3.983-4.12-3.983-2.638 0-4.949 2.069-4.949 5.362 0 2.88 1.845 4.517 4.414 4.517.668 0 1.367-.11 1.966-.321a.557.557 0 01.717.36zM7.15 4.411a.166.166 0 00-.133-.188 2.051 2.051 0 00-.379-.034c-1.138 0-2.034 1.12-2.034 2.448 0 .655.293 1.069.862 1.069.638 0 1.31-.81 1.466-1.81l.219-1.485z"
					fill="#CDCDCD"
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0_7467_5625">
					<path fill="#fff" d="M0 0h12v12H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

function BackIcon(props: any) {
	return (
		<svg width={11} height={9} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M10.08 3.75H2.46l2.37-2.47a.772.772 0 000-1.06.704.704 0 00-1.017 0l-3.6 3.75a.772.772 0 000 1.06l3.6 3.75a.7.7 0 001.018 0 .772.772 0 000-1.06L2.459 5.25h3.254l4.368-.05c.397 0 .72-.286.72-.7s-.323-.75-.72-.75z"
				fill="#424242"
			/>
		</svg>
	);
}

const emailLogin = (email: string, password: string) => {
	return backendRequest("/users/actions/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

export const GithubSVG = function (props: any) {
	return (
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M8 0a8 8 0 0 0-2.529 15.591c.4.074.529-.174.529-.384v-1.49c-2.225.484-2.689-.944-2.689-.944-.364-.924-.888-1.17-.888-1.17-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.713 1.223 1.871.87 2.328.665.071-.517.279-.87.508-1.07-1.777-.203-3.645-.889-3.645-3.953 0-.874.313-1.588.824-2.148-.082-.202-.356-1.016.078-2.117 0 0 .672-.215 2.201.82A7.673 7.673 0 0 1 8 3.868c.68.004 1.365.093 2.004.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.161 1.916.079 2.117.513.56.823 1.274.823 2.148 0 3.072-1.871 3.749-3.653 3.947.287.248.549.735.549 1.481v2.196c0 .212.128.462.534.384A8.002 8.002 0 0 0 8 0Z"
				fill="#fff"
			/>
		</svg>
	);
};

export default function Login() {
	const router = useRouter();
	const { query } = router;

	const emailRef = useRef();
	const passwordRef = useRef();

	const [emailState, setEmailState] = useState(0); // - for email and 1 for password
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

	const goToPasswordState = () => {
		if (!validateEmail(email.value)) {
			setEmail({ ...email, error: "Please enter a valid email" });
			return;
		}
		setEmail({ ...email, error: null });
		setEmailState(1);
		requestAnimationFrame(() => {
			passwordRef?.current?.focus();
		});
	};

	const goBackToEmail = () => {
		setEmail({ ...email, error: null });
		setPassword({ ...password, error: null });
		setEmailState(0);
		requestAnimationFrame(() => {
			emailRef?.current?.focus();
		});
	};

	const onLogin = async () => {
		verifyInfo(true);
		if (!validatePassword(password.value)) return;
		setLoading(true);
		try {
			const { systemInfo } = await emailLogin(email.value, password.value);
			setData(systemInfo);
			router.push("/projects");
		} catch (e: any) {
			setPassword({ ...password, error: "Please enter valid email and password" });
		}
		setLoading(false);
	};

	loadUserDataAndRedirect({ fetchData: false, userAndSystemData: data });

	const showUniversalError = email.error || password.error;

	useEffect(() => {
		emailRef?.current?.focus();
	}, []);

	return (
		<BaseContainer>
			<div css={overlayContainer} className={"mt-56 pb-60"}>
				<div className={"mb-42"}>
					<Link href={getGithubLoginURL(query?.inviteType?.toString(), query?.inviteCode?.toString(), null)}>
						<NewButton svg={<GithubSVG className="mr-12" />} text={"Login with Github"} css={purpleButton} />
					</Link>

					{/* <div className="mt-12">
								<Link href={getGithubLoginURL(query?.inviteType?.toString(), query?.inviteCode?.toString(), null)}>
									<NewButton svg={<GitlabSVG className="mr-12" />} text={"Login with Gitlab"} />
								</Link>
							</div> */}

					<Line />

					<Conditional showIf={emailState === 0}>
						<Input
							className="bg"
							autoComplete={"email"}
							value={email.value}
							initialValue={email.value}
							onChange={emailChange}
							placeholder={"Enter email"}
							isError={email.error}
							css={newInputBoxCSS}
							ref={emailRef}
							onReturn={goToPasswordState.bind(this)}
							rightIcon={<EmailIcon />}
						/>

						<NewButton className={"mt-16"} onClick={goToPasswordState.bind(this)}>
							<Text fontSize={14} weight={600} className={"pt-2"}>
								Next
							</Text>
						</NewButton>
					</Conditional>

					<Conditional showIf={emailState === 1}>
						<Input
							className="bg"
							autoComplete={"password"}
							value={password.value}
							onChange={passwordChange}
							placeholder={"Enter password"}
							type={"password"}
							isError={password.error}
							css={newInputBoxCSS}
							onReturn={onLogin.bind(this)}
							ref={passwordRef}
							leftIcon={
								<div className="mt-1 p-10" onClick={goBackToEmail.bind(this)} css={onHoverBack}>
									<BackIcon />
								</div>
							}
						/>

						<NewButton disabled={loading} svg={null} className={"mt-16 flex items-center justify-center"} onClick={onLogin.bind(this)}>
							<Conditional showIf={!loading}>
								<Text fontSize={14} weight={600}>
									Login
								</Text>
							</Conditional>
							<Conditional showIf={loading}>
								<div className="flex">
									<LoadingSVG color={"#fff"} height={"16rem"} width={"16rem"} />
									<Text fontSize={14} weight={600} className={"ml-8"}>
										Loading
									</Text>
								</div>
							</Conditional>
						</NewButton>
					</Conditional>
				</div>
				<div className="flex w-full justify-center">
					<Link href={"/forgot_password"}>
						<Text css={[underLineonHover, helpCSS]} fontSize={14}>
							Forgot password?
						</Text>
					</Link>
				</div>

				<div css={[error, showUniversalError || dontShow]} className="flex w-full items-center pl-16 mt-80 pt-2">
					{email.error || password.error}
				</div>
			</div>

			<div onClick={() => router.push("/signup")} className="flex w-full justify-center mt-20">
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
					Have an account?{" "}
					<span
						css={css`
							color: #855aff;
						`}
					>
						Signup
					</span>
				</Text>
			</div>
		</BaseContainer>
	);
}

const onHoverBack = css`
	:hover {
		path {
			fill: white;
		}
	}
`;

const dontShow = css`
	visibility: hidden;
`;
const error = css`
	height: 36rem;

	background: linear-gradient(0deg, rgba(255, 113, 224, 0.02), rgba(255, 113, 224, 0.02)), rgba(16, 14, 16, 0.2);
	border-radius: 10rem;

	border: 0.5rem solid #ff4583;
	width: 100%;

	color: #ff71ac;
`;

export const newInputBoxCSS = css`
	input {
		background: transparent;
		border: 0.5px solid rgba(56, 56, 56, 0.6);
		border-radius: 10rem;
		font-weight: 500;
		:focus {
			background: #121316;
			border: 1px solid #ae47ff;
			border-color: #ae47ff;
		}
		::placeholder {
			color: #808080;
		}
		:hover {
			box-shadow: 0px 0px 0px 3px rgba(28, 28, 28, 0.72);
		}
	}

	@-webkit-keyframes autofill {
		0%,
		100% {
			color: #666;
			background: transparent;
		}
	}

	input:-webkit-autofill {
		-webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
		-webkit-animation-name: autofill;
		-webkit-animation-fill-mode: both;
	}
`;
const helpCSS = css`
	color: #565657;
`;

const overlayContainer = css(`
	width: 368rem;
`);

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;

const githubButtonCSS = css(`
width: 100%;
height: 44rem;
font-weight: 400;


`);

export const purpleButton = css`
	background: linear-gradient(0deg, rgba(11, 11, 13, 0.06), rgba(11, 11, 13, 0.06)), linear-gradient(219.19deg, #9c44f3 23.83%, #902be0 78.16%);
	:hover {
		background: linear-gradient(0deg, rgba(11, 11, 13, 0.06), rgba(11, 11, 13, 0.06)), linear-gradient(219.19deg, #9c44f3 23.83%, #902be0 78.16%);
		filter: brightness(0.75);
	}
`;

const newButtonCSS = css`
	border-radius: 10rem;

	background: #191919;
	border: 0.5px solid rgba(56, 56, 56, 0.35);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0) !important;

	:hover {
		background: #202020;
		border: 0.5px solid rgba(56, 56, 56, 0.35);
		filter: brightness(100%);
	}

	:focus {
		outline: 1px solid #ae47ff;
	}
`;

export function NewButton({ svg, text, children, className = "", ...props }: any) {
	return (
		<Button className={`flex items-center justify-center ${className}`} css={[githubButtonCSS, newButtonCSS, props.css]} {...props}>
			{svg}
			<Text className={"mt-2"} fontSize={14} weight={600}>
				{text || children}
			</Text>
		</Button>
	);
}

export function Line() {
	return (
		<>
			<div className="or-container mt-22 mb-24">
				<div className="line" />
				<span className="or-text">
					<span>or</span>
				</span>
				<div className="line" />
			</div>
			<style jsx>
				{`
					.or-container {
						display: flex;

						max-width: 364px;

						align-items: center;

						gap: 8rem;
					}
					.line {
						width: auto;
						min-height: 1px;
						position: relative;
						background: rgba(217, 217, 217, 0.04);
						flex-grow: 1;
						box-sizing: border-box;
						border-color: transparent;
						margin-right: 7px;
						margin-bottom: 0;
					}
					.or-text {
						color: rgba(85, 85, 87, 1);
						width: 12px;
						height: auto;
						font-size: 12.800000190734863px;
						align-self: auto;
						font-style: Regular;
						text-align: left;
						font-family: Gilroy;
						font-weight: 400;
						line-height: normal;
						font-stretch: normal;
						margin-right: 7px;
						margin-bottom: 0;
						text-decoration: none;
					}
				`}
			</style>
		</>
	);
}
