import Head from "next/head";
import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import withSession from "@hoc/withSession";

function IntegrationTests() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				marginTop: "4.25rem",
				flexDirection: "column",
			}}
		>
			<Head>
				<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer />
				<title>Test</title>
			</Head>
			<Player
				autoplay={true}
				src={"https://assets2.lottiefiles.com/packages/lf20_S6vWEd.json"}
				speed={1}
				background={"transparent"}
				style={{ width: 220, height: 220, margin: "0 auto" }}
				loop={true}
			/>
			<div css={styles.onboardingHeading}>Integrate tests in your worflow</div>
			<div css={styles.onboardingText}>
				<div>
					3 step to setup alerting, monitoring and integrating <br /> with your repo
				</div>
				<div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>You can always change this later.</div>
			</div>
			<Link href={"/app/project/onboarding/integration"}>
				<a href={"/app/project/onboarding/integration"}>
					<div css={styles.button}>Start Integration</div>
				</a>
			</Link>
		</div>
	);
}

const styles = {
	onboardingHeading: css`
		font-weight: bold;
		font-size: 1rem;
		color: #2d3958;
	`,
	onboardingText: css`
		font-size: 0.9rem;
		color: #2d3958;
		margin-top: 1.2rem;
		text-align: center;
		line-height: 1.6rem;
	`,
	button: css`
		background: #5b76f7;
		border: 1px solid #2f4fe7;
		border-radius: 0.25rem;
		padding: 0.75rem 2.75rem;
		font-weight: 700;
		font-size: 0.75rem;
		color: #fff;
		margin-top: 2.5rem;
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

IntegrationTests.getInitialProps = async () => {};

export default withSession(withSidebarLayout(IntegrationTests));
