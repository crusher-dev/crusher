import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import WithSession from "@hoc/withSession";
import { OnboardingPopup } from "@ui/containers/onboarding/Popup";

function ProjectOnboardingCreateTest(props) {
	const { userInfo, userStatus } = props;

	function handleDownloadExtensionClick() {
		const _newWindow = window.open(
			"https://chrome.google.com/webstore/detail/gfiagiidgjjnmklhbalcjbmdjbpphdln?authuser=0&hl=en-GB",
			"Crusher Chrome Extension",
		);
		if (window.focus) {
			_newWindow.focus();
		}
	}

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
					<iframe  css={styles.videoPlayer} src="https://www.loom.com/embed/5f1392d00274403083d151c0183620cb"
							frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
					<div css={styles.heyText}>Hey {userInfo.name},</div>
					<div css={styles.heyTextDescContainer}>
						<div css={styles.heyTextDesc}>
							You’re about to experience power of no code testing
						</div>
						<div style={{ marginTop: "0.7rem" }} css={styles.heyTextDesc}>
							Let’s start by creating or importing test.
						</div>
					</div>
					<div>
						<div
							style={{
								display: "inline-block",
								position: "relative",
								left: "50%",
								transform: "translateX(-50%)",
							}}
						>
							<div css={styles.buttonContainer}>
								<div css={styles.downloadButton} onClick={handleDownloadExtensionClick}>
									<img src={"/svg/onboarding/cloudDownload.svg"} />
									<span>Download Extension</span>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	);
}

const styles = {
	videoPlayer: css`
	width:43.5rem; height:26.25rem; 
	border-radius: .6rem;
	margin: 0 auto;
	margin-top: .9rem;
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
		font-weight: bold;
		font-size: 1.3rem;
		text-align: center;
		margin-top: 2.1rem;
		color: #2b2b39;
	`,
	heyTextDescContainer: css`
		margin-top: 0.9rem;
	`,
	heyTextDesc: css`
		font-family: Gilroy;
		font-size: 0.95rem;
		text-align: center;
		font-weight: 500;
		color: #2b2b39;
	`,
	buttonContainer: css`
		display: flex;
		justify-content: center;
		margin-top: 2.5rem;
	`,
	downloadButton: css`
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
		span {
			margin-left: 2.1rem;
			display: flex;
			flex-direction: row;
			align-items: center;
		}
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
		width: 40rem;
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
		margin: 4rem 0rem;
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
		padding: 0rem 2rem;
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

export default WithSession(WithSidebarLayout(ProjectOnboardingCreateTest));
