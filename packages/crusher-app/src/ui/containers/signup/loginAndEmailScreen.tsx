import React, { useState } from "react";
import { css } from "@emotion/core";
import { CenterLayout, Conditional } from 'dyson/src/components/layouts';
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";
import { Button, Logo } from "dyson/src/components/atoms";
import { GithubSVG, GoogleSVG } from "@svg/social";
import Link from "next/link";
import { resolvePathToBackendURI } from '@utils/url';
import { Input } from 'dyson/src/components/atoms';

function EmailPasswordBox({ setShowBox }) {
	return (
		<div css={[loginBox]}>
			<div className={"mb-12"}>
				<Input placeholder={"Enter email"} />
			</div>
			<div className={"mb-20"}>
				<Input placeholder={"Enter email"} type={"password"}/>
			</div>

			<div>
				<Button size={"large"} className={"mb-20"}>
					<div className={"flex justify-center items-center"}>
						<span className={"mt-2"}>Login</span>
					</div>
				</Button>
			</div>
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
					<div className={"font-cera text-15 leading-none font-500 mb-38"}>Log in to Crusher</div>

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

					<EmailBox />
					<div className={"font-cera text-15 leading-none font-500"}>
						No account?
						<Link href={"/signup"}>
							<span
								css={css`
								color: #8a96ff;
							`}
								className={"underline ml-8"}
							>
							Create an account
						</span>
						</Link>
					</div>
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};


export const SignupContainer = () => {
	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<Logo height={"24rem"} className={"mb-24 mt-80"} />
					<div className={"font-cera text-15 leading-none font-500 mb-38"}>Create your account</div>


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
						Already have an account?
						<Link href={"/login"}>
							<span
								css={css`
								color: #8a96ff;
							`}
								className={"underline ml-8"}
							>
							Login
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

export default SignupContainer;
