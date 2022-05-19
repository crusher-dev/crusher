import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { useRouter } from "next/router";
import Link from "next/link";
import { getGithubLoginURL } from "@utils/core/external";
import { LoginNavBar } from "@ui/containers/common/login/navbar";
import React from "react";
const RocketImage = (props) => (
	<img
		{...props}
		src={
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJBSURBVHgBndJNSJNxHAfw77ZnPcu5Cb4u3yrnzMhMxQyLOnRQC0yJ9NBFSjHo0k0yIuhSmNClCJUOlpGHDpUkmka+5NSp0Wh7Njc3n/a4ILH26rO5t+efGXWaFX3P38/l9/sC/xnRvxbbOjoUyozy0kBUdCzgX3/9V9ja2io9W3O63UsltLz3yXNo1T4YtLN2yZ/QpE5XQDPWye4nTxvSx0aTKpvqUZgFvJxiV8Tbob6+vqP+Ce1Cz9R04QTzEYrkJBTlZcPD2uCxvhuNCzuLy07yGQf651b9ijO8F90aDaovNcNiYTA8NBxJ8OsfUb/KvkzVBXg8u1YIUfXmV1weN/ISWXoxGrtO4KA6G1bWjumpGTCmpTsL49PGLejLT2umvb6H4dgGFiHFiFiFRD6II0UliAoGmPVa6BkOM7Pz8zYHe/eHocj1HHXYFeykXCFwTnhGuBTZ3pIymWZ3Eg6/7cVAmMYnrxMSj8PImJfrvjrMri0YruDvUztiYmGN/nazJ/Mqu7/03vHEIJTd7eiXZ2FOkIOsfXnBuwwXvRzn/n0IQn6OgHt8qNphqmXPN9WRc8oE0pWbFm1JySODO5XLDUD8t324hhKBq4qG3LfJgwY1GaqRDeoU1PNVMYhbhFfxjJhszk5TntojUsoldt1nVJ4SZnJpLKjFsXp6syCIYI8LLbXYI9kIFkUYW1SJgbGlIbaqIC8clCrIegS4kSLgSjxI8RlIhlR0yzW2+IaxRAyNz8C726SmQGqoJssJLbbJd0nz9aMpv90CAAAAAElFTkSuQmCC"
		}
	/>
);
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

	return (
		<div
			css={containerCSS}
		>
			<div className="pt-28">
			<LoginNavBar/>
			</div>
			<div className={"flex justify-center"}>
				<div className={"flex flex-col items-center"} css={css`margin-top:160rem;`}>
					<Heading type={1} fontSize={22} weight={900}>
					Get superpowers to <span css={css`color: #D4EB79;`}>ship fast</span> and <span css={css`color: #8C67F5; margin-right: 12px;`}>better</span>🚀
					</Heading>
					<TextBlock fontSize={14.2} color={"#606060"} className={"mt-16"} css={css`letter-spacing: .2px;`} leading={false}>
					Devs use crusher to test & ship fast with confidence. Get started in seconds
					</TextBlock>

					<div css={overlayContainer} className={"mt-48 pb-60"}>

						<div className={" mb-42"}>
							<Link href={getGithubLoginURL()}>
								<Button
									className={"flex items-center justify-center"}
									css={githubButtonCSS}
								>
									<GithubSVG />{" "}
									<Text className={"ml-10"} fontSize={14} weight={700}>
										Login with Github
									</Text>
								</Button>
							</Link>


							<Button
								onClick={loginWithEmailHandler}
								bgColor={"tertiary-dark"}
								className={"flex items-center justify-center mt-20"}
								css={[buttonCSS,plainButton]}
							>
								<Text fontSize={14} weight={500}>
									Login with Gitlab
								</Text>
							</Button>
						
							<Button
								onClick={loginWithEmailHandler}
								bgColor={"tertiary-dark"}
								className={"flex items-center justify-center mt-20"}
								css={[buttonCSS,plainButton]}
							>
								<Text fontSize={14} weight={500}>
									or with email
								</Text>
							</Button>
						</div>
						<div className="flex w-full justify-center">
							<Text css={[underLineonHover,helpCSS]} fontSize={14}>
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
							Already registered? <span css={css`color: #855AFF;`}>Signup</span>
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}

const helpCSS = css`
color: #565657;
`
const containerCSS = css(`
height: 100vh;
background: #0D0E11;
width: 100vw;
`)

const overlayContainer = css(`
	width: 372rem;
`);

const underLineonHover = css`
	:hover {
		text-decoration: underline;
	}
`;


const plainButton = css`
background: #0F0F0F;
`

const githubButtonCSS = css(`
width: 100%;
height: 44rem;
font-weight: 400;
border-radius: 6rem;

background: linear-gradient(133.85deg, #905CFF 25.39%, #6D55FF 74.5%, #6951FF 74.5%);
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`)

const buttonCSS = css(`
width: 100%;
height: 44rem;
border-radius: 6rem;
`)