import { css } from "@emotion/react";
import { LoginNavBar } from "@ui/containers/common/login/navbar";
import { getGithubLoginURL } from "@utils/core/external";
import { Button, Input } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Text } from "dyson/src/components/atoms/text/Text";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const GitlabSVG = (props) => (
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

export default function Login({ loginWithEmailHandler }) {
	const router = useRouter();
	const { query } = router;

	const [state, setState] = React.useState("");
	const [email, setEmail] = useState({ value: "", error: null });
	const emailChange = (event: any) => {
		setEmail({ error: null, value: event.target.value });
	};

	const onEnter = (event: any): void | Promise => {
		if (event.key === "Enter") {
			return onSubmit();
		}
	};

	return (
		<div css={containerCSS}>
			<div className="pt-20">
				<LoginNavBar />
			</div>
			<div className={"flex justify-center"}>
				<div
					className={"flex flex-col items-center"}
					css={css`
						margin-top: 95rem;
					`}
				>
					<Heading
						type={1}
						fontSize={24}
						weight={900}
						css={css`
							letter-spacing: 0;
						`}
					>
						Get superpowers to ship{" "}
						<span
							css={css`
								color: #9446dd;
							`}
						>
							fast
						</span>{" "}
						and{" "}
						<span
							css={css`
								color: #9446dd;
								margin-right: 9px;
							`}
						>
							better
						</span>
						<Text fontSize={16}>🚀</Text>
					</Heading>
					<TextBlock fontSize={15} color={"#4D4D4D"} className={"mt-16"} leading={false}>
						Devs use crusher to test website fast, ship fast. Get started in seconds
					</TextBlock>

					<div css={overlayContainer} className={"mt-58 pb-60"}>
						<div className={"mb-42"}>
							<Link href={getGithubLoginURL(query?.inviteType?.toString(), query?.inviteCode?.toString(), null)}>
								<NewButton svg={<GithubSVG className="mr-12" />} text={"Login with Github"} />
							</Link>

							<div className="mt-12">
								<Link href={getGithubLoginURL(query?.inviteType?.toString(), query?.inviteCode?.toString(), null)}>
									<NewButton svg={<GitlabSVG className="mr-12" />} text={"Login with Gitlab"} />
								</Link>
							</div>

							<Line />

							<Input
								className="bg"
								autoComplete={"email"}
								value={email.value}
								onChange={emailChange}
								placeholder={"Enter email"}
								isError={email.error}
								css={newInputBoxCSS}
								// onReturn={onLogin.bind(this)}
								// onBlur={verifyInfo.bind(this, false)}
							/>

							<NewButton svg={null} text={"login"} className={"mt-16"} />
						</div>
						<div className="flex w-full justify-center">
							<Text css={[underLineonHover, helpCSS]} fontSize={14}>
								Need help?
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
				</div>
			</div>
		</div>
	);
}

const newInputBoxCSS = css`
	input {
		background: transparent;
		border: 0.5px solid rgba(56, 56, 56, 0.6);
		border-radius: 8px;
		font-weight: 500;
		::placeholder {
			color: #808080;
		}
		:hover {
			box-shadow: 0px 0px 0px 3px rgba(28, 28, 28, 0.72);
		}
		:-webkit-autofill {
			background: transparent;
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
const containerCSS = css(`
height: 100vh;
background: linear-gradient(180deg, #0A0A0A 0%, #0A0A0A 100%);
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

const plainButton = css`
	background: #0f0f0f;
`;

const githubButtonCSS = css(`
width: 100%;
height: 44rem;
font-weight: 400;


box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`);

const newButtonCSS = css`
	border-radius: 10rem;

	background: #191919;
	border: 0.5px solid rgba(56, 56, 56, 0.35);

	:hover {
		background: #202020;
		border: 0.5px solid rgba(56, 56, 56, 0.35);
		filter: brightness(100%);
	}
`;

function NewButton({ svg, text, ...props }) {
	return (
		<Button className={"flex items-center justify-center"} css={[githubButtonCSS, newButtonCSS]} {...props}>
			{svg}
			<Text className={"mt-3"} fontSize={14} weight={600}>
				{text}
			</Text>
		</Button>
	);
}

function Line(props) {
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
