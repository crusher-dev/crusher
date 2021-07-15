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

const emailLogin = (email,password)=>{
	return backendRequest("/user/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	})
}

function EmailPasswordBox({ setShowBox, isSignup=false }) {

	const [email,setEmail] = useState({value: "",error:null});
	const [password, setPassword] = useState({value: "",error:null})


	const emailChange = (e)=>{setEmail({...email,value: e.target.value})};
	const passwordChange =  (e)=>{setPassword({...password,value: e.target.value})};

	const verifyEmailAndPass = ({isSignupVerify=false})=>{
		if(email.value || isSignupVerify){
			setEmail({...email, error: "Please enter valid email"})
		}
		if(password.value || isSignupVerify){
			setPassword({...password, error: "Please enter a password"})
		}

	}

	const onLoginOrSignupClick = ()=>{
		verifyEmailAndPass({isSignupVerify:true})
		emailLogin(email,password).then((res)=>{
			console.log(res)
		})
	}


	return (
		<div css={[loginBox]}>
			<div className={"mb-12"}>
				<Input value={email.value} placeholder={"Enter email"} onChange={emailChange} isError={email.error} onBlur={verifyEmailAndPass}/>
				<Conditional showIf={email.error}>
					<div className={"mt-8 text-12"} css={errorState}>{email.error}</div>
				</Conditional>
			</div>

			<div className={"mb-20"}>
				<Input  value={password.value} placeholder={"Enter your password"} type={"password"} onChange={passwordChange} isError={password.error} onBlur={verifyEmailAndPass}/>
				<Conditional showIf={password.error}>
					<div className={"mt-8 text-12"} css={errorState}>{password.error}</div>
				</Conditional>
			</div>

				<Button size={"large"} className={"mb-20"} onClick={onLoginOrSignupClick}>
					<div className={"flex justify-center items-center"}>
						<span className={"mt-2"}>Login</span>
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
