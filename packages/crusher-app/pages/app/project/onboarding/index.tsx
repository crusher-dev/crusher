import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import { getUserInfo } from "@redux/stateUtils/user";
import { useEffect, useState } from "react";
import fire from "../../../../../crusher-shared/config/fire-config";

function Onboarding() {
	const userInfo = useSelector(getUserInfo);

	const [watchIntroVideo, setWatchIntroVideo] = useState(false);
	const [create2tests, setCreate2tests] = useState(false);
	const [reviewReports, setReviewReports] = useState(false);
	const [integrate, setIntegrate] = useState(false);
	const [inviteTeamMembers, setInviteTeamMembers] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				let userRef = await fire
					.firestore()
					.collection("onboarding")
                    .doc(`${userInfo.id}`);
				let userData = await (await userRef.get()).data();
				setWatchIntroVideo(userData.watchIntroVideo || false);
				setCreate2tests(userData.create2tests || false);
				setReviewReports(userData.reviewReports || false);
				setIntegrate(userData.integrate || false);
				setInviteTeamMembers(userData.inviteTeamMembers || false);
			} catch (err) {
				fire
					.firestore()
					.collection("onboarding")
					.doc(`${userInfo.id}`)
					.update({
						watchIntroVideo: false,
						create2tests: false,
						reviewReports: false,
						integrate: false,
                        inviteTeamMembers: false,
                        totalNumberOfTests: 0
					});
				console.error(err);
			}
		})();
	}, []);

	return (
		<div css={containerCSS}>
			<div>
				<p css={deployFastCSS}>
					<span css={{ color: "#FF4090" }}>Deploy fast</span> with Crusher
				</p>

				<p
					css={{
						color: "#2B2B39",
						fontFamily: "Gilroy",
						fontSize: "1.75rem",
						lineHeight: "2rem",
						fontWeight: "bold",
						marginLeft: "1rem",
						marginTop: "0rem",
						marginBottom: "2rem",
					}}
				>
					Let's get you started with Crusher
				</p>
			</div>
			<div css={[stepsCSS, watchIntroVideo ? doneCSS : null]}>
				<span css={spanCSS}>
					{watchIntroVideo ? returnGreenTickMark() : returnWhiteTickMark()}
					1.) Watch the intro video
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, create2tests ? doneCSS : null]}>
				<span css={spanCSS}>
					{create2tests ? returnGreenTickMark() : returnWhiteTickMark()}
					2.) Create 2 tests
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, reviewReports ? doneCSS : null]}>
				<span css={spanCSS}>
					{reviewReports ? returnGreenTickMark() : returnWhiteTickMark()}
					3.) Review reports
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, integrate ? doneCSS : null]}>
				<span css={spanCSS}>
					{integrate ? returnGreenTickMark() : returnWhiteTickMark()}
					4.) Integrate
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, inviteTeamMembers ? doneCSS : null]}>
				<span css={spanCSS}>
					{inviteTeamMembers ? returnGreenTickMark() : returnWhiteTickMark()}
					5.) Invite team members
				</span>
				<span>Get 5$ credits</span>
			</div>
		</div>
	);
}

function returnWhiteTickMark() {
	return (
		<svg
			css={checkMarkCSS}
			width="15"
			height="17"
			viewBox="0 0 15 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="1"
				y="1"
				width="13"
				height="14.0196"
				rx="6.5"
				fill="white"
				stroke="#ECECEC"
				strokeWidth="{2}"
			/>
			<path
				d="M7.03305 10.1202C6.97461 10.1829 6.89492 10.218 6.81211 10.218C6.7293 10.218 6.64961 10.1829 6.59117 10.1202L4.8268 8.23553C4.64367 8.03996 4.64367 7.7229 4.8268 7.52766L5.04773 7.29171C5.23086 7.09613 5.52742 7.09613 5.71055 7.29171L6.81211 8.46815L9.78867 5.28926C9.9718 5.09368 10.2687 5.09368 10.4515 5.28926L10.6724 5.52521C10.8555 5.72079 10.8555 6.03784 10.6724 6.23308L7.03305 10.1202Z"
				fill="#ECECEC"
			/>
		</svg>
	);
}

function returnGreenTickMark() {
	return (
		<svg
			css={checkMarkCSS}
			width="19"
			height="19"
			viewBox="0 0 19 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="1"
				y="1"
				width="17"
				height="17"
				rx="8.5"
				fill="#6CFF7B"
				stroke="#33C441"
				strokeWidth="{2}"
			/>
			<g clipPath="url(#clip0)">
				<path
					d="M8.90898 12.0023C8.83496 12.0767 8.73402 12.1183 8.62913 12.1183C8.52423 
                    
                    12.1183 8.42329 12.0767 8.34927 12.0023L6.1144 9.76702C5.88244 9.53506 5.88244 9.15902 6.1144 8.92745L6.39425 8.6476C6.62621 8.41564 7.00186 8.41564 7.23381 8.6476L8.62913 10.0429L12.3994 6.2726C12.6314 6.04064 13.0074 6.04064 13.239 6.2726L13.5189 6.55246C13.7508 6.78441 13.7508 7.16046 13.5189 7.39202L8.90898 12.0023Z"
					fill="#4ADB31"
				/>
			</g>
			<defs>
				<clipPath id="clip0">
					<rect
						width="9.5"
						height="9.5"
						fill="white"
						transform="translate(5.06641 4.43359)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

const containerCSS = css`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const deployFastCSS = css`
	font-size: 1.25rem;
	line-height: 2rem;
	font-family: Gilroy;
	font-weight: bold;
	margin: 0.5rem 1rem;
	color: #2b2b39;
`;

const stepsCSS = css`
	background: #ffffff;
	border: 2px solid #cccccc;
	box-sizing: border-box;
	border-radius: 8px;
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 2rem;
	font-weight: bold;
	height: 4rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	margin: 1rem;
	width: 60%;
`;

const spanCSS = css`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
`;

const doneCSS = css`
	color: #9c9c9c;
`;

const checkMarkCSS = css`
	height: 1.5rem;
	width: 1.5rem;
	margin-right: 1rem;
`;

export default Onboarding;
