import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import { OnboardingPopup } from "@ui/containers/onboarding/Popup";
import React, { useState, useEffect } from "react";
import { CreateTest } from "@ui/components/app/CreateTestButton";
import { useSelector } from "react-redux";
import { getUserInfo } from "@redux/stateUtils/user";
import { CreateTestModal } from "@ui/containers/modals/createTestModal";
import { InstallExtensionModal } from "@ui/containers/modals/installExtensionModal";
import { checkIfExtensionPresent } from "@utils/extension";

const features = [
	{ message: "😃 Ship Faster", color: "#FF5A8C" },
	{ message: "Increase your productivity", color: "#885FFF" },
	{ message: "Catch UI/Flow Issues", color: "#FB7237" },
	{ message: "Monitor Product changes", color: "#4E75FF" },
	{ message: "Test on different devices", color: "#53D6FF" },
	{ message: "Test from different browsers", color: "#4E75FF" },
	{ message: "Test without writing code", color: "#69A5FF" },
	{ message: "Increase Revenue", color: "#4E75FF" },
	{ message: "Decrease Unhappy Customers", color: "#4E75FF" },
	{ message: "Test in Development", color: "#4E75FF" },
];

function ProjectOnboardingCreateTest(props) {
	const { userStatus } = props;
	const userInfo = useSelector(getUserInfo);
	const [featuresMessage, setFeaturesMessage] = useState(0);
	const [showCreateTestModal, setShouldShowCreateTestModal] = useState(false);
	const [showInstallExtensionModal, setShowInstallExtensionModal] = useState(
		false,
	);

	const changeFeatureMessage = () => {
		const interval = setInterval(() => {
			setFeaturesMessage(
				featuresMessage + 1 < features.length ? featuresMessage + 1 : 0,
			);
		}, 4500);
		return () => {
			clearInterval(interval);
		};
	};

	useEffect(changeFeatureMessage, [featuresMessage]);

	const handleVideoFinishedCallback = () => {
		console.log("Video has finished playing");
	};

	const handleCreateFirstTest = () => {
		setShouldShowCreateTestModal(true);
	};

	const closeCreateTestModal = () => {
		setShouldShowCreateTestModal(false);
	};

	const handleCreateTest = async () => {
		const isExtensionInstalled = await checkIfExtensionPresent();
		if (!isExtensionInstalled) {
			setShowInstallExtensionModal(true);
		} else {
			setShouldShowCreateTestModal(true);
		}
	};
	const closeInstallExtensionModal = () => {
		setShowInstallExtensionModal(false);
	};

	const handleExtensionDownloaded = () => {
		closeInstallExtensionModal();
		setShouldShowCreateTestModal(true);
	};

	const firstName = userInfo.first_name;
	return (
		<>
			<OnboardingPopup userStatus={userStatus} />
			<div
				style={{
					display: "flex",
					padding: "1.9rem 2.4rem",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<div css={styles.innerCenterContainer}>
					<video
						css={styles.videoPlayer}
						src="/assets/video/onboarding.mp4"
						onEnded={handleVideoFinishedCallback}
						controls
					></video>
					<div css={styles.crusherFeatures}>
						<span style={{ color: features[featuresMessage].color }}>
							{features[featuresMessage].message}
						</span>{" "}
						with Crusher
					</div>
					<div css={styles.heyText}>
						Hey {firstName}, Experience power of no code testing
					</div>
					<div>
						<div css={styles.buttonContainer}>
							<CreateTest onClick={handleCreateTest} label="Create first test" />
						</div>

						<div css={styles.migrateTest}>Already Have testing? Migrate test</div>
					</div>
				</div>
			</div>
			<InstallExtensionModal
				isOpen={showInstallExtensionModal}
				onClose={closeInstallExtensionModal}
				onExtensionDownloaded={handleExtensionDownloaded}
			/>
			<CreateTestModal
				isOpen={showCreateTestModal}
				onClose={closeCreateTestModal}
			/>
		</>
	);
}

const styles = {
	migrateTest: css`
		font-size: 0.9rem;
		color: #2e2929;
		text-decoration: underline;
		text-align: center;
	`,
	videoPlayer: css`
		width: 43.5rem;
		height: 26.25rem;
		border-radius: 0.6rem;
		margin: 0 auto;
		margin-top: 0.9rem;
		margin-bottom: 3rem;
	`,
	heading: css`
		font-family: Cera Pro;
		font-style: normal;
		font-weight: bold;
		flex-direction: column;
		font-size: 1.1rem;
		color: #2b2b39;
	`,
	innerCenterContainer: css`
		display: flex;
		justify-content: center;
		flex-direction: column;
	`,
	heyText: css`
		font-family: Cera Pro;
		font-style: normal;
		font-weight: 800;
		font-size: 2rem;
		text-align: center;
		color: #2b2b39;
		margin-bottom: 2rem;
		line-height: 2rem;
	`,
	crusherFeatures: css`
		font-family: Gilroy;
		font-size: 1.25rem;
		text-align: center;
		font-weight: 600;
		color: #2b2b39;
		margin-bottom: 0.75rem;
		line-height: 1.25rem;
		span {
			font-weight: 800;
		}
	`,
	buttonContainer: css`
		display: flex;
		justify-content: center;
		margin-bottom: 2.35rem;
	`,
	createTestButton: css`
		background: #5b76f7;
		border: 1px solid #3f60f5;
		box-sizing: border-box;
		border-radius: 5px;
		display: flex;
		padding: 0.6rem 0.95rem;
		font-family: Gilroy;
		font-weight: bold;
		font-size: 0.9rem;
		color: #ffffff;
		a:hover {
			text-decoration: none !important;
		}
		&:hover {
			background: #4361ed;
		}
		span {
			margin-left: 2.1rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 1rem;
		}
		min-width: 12rem;
		cursor: pointer;
	`,
	importButton: css`
		margin-left: 1.9rem;
		cursor: pointer;
		background: #ffffff;
		border: 1px solid #222223;
		border-radius: 0.25rem;
		padding: 0.6rem 1.4rem;
		font-family: Gilroy;
		font-weight: bold;
		font-size: 0.9rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	`,
	watchVideoContainer: css`
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: Cera Pro;
		margin-top: 0.9rem;
		font-style: normal;
		font-weight: 500;
		font-size: 0.8rem;
		cursor: pointer;
		color: #2e2929;
		span {
			margin-left: 0.5rem;
		}
	`,
	feedbackContainer: css`
		margin-top: 2.25rem;
	`,
	feedback: css`
		font-family: Gilroy;
		font-size: 0.875rem;
		font-weight: 500;

		text-align: center;
		color: #2b2b39;
	`,
	leftSide: css`
		width: 40;
		height: 100%;
		padding-left: 4.1rem;
		display: flex;
		flex-direction: column;
	`,
	videoTextContainer: css`
		margin-top: 2rem;
		display: flex;
		align-items: center;
		padding-left: 0.45rem;
		font-size: 1rem;
		font-weight: 500;
		color: #2d3958;
		span {
			margin-left: 1.2rem;
		}
	`,
	rightSide: css`
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-left: 1rem;
		padding-right: 4.25rem;
	`,
	chromeExtensionContainer: css`
		color: #2d3958;
	`,
	chromeExtensionHeading: css`
		font-size: 1.25rem;
		font-weight: 700;
	`,
	chromeExtensionDesc: css`
		margin-top: 0.8rem;
		font-size: 0.95rem;
		padding-left: 0.12rem;
	`,
	button: css`
		margin-left: 0.25rem;
		padding: 0.42rem 2rem;
		background: #5b76f7;
		border: 0.1rem solid #2f4fe7;
		border-radius: 0.25rem;
		display: inline-block;
		margin-top: 2.25rem;
		font-size: 0.89rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
	`,
	separatorContainer: css`
		display: flex;
		margin: 4rem 0;
		align-items: center;
	`,
	separatorLine: css`
		flex: 1;
		background: #d8e9ff;
		height: 0.12rem;
	`,
	separatorText: css`
		font-size: 0.95rem;
		text-transform: uppercase;
		padding: 0 2rem;
		color: #2d3958;
	`,
	infoBoxContainer: css`
		border: 0.09rem solid #e1eeff;
		border-radius: 0.6rem;
		padding: 1.15rem 1.65rem;
		color: #2d3958;
	`,
	infoBoxHeading: css`
		font-weight: 700;
		font-size: 1rem;
		color: #2d3958;
	`,
	infoBoxDesc: css`
		margin-top: 0.25rem;
		font-size: 0.725rem;
		color: #2d3958;
	`,
	needHelpText: css`
		cursor: pointer;
		color: #2d3958;
		font-size: 1rem;
		text-align: center;
		margin-top: 4.25rem;
	`,
};

ProjectOnboardingCreateTest.getInitialProps = async ({ userStatus }) => {
	return { userStatus };
};

export default withSession(withSidebarLayout(ProjectOnboardingCreateTest));
