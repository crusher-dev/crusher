import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import Link from "next/link";

function ProjectIntegration() {
	const handleGithubClick = () => {
		const _newWindow = window.open("https://github.com/apps/Crusher-Test/installations/new", "Github authorization");
		if (window.focus) {
			_newWindow.focus();
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<div css={styles.container}>
				<div css={styles.heading}>External integration</div>
				<ul css={styles.servicesList}>
					<li>
						<div css={styles.serviceInfoContainer}>
							<div css={styles.serviceInfoHeading}>Integrate with repo</div>
							<div css={styles.serviceInfoDesc}>This allows you to setup check on PR and branches</div>
						</div>
						<div css={styles.serviceInfoButton} onClick={handleGithubClick}>
							<img style={{ width: "10.95rem", height: "2.7rem" }} src={"/svg/github.svg"} />
						</div>
					</li>
					<li>
						<div css={styles.serviceInfoContainer}>
							<div css={styles.serviceInfoHeading}>Integrate with slack</div>
							<div css={styles.serviceInfoDesc}>This allows you to setup check</div>
						</div>
						<div css={styles.serviceInfoButton}>
							<img style={{ width: "10.95rem", height: "2.7rem" }} src={"/svg/slack.svg"} />
						</div>
					</li>
					<li>
						<div css={styles.serviceInfoContainer}>
							<div css={styles.serviceInfoHeading}>Integrate with slack</div>
							<div css={styles.serviceInfoDesc}>This allows you to setup check</div>
						</div>
						<div css={styles.serviceInfoButton}>
							<img style={{ width: "10.95rem", height: "2.7rem" }} src={"/svg/done.svg"} />
						</div>
					</li>
				</ul>
				<div css={styles.infoText}>Last step! Setup monitoring</div>
				<div css={styles.buttonContainer}>
					<Link href={"/app/project/onboarding/monitoring"}>
						<a href={"/app/project/onboarding/monitoring"}>
							<div css={styles.button}>Setup Monitoring</div>
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
}

const styles = {
	container: css`
		display: flex;
		flex: 1;
		flex-direction: column;
		padding-top: 2.75rem;
		padding-left: 4.25rem;
		padding-right: 4rem;
		color: #2d3958;
	`,
	onboardingHeading: css`
		font-weight: bold;
		font-size: 1.2rem;
		color: #2d3958;
	`,
	heading: css`
		font-size: 1.125rem;
		font-weight: 700;
	`,
	servicesList: css`
		list-style: none;
		padding: 0;
		margin-top: 4rem;
		li {
			display: flex;
			align-items: center;
			&:not(:last-child) {
				margin-bottom: 4rem;
			}
		}
	`,
	serviceInfoContainer: css`
		flex: 1;
	`,
	serviceInfoHeading: css`
		font-weight: 700;
		font-size: 1.1rem;
	`,
	serviceInfoDesc: css`
		margin-top: 0.9rem;
		font-size: 1rem;
	`,
	serviceInfoButton: css`
		margin-left: auto;
		cursor: pointer;
	`,
	infoText: css`
		text-align: center;
		margin-top: 4.5rem;
		font-size: 1.125rem;
		font-weight: 500;
	`,
	buttonContainer: css`
		margin-top: 2rem;
	`,
	button: css`
		background: #5b76f7;
		border: 1px solid #2f4fe7;
		border-radius: 0.25rem;
		padding: 0.55rem 1.75rem;
		font-weight: 700;
		font-size: 0.75rem;
		color: #fff;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		display: inline-block;
		cursor: pointer;
	`,
};

ProjectIntegration.getInitialProps = async () => {};

export default withSession(withSidebarLayout(ProjectIntegration));
