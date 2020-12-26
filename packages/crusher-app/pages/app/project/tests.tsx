import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import { getAllTestsInfosInProject } from "@services/test";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import Link from "next/link";
import { cleanHeaders } from "@utils/backendRequest";
import { Player } from "@lottiefiles/react-lottie-player";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";

function TestCard(props) {
	const { name, userName, userId, id, featured_video_uri, createdAt } = props;
	const videoRef = useRef(null);

	function onVideoHover(event) {
		(videoRef.current as HTMLVideoElement).currentTime = 0;
		(videoRef.current as HTMLVideoElement).play();
	}

	function onVideoHoverExit(event) {
		(videoRef.current as HTMLVideoElement).pause();
	}

	useEffect(() => {
		if (
			videoRef &&
			videoRef.current &&
			videoRef.current.tagName.toLowerCase() === "video"
		) {
			videoRef.current.addEventListener(
				"loadedmetadata",
				function () {
					this.currentTime = this.duration / 2;
				},
				false,
			);
		}
	}, [videoRef]);

	return (
		<Link href={`/app/tests/editor/${id}`}>
			<a href={`/app/tests/editor/${id}`} css={styles.testCard}>
				<div css={styles.testFeaturedImage}>
					<div css={styles.lightHouse}>
						<img src={"/svg/lighthouse.svg"} />
					</div>
					{featured_video_uri && (
						<video
							ref={videoRef}
							onMouseOver={onVideoHover}
							onMouseLeave={onVideoHoverExit}
							controls={false}
							autoPlay={false}
							muted
							src={featured_video_uri}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								objectPosition: "top",
							}}
						/>
					)}
				</div>
				<div css={styles.testCardContentContainer}>
					<div css={styles.testCardInfo}>
						<div css={styles.testName}>{name}</div>
						<div css={styles.gridContainer}>
							<div css={styles.girdLeftHeading}>Device</div>
							<div css={styles.gridRightValue}>1920*1080, 1200*1000</div>
							<div css={styles.girdLeftHeading}>Browsers</div>
							<div css={styles.gridRightValue}>Firefox, Safari, Chrome</div>
						</div>
						<div css={styles.testCreator}>
							{userName} | {new Date(createdAt).toDateString()}
						</div>
					</div>
				</div>
			</a>
		</Link>
	);
}

function RenderTestCard(props) {
	const { tests } = props;

	const finalOut = tests.reduce(function (prev, current, index) {
		if (index % 3 == 0) {
			const rowItems = [tests[index], tests[index + 1], tests[index + 2]]
				.filter((val) => {
					return typeof val !== "undefined";
				})
				.map((rowItem) => {
					const userName = rowItem.userFirstName + " " + rowItem.userLastName;
					const { featured_video_uri } = rowItem;

					return (
						<TestCard
							name={rowItem.name}
							userName={userName}
							userId={rowItem.user_id}
							id={rowItem.id}
							createdAt={rowItem.created_at}
							featured_video_uri={featured_video_uri}
						/>
					);
				});

			return [...prev, <div css={styles.testsRowContainer}>{rowItems}</div>];
		}
		return prev;
	}, []);
	return <div css={styles.testsListContainer}>{finalOut}</div>;
}

function ProjectTestsList(props) {
	const { tests } = props;
	const [projectTests, setProjectTests] = useState(tests || []);
	const [isLoading, setIsLoading] = useState(false);
	const projectsList = useSelector(getProjects);
	const selectedProjectId = useSelector(getSelectedProject);

	const isInitialMount = useRef(true);

	const selectedProject = projectsList.find((project) => {
		return project.id === selectedProjectId;
	});

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			setIsLoading(true);
			getAllTestsInfosInProject(selectedProjectId).then((tests) => {
				setProjectTests(tests);
				setIsLoading(false);
			});
		}
	}, [selectedProjectId]);

	return (
		<div css={styles.container}>
			<div css={styles.heading}>
				{selectedProject ? selectedProject.name : "Tests List"}
			</div>
			{!isLoading && projectTests.length > 0 ? (
				<RenderTestCard tests={projectTests} />
			) : (
				<ShowEmptyPlaceHolder />
			)}
		</div>
	);
}

function ShowEmptyPlaceHolder() {
	return (
		<div css={styles.activitiesPlaceholderContainer}>
			<Player
				autoplay={true}
				src={"https://assets2.lottiefiles.com/packages/lf20_S6vWEd.json"}
				speed={1}
				background={"transparent"}
				style={{ width: 220, height: 220, margin: "0 auto" }}
				loop={true}
			/>
			<div css={styles.activitiesPlaceholderHeading}>Alas!</div>
			<div css={styles.activitiesPlaceholderMessageContainer}>
				<div>You don’t have any tests to show.</div>
				<div css={styles.blueItalicText}>Need any help</div>
			</div>
		</div>
	);
}

const styles = {
	container: css`
		display: flex;
		padding-top: 2.46rem;
		padding-left: 4.25rem;
		padding-right: 4.25rem;
		flex-direction: column;
		color: #2b2b39;
		height: 100%;
	`,
	heading: css`
		color: #2b2b39;
		font-family: Cera Pro;
		font-style: normal;
		font-weight: bold;
		font-size: 1.2rem;
		color: #3c4454;
	`,
	testsListContainer: css`
		margin-top: 2.75rem;
		max-width: 56rem;
	`,
	testCard: css`
		background: #ffffff;
		padding-bottom: 0.8rem;
		margin-left: 3.75rem;
		margin-bottom: 2rem;
		&:first-child {
			margin-left: 0;
		}
	`,
	testFeaturedImage: css`
		width: 17.5rem;
		height: 10.55rem;
		background: #202029;
		border-radius: 0.25rem;
		position: relative;
	`,
	lightHouse: css`
		 {
			position: absolute;
			bottom: 0.4rem;
			right: 0.5rem;
		}
	`,
	testCardContentContainer: css`
		display: flex;
		margin-top: 1.1rem;
		padding-right: 0.3rem;
	`,
	testCardInfo: css`
		flex: 1;
		padding-left: 0.3rem;
	`,
	testName: css`
		font-family: Cera Pro;
		font-style: normal;
		font-weight: bold;
		font-size: 1rem;
		color: #2d3958;
	`,
	gridContainer: css`
		display: grid;
		grid-template-columns: 24% auto;
		margin-top: 0.6rem;
		grid-gap: 0.4rem;
	`,
	girdLeftHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: 500;
		font-size: 0.65rem;
	`,
	gridRightValue: css`
		font-family: DM Sans;
		font-style: normal;
		font-size: 0.65rem;
		font-weight: normal;
	`,
	testCreator: css`
		font-size: 0.65rem;
		color: #2d3958;
		margin-top: 1rem;
	`,
	testEdit: css``,
	testsRowContainer: css`
		display: flex;
	`,
	activitiesPlaceholderContainer: css`
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		padding: 5rem 5.45rem;
	`,
	activitiesPlaceholderHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.5rem;
		color: #2b2b39;
		text-align: center;
	`,
	activitiesPlaceholderMessageContainer: css`
		margin-top: 1rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 1.15rem;
		line-height: 2rem;
		color: #2b2b39;
		text-align: center;
	`,
	blueItalicText: css`
		color: #5b76f7;
		font-weight: bold;
		font-style: italic;
	`,
};

ProjectTestsList.getInitialProps = async (ctx) => {
	const { res, req, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);
		const tests = await getAllTestsInfosInProject(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);
		return {
			tests: tests && Array.isArray(tests) ? tests : [],
		};
	} catch (er) {
		throw er;
		await redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSidebarLayout(ProjectTestsList));
