import React, { useState } from "react";
import { css } from "@emotion/core";
import { CenterLayout, Conditional } from 'dyson/src/components/layouts';
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";
import { Button, Logo } from "dyson/src/components/atoms";
import { GithubSVG, GoogleSVG } from "@svg/social";
import Link from "next/link";
import { resolvePathToBackendURI } from '@utils/url';
import { Input } from 'dyson/src/components/atoms';
import { backendRequest } from '@utils/backendRequest';
import { RequestMethod } from '@interfaces/RequestOptions';
import { validateEmail, validatePassword } from '@utils/validationUtils';
import { useRouter } from 'next/router';
import { LoadingSVG } from '@svg/dashboard';
import { getUserStatus } from '@utils/user';


const emailLogin = (email,password)=>{
	return backendRequest("/user/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	})
}

function EmailPasswordBox({ setShowBox, isSignup=false }) {
	const router = useRouter();
	const [email,setEmail] = useState({value: "",error:null});
	const [password, setPassword] = useState({value: "",error:null})
	const [processingSignup, setProcessingSignup] = useState(false);

	const emailChange = (e)=>{setEmail({...email,value: e.target.value})};
	const passwordChange =  (e)=>{setPassword({...password,value: e.target.value})};

	const verifyInfo = (completeVerify=false)=>{
		const shouldValidateEmail = completeVerify || email.value;
		const shouldValidatePassword = completeVerify || password.value;
		if (!validateEmail(email.value) && shouldValidateEmail) {
			setEmail({ ...email, error: "Please enter valid email" });
		} else setEmail({ ...email, error: "" });

		if (!validatePassword(password.value) && shouldValidatePassword) {
			setPassword({ ...password, error: "Please enter a password with length > 4" });
		} else setPassword({ ...password, error: "" });

	}

	const onLogin = async ()=>{
		verifyInfo(true)

		if (!validateEmail(email.value) || !validatePassword(password.value)) return;
		setProcessingSignup(true);
		try {
			const data = await emailLogin(email.value, password.value);
			const userStatus = getUserStatus(data);
			if(userStatus !== "USER_NOT_REGISTERED"){
				router.push("/app/dashboard")
			}
		}
		catch (e){
			alert(e)
		}
		setProcessingSignup(false)
	}


	return (
		<div css={[loginBox]}>
			<div className={"mb-12"}>
				<Input value={email.value} placeholder={"Enter email"} onChange={emailChange} isError={email.error} onBlur={verifyInfo.bind(this,true)}/>
				<Conditional showIf={email.error}>
					<div className={"mt-8 text-12"} css={errorState}>{email.error}</div>
				</Conditional>
			</div>

			<div className={"mb-20"}>
				<Input  value={password.value} placeholder={"Enter your password"} type={"password"} onChange={passwordChange} isError={password.error} onBlur={verifyInfo.bind(this,true)}/>
				<Conditional showIf={password.error}>
					<div className={"mt-8 text-12"} css={errorState}>{password.error}</div>
				</Conditional>
			</div>

				<Button size={"large"} className={"mb-20"} onClick={onLogin}>
					<div className={"flex justify-center items-center"}>
						<Conditional showIf={!processingSignup}>
							<span className={"mt-2"}>Login</span>
						</Conditional>
						<Conditional showIf={processingSignup}>
							<span>	<LoadingSVG color={"#fff"} height={16} width={16}/></span><span className={"mt-2 ml-8"}>Processing</span>
						</Conditional>
					</div>
				</Button>
			<div className="text-13 underline text-center" onClick={setShowBox.bind(this, false)}>
				Go back
			</div>
		</div>
	);
}

function EmailBox({type}) {
	const [showBox, setShowBox] = useState(false);

	if (showBox) {
		return <EmailPasswordBox setShowBox={setShowBox} />;
	}

	return (
		<div css={loginBox}>
			<Button
				size={"large"}
				onClick={setShowBox.bind(this, true)}
				css={css`
					font-weight: 500;
				`}
				bgColor={"tertiary-dark"}
			>
				<div className={"flex justify-center items-center"}>
					<span>Continue with Email</span>
				</div>
			</Button>

			<Conditional showIf={type !== "signup" && false}>

				<div
					className={"text-13 leading-none text-center mt-36"}
					css={css`
					color: rgba(255, 255, 255, 0.5);
				`}
				>
					Continue with SAML SSO
				</div>
			</Conditional>

		</div>
	);
}

export const LoginContainer = () => {
	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<div className={"font-cera text-15 leading-none font-500 mb-38"}>Login to your account</div>


					<a href={resolvePathToBackendURI(("/v2/user/authenticate/google"))}>
						<Button size={"large"} css={googleButton} className={"mb-20"}>
							<div className={"flex justify-center items-center"}>
								<GoogleSVG className={"mr-12"} />
								<span className={"mt-2"}>Continue with Google</span>
							</div>
						</Button>
					</a>
					<a href={resolvePathToBackendURI(("/v2/user/authenticate/github"))}>
						<Button
							size={"large"}
							css={css`
							font-weight: 500;
						`}
							bgColor={"tertiary-dark"}
							className={"mb-32"}
						>
							<div className={"flex justify-center items-center"}>
								<GithubSVG className={"mr-12"} />
								<span className={"mt-2"}>Continue with Github</span>
							</div>
						</Button>
					</a>


					<EmailBox  type={"signup"}/>
					<div className={"font-cera text-15 leading-none font-500"}>
						Don't have an account?
						<Link href={"/signup"}>
							<span
								css={css`
								color: #8a96ff;
							`}
								className={"underline ml-8"}
							>
							Signup
						</span>
						</Link>
					</div>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const googleButton = css`
	background-color: #6ea5f9;
	border-color: #4675bd;
	font-weight: 600;
	span {
		font-size: 14rem;
	}

	:hover {
		background-color: #588fe2;
	}
`;

const loginBox = css`
	height: 272rem;
`;

const containerCSS = css`
	max-width: 473rem;
`;

const errorState = css`
  color: #ff4583;
`

export default LoginContainer;
