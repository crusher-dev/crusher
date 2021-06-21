import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import {
	_deleteTest,
	getAllTestsInfosInProject,
	updateTestName,
} from "@services/test";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { cleanHeaders } from "@utils/backendRequest";
import { EmptyTestListContainer } from "@ui/containers/tests/emptyTestListContainer";
import { Conditional } from "@ui/components/common/Conditional";
import FullScreenIcon from "../../../src/svg/fullscreen.svg";
import { InstallExtensionModal } from "@ui/containers/modals/installExtensionModal";
import { CreateTestModal } from "@ui/containers/modals/createTestModal";
import { checkIfExtensionPresent } from "@utils/extension";
import { Toast } from "@utils/toast";
import EditIcon from "../../../src/svg/edit.svg";
import DeleteIcon from "../../../src/svg/delete.svg";
import { setCurrentCursorPositionInContentEditable } from "@utils/dom";

const INPUT_MODE = {
	VISIBLE_NAME: "VISIBLE_NAME",
	RENAME: "RENAME",
};
function RenderInputName(props: any) {
	const { name, mode, setTestNameCallback } = props;
	const [lastValue, setLastValue] = useState(null);
	const inputRef = useRef(null as any);

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === "Enter" || e.keyCode === 13) {
			if (lastValue !== inputRef.current.innerText) {
				setTestNameCallback((e as any).target.innerText);
			} else {
				setTestNameCallback(null);
			}
		}
	};

	useEffect(() => {
		if (mode === INPUT_MODE.RENAME) {
			setLastValue(inputRef.current.innerText);
			inputRef.current.focus();
			setCurrentCursorPositionInContentEditable(
				inputRef.current,
				inputRef.current.innerText.length,
			);
		}
	}, [mode]);

	const handleInputBlur = () => {
		(window as any).getSelection().removeAllRanges();
		if (lastValue !== inputRef.current.innerText) {
			setTestNameCallback(inputRef.current.innerText);
			setLastValue(inputRef.current.innerText);
		}
	};

	return (
		<>
			<Conditional If={mode === INPUT_MODE.RENAME}>
				<div
					ref={inputRef}
					onKeyPress={handleKeyPress as any}
					contentEditable={true}
					css={styles.testName}
					onFocusOut={handleInputBlur}
				>
					{name}
				</div>
			</Conditional>
			<Conditional If={!mode || mode === INPUT_MODE.VISIBLE_NAME}>
				<div css={styles.testName}>{name}</div>
			</Conditional>
		</>
	);
}

function TestCard(props) {
	const {
        name,
        userName,
        id,
        featured_video_uri,
        createdAt
    } = props;
	const [testName, setTestName] = useState(name);
	const videoRef = useRef(null);
	const [testNameMode, setTestNameMode] = useState(INPUT_MODE.VISIBLE_NAME);

	function onVideoHover() {
		(videoRef.current as HTMLVideoElement).currentTime = 0;
		(videoRef.current as HTMLVideoElement).play();
	}

	function onVideoHoverExit() {
		(videoRef.current as HTMLVideoElement).pause();
	}

	useEffect(() => {
		if (
			videoRef?.current &&
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

	const goFullScreen = async () => {
		if (videoRef.current) {
			await (videoRef.current as HTMLVideoElement).requestFullscreen();
		}
	};

	const setTestNameCallback = (newTestName: string) => {
		if (newTestName) {
			updateTestName(newTestName, id)
				.then(() => {
					setTestName(newTestName);
					Toast.showSuccess("Test name updated successfully");
				})
				.catch(() => {
					Toast.showError("Error occurred when trying to update test name");
				});
			setTestName(newTestName);
		}
		setTestNameMode(INPUT_MODE.VISIBLE_NAME);
	};

	const editInputName = () => {
		setTestNameMode(INPUT_MODE.RENAME);
	};

	const deleteTest = () => {
		_deleteTest(id)
			.then(() => {
				window.location.reload();
			})
			.catch(() => {
				Toast.showError("Error occured when trying to delete the test");
			});
	};

	return (
		<div>
			<div css={styles.testCard}>
				<div css={styles.testFeaturedImage}>
					<div css={styles.fullscreenIcon} onClick={goFullScreen}>
						<FullScreenIcon css={{ width: "1.25rem" }} />
					</div>
					<Conditional If={featured_video_uri}>
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
					</Conditional>
					<Conditional If={!featured_video_uri}>
						<div css={waitingVideoTextContainerCSS}>
							<span css={waitingVideoTextCSS}>Processing video...</span>
						</div>
					</Conditional>
				</div>
				<div css={styles.testCardContentContainer}>
					<div css={styles.testCardInfo}>
						<div css={testCardNameContainerCSS}>
							<RenderInputName
								setTestNameCallback={setTestNameCallback}
								name={testName}
								mode={testNameMode}
							/>
							<div css={editIconCSS} onClick={editInputName}>
								<EditIcon css={editIconSVGCSS} />
							</div>
						</div>
						<div css={styles.gridContainer}>
							<div css={styles.girdLeftHeading}>Device</div>
							<div css={styles.gridRightValue}>1920*1080, 1200*1000</div>
							<div css={styles.girdLeftHeading}>Browsers</div>
							<div css={styles.gridRightValue}>Firefox, Safari, Chrome</div>
						</div>
						<div css={testCardBottomContainerCSS}>
							<div css={testCreatorCSS}>
								{userName} | {new Date(createdAt).toDateString()}
							</div>
							<div css={deleteIconContainerCSS} onClick={deleteTest}>
								<DeleteIcon />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const testCreatorCSS = css`
	font-size: 0.65rem;
	color: #2d3958;
	margin-top: 1rem;
	flex: 1;
`;
const testCardBottomContainerCSS = css`
	display: flex;
`;
const deleteIconContainerCSS = css`
	svg {
		width: 1rem;
		height: auto;
	}
	&:hover {
		opacity: 0.7;
	}
`;

const waitingVideoTextContainerCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
`;

const waitingVideoTextCSS = css`
	color: #fff;
	font-weight: 500;
`;

function RenderTestCard(props) {
	const { tests } = props;

	const finalOut = tests.reduce(function (prev, current, index) {
		if (index % 4 === 0) {
			const rowItems = [
				tests[index],
				tests[index + 1],
				tests[index + 2],
				tests[index + 3],
			]
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
							item={rowItem}
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
	const [projectTests] = useState(tests || []);
	const [isLoading] = useState(false);
	const projectsList = useSelector(getProjects);
	const selectedProjectId = useSelector(getSelectedProject);
	const [showCreateTestModal, setShouldShowCreateTestModal] = useState(false);
	const [showInstallExtensionModal, setShowInstallExtensionModal] = useState(
		false,
	);
	const selectedProject = projectsList.find((project) => {
		return project.id === selectedProjectId;
	});

	const isTestsPresent = !isLoading && projectTests.length > 0;

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

	return (
		<div
			css={[
				styles.container,
				isTestsPresent ? containerPaddingCSS : emptyTestContainerPaddingCSS,
			]}
		>
			<Conditional If={isTestsPresent}>
				<>
					<div css={styles.heading}>
						{selectedProject ? selectedProject.name : "Tests List"}
					</div>
					<RenderTestCard tests={projectTests} />
				</>
			</Conditional>
			<Conditional If={!isTestsPresent}>
				<EmptyTestListContainer onCreateTest={handleCreateTest} />
			</Conditional>

			<InstallExtensionModal
				isOpen={showInstallExtensionModal}
				onClose={closeInstallExtensionModal}
				onExtensionDownloaded={handleExtensionDownloaded}
			/>
			<CreateTestModal
				isOpen={showCreateTestModal}
				onClose={closeCreateTestModal}
			/>
		</div>
	);
}

const containerPaddingCSS = css`
	padding-top: 2.46rem;
	padding-left: 4.25rem;
	padding-right: 4.25rem;
`;

const emptyTestContainerPaddingCSS = css`
	padding-bottom: 4rem;
`;

const styles = {
	container: css`
		display: flex;
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
		cursor: pointer;
		border-radius: 0.4rem;
		max-width: 17.5rem;

		&:hover {
			opacity: 0.95;
			box-shadow: 0px 0px 16px 1px rgba(0, 0, 0, 0.51);
		}
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
	fullscreenIcon: css`
		position: absolute;
		bottom: 0.65rem;
		right: 0.5rem;
		z-index: 999;
	`,
	testCardContentContainer: css`
		display: flex;
		margin-top: 0.8rem;
		padding-right: 0.7rem;
		padding-left: 0.5rem;
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
	testEdit: css``,
	testsRowContainer: css`
		display: flex;
		& > div {
			&:not(:first-child) {
				margin-left: 4rem;
			}
		}
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

const testCardNameContainerCSS = css`
	display: flex;
`;
const editIconCSS = css`
	margin-left: auto;
	padding-top: 0.24rem;
	&:hover {
		opacity: 0.7;
	}
`;
const editIconSVGCSS = css`
	width: 0.75rem;
`;

ProjectTestsList.getInitialProps = async (ctx) => {
	const {
        req,
        store
    } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());

		const selectedProject = JSON.parse(
			cookies.selectedProject || null,
		);
		const tests = await getAllTestsInfosInProject(
			selectedProject || defaultProject,
			headers,
		);
		return {
			tests: tests && Array.isArray(tests) ? tests : [],
		};
	} catch (er) {
        throw er;
    }
};

export default withSession(withSidebarLayout(ProjectTestsList));
