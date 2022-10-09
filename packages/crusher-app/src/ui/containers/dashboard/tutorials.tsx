import { css } from "@emotion/react";
import React from "react";

import { GithubSVG } from "@svg/social";

export const onboardingTutorial = [
	{ img: "https://i.imgur.com/S7f2pE0.png", link: "https://www.loom.com/share/5064393d6ceb444d8db6735e9b93b240?sharedAppSource=personal_library" },
	{ img: "https://i.imgur.com/Ma29pAr.png", link: "https://www.loom.com/share/1919d5ee34a4458a8e81e3c7b1dda602" },
	{ img: "https://i.imgur.com/gmaQQ3H.png", link: "https://www.loom.com/share/83cd48574f8a4919b019895ac37e9469" },
];
function VideoComponent() {
	return (
		<>
			{onboardingTutorial.map(({ img, link }) => (
				<a href={link} target={"_blank"}>
					<div className={"ml-12 mr-12"}>
						<div css={video}>
							<img src={img} height={"100%"} />
						</div>
						{/*<div className={'text-15 font-600 leading-none mt-16'}>How to Create test</div>*/}
					</div>
				</a>
			))}
		</>
	);
}

export const OnBoardingTutorialVideo = () => {
	return (
		<>
			<div className="font-cera text-16 font-bold font-600">Watch videos aimed to help you integrate testing</div>
			<div className="mt-8 text-12.5">It’ll hardly take 5 seconds</div>
			<div className={"flex flex-row items-center mt-32 mb-40"} css={footerContainerStyle}>
				<div className={"flex flex-wrap text-14 px-8"} css={footerPlaceholderStyle}>
					<VideoComponent />

					<div className={"ml-40 mr-20"}>
						<div className={"text-14 font-700 leading-none mt-16 mb-16 "} id={"support-tagline"}>
							Join community 💓
						</div>
						<a target={"_blank"} href={"https://github.com/crusherdev/crusher"}>
							<div css={navLink} className={"flex items-center text-13 mt-4 leading-none"}>
								<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Star us on Github</span>
							</div>
						</a>
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
	opacity: 0.9;

	:hover img {
		border: 1px solid #cd60ff;
	}

	img {
		border-radius: 6px;
		border: 1px solid #191e25;
	}
`;

const footerContainerStyle = css`
	border: 1rem solid #191e25;

	border-radius: 4rem;
	padding: 32rem 8rem;
`;
const footerPlaceholderStyle = css`
	color: rgba(255, 255, 255, 0.6);

	#support-tagline {
		color: rgba(255, 255, 255, 1);
	}
`;
