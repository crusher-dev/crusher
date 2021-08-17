import React from "react";
import { css } from "@emotion/react";
import { GithubSVG } from "@svg/social";

function VideoComponent() {
	return (
		<div className={"ml-20 mr-20"}>
			<div css={video}>
				<img src={"https://i.imgur.com/iDCQoiL.png"} height={"100%"} />
			</div>
			{/*<div className={'text-15 font-600 leading-none mt-16'}>How to Create test</div>*/}
		</div>
	);
}

export const OnBoardingTutorialVideo = () => {
	return (
		<>
			<div className="font-cera text-16 font-bold font-600 mt-96">Watch videos aimed to help you integrate testing</div>
			<div className="mt-4 text-13">It’ll hardly take 5 seconds</div>
			<div className={"flex flex-row items-center mt-32"} css={footerContainerStyle}>
				<div className={"flex flex-wrap text-14"} css={footerPlaceholderStyle}>
					<VideoComponent />
					<VideoComponent />
					<VideoComponent />
					<VideoComponent />
					<VideoComponent />

					<div className={"ml-20 mr-20"}>
						<div className={"text-14 font-700 leading-none mt-16 mb-16 "} id={"support-tagline"}>
							Join community 💓
						</div>
						<a target={"_blank"} href={"https://github.com/crusherdev/crusher"}>
							<div css={navLink} className={"flex items-center text-13 mt-4 leading-none"}>
								<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Star us on Github</span>
							</div>
						</a>
						{/*<a href={"https://crusher.dev"}>*/}
						{/*	<div css={navLink} className={"flex items-center text-13 mt-4 leading-none"}>*/}
						{/*		<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Join discord</span>*/}
						{/*	</div>*/}
						{/*</a>*/}
					</div>
				</div>
			</div>
		</>
	);
};

const navLink = css`
	box-sizing: border-box;
	line-height: 13rem;
	height: 31rem;
	color: rgba(189, 189, 189, 0.8);
	font-weight: 500;

	margin-left: 6px;
	margin-right: 6px;

	:hover {
		color: rgb(231, 231, 231);
	}
`;

const video = css`
	width: 200rem;
	height: 148rem;

	background: #1e242c;
	border: 1px solid #2e3744;
	border-radius: 8px;
	opacity: 0.7;

	:hover img {
		border: 1px solid #647cff;
	}

	img {
		border-radius: 6px;
		border: 1px solid #191e25;
	}
`;

const footerContainerStyle = css`
	border: 1rem solid #191e25;
	min-height: 208rem;
	border-radius: 8rem;
	padding: 12rem 22rem;
`;
const footerPlaceholderStyle = css`
	color: rgba(255, 255, 255, 0.6);

	#support-tagline {
		color: rgba(255, 255, 255, 1);
	}
`;
