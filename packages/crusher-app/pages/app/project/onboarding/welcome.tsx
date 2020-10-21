import { css } from "@emotion/core";
import { redirectToFrontendPath } from "@utils/router";
import WithSession from "@hoc/withSession";
import { getFirstName } from "@utils/helpers";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import Link from "next/link";

function ProjectDashboard(props) {
	const { jobs, logs, projectId, userInfo } = props;

	function handleFirstTestOnboardingClick() {
		return redirectToFrontendPath("/app/project/onboarding/create-test");
	}

	const firstName = getFirstName(userInfo.name);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				marginTop: "0.88rem",
				flexDirection: "column",
			}}
		>
			<img src={"/svg/laptop.svg"} css={styles.onboardingFeaturedImage} />
			<div css={styles.onboardingHeading}>Hey, {firstName}</div>
			<div css={styles.onboardingText}>
				<div style={{ marginTop: "0.94rem" }}>
					It’s time to create your first test <br /> You’re about to experience power
					of no code testing
				</div>
			</div>
			<Link
				href={"/app/project/onboarding/create-test"}
				as={"/app/project/onboarding/create-test"}
			>
				<div css={styles.button}>Create first test</div>
			</Link>
		</div>
	);
}

const styles = {
	onboardingFeaturedImage: css`
		width: 31.7rem;
		height: 20.76rem;
	`,
	onboardingHeading: css`
		font-weight: bold;
		font-size: 1.5rem;
		margin-top: 1.35rem;
		color: #2d3958;
		font-family: Cera Pro;
		font-style: normal;
		font-weight: bold;
		font-size: 1.52rem;
		text-align: center;
		color: #2b2b39;
	`,
	onboardingText: css`
		font-size: 1.16rem;
		line-height: 2rem;
		color: #2d3958;
		text-align: center;
		font-weight: 500;
		color: #2b2b39;
		margin-bottom: 2rem;
	`,
	button: css`
		background: #5b76f7;
		border: 1px solid #3f60f5;
		font-family: Gilroy;
		border-radius: 0.25rem;
		padding: 0.941rem 3.35rem;
		font-weight: bold;
		font-size: 1.05rem;
		color: #fff;
		cursor: pointer;
	`,
	helpText: css`
		font-size: 0.85rem;
		text-align: center;
		margin-top: 1.75rem;
		cursor: pointer;
		color: #848484;
	`,
};

ProjectDashboard.getInitialProps = async (ctx) => {};

export default WithSession(WithSidebarLayout(ProjectDashboard));
