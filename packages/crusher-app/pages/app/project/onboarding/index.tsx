import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import { getUserInfo } from "@redux/stateUtils/user";
import { useEffect, useState } from "react";
import firebase from "firebase";
import firebaseConfig from "../../../../../crusher-shared/config/fire-config";
import GreenTickMark from "../../../../public/svg/onboarding/check_mark_green.svg";
import WhiteTickMark from "../../../../public/svg/onboarding/check_mark_white.svg";

function Onboarding() {
	const userInfo = useSelector(getUserInfo);

	const [watchIntroVideo, setWatchIntroVideo] = useState(false);
	const [create2tests, setCreate2tests] = useState(false);
	const [reviewReports, setReviewReports] = useState(false);
	const [integrate, setIntegrate] = useState(false);
	const [inviteTeamMembers, setInviteTeamMembers] = useState(false);
	const [firebaseService, setFirebaseService] = useState({});

	useEffect(() => {
		try {
			if (!firebase.apps.length) {
				firebase.initializeApp(firebaseConfig);
			} else {
				firebase.app();
			}
			setFirebaseService(firebase);
		} catch (err) {
			if (!/already exists/.test(err.message)) {
				console.error("Firebase initialisation error", err.stack);
			}
		}

		(async () => {
			const userDataReference = await firebaseService 
				.firestore()
				.collection("onboarding")
				.doc(`${userInfo.id}`);
			userDataReference
				.get()
				.then((docSnapshot: any) => {
					if (docSnapshot.exists) {
						// if the document exists, we just get the data in the document
						userDataReference.onSnapshot((doc: any) => {
							const userData = doc.data();
							setWatchIntroVideo(userData.watchIntroVideo || false);
							setCreate2tests(userData.create2tests || false);
							setReviewReports(userData.reviewReports || false);
							setIntegrate(userData.integrate || false);
							setInviteTeamMembers(userData.inviteTeamMembers || false);
						});
					} else {
						// if the document does not exist, we insert data into the document
						userDataReference.set({
							watchIntroVideo: false,
							create2tests: false,
							reviewReports: false,
							integrate: false,
							totalNumberOfTests: 0,
							inviteTeamMembers: false,
						});
					}
				})
				.catch((err: any) => console.error(err));
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
					{watchIntroVideo ? (
						<GreenTickMark css={checkMarkCSS} />
					) : (
						<WhiteTickMark css={checkMarkCSS} />
					)}
					1.) Watch the intro video
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, create2tests ? doneCSS : null]}>
				<span css={spanCSS}>
					{create2tests ? (
						<GreenTickMark css={checkMarkCSS} />
					) : (
						<WhiteTickMark css={checkMarkCSS} />
					)}
					2.) Create 2 tests
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, reviewReports ? doneCSS : null]}>
				<span css={spanCSS}>
					{reviewReports ? (
						<GreenTickMark css={checkMarkCSS} />
					) : (
						<WhiteTickMark css={checkMarkCSS} />
					)}
					3.) Review reports
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, integrate ? doneCSS : null]}>
				<span css={spanCSS}>
					{integrate ? (
						<GreenTickMark css={checkMarkCSS} />
					) : (
						<WhiteTickMark css={checkMarkCSS} />
					)}
					4.) Integrate
				</span>
				<span>Get 5$ credits</span>
			</div>
			<div css={[stepsCSS, inviteTeamMembers ? doneCSS : null]}>
				<span css={spanCSS}>
					{inviteTeamMembers ? (
						<GreenTickMark css={checkMarkCSS} />
					) : (
						<WhiteTickMark css={checkMarkCSS} />
					)}
					5.) Invite team members
				</span>
				<span>Get 5$ credits</span>
			</div>
		</div>
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
