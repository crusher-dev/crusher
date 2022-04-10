import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState, useMemo, useEffect, useCallback } from "react";

import { useAtom } from "jotai";
import useSWR, { mutate } from "swr";

import { Conditional } from "dyson/src/components/layouts";

import { getTestListAPI } from "@constants/api";
import { IProjectTestsListResponse, IProjectTestItem } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { TestStatusSVG } from "@svg/testReport";
import { backendRequest } from "@utils/common/backendRequest";
import { getBoolean } from "@utils/common";
import { timeSince } from "@utils/common/dateTimeUtils";
import { sendSnackBarEvent } from "@utils/common/notify";

import { appStateAtom } from "../../../store/atoms/global/appState";
import { currentProject } from "../../../store/atoms/global/project";
import { tempTestAtom } from "../../../store/atoms/global/tempTestId";
import { tempTestNameAtom } from "../../../store/atoms/global/tempTestName";

import { RequestMethod } from "../../../types/RequestOptions";
import { useRouter } from "next/router";
import { PaginationButton } from "dyson/src/components/molecules/PaginationButton";
import { testFiltersAtom } from "@store/atoms/pages/testPage";
import { tempTestTypeAtom } from "@store/atoms/global/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/tempTestUpdateId";
import CreateTestPrompt from "@ui/containers/tests/CreateTestPrompt";

interface IBuildItemCardProps {
	id: number;
	testName: string;
	isPassing: boolean;
	imageURL: string | null;
	videoURL: null | string;
	draftBuildId: number;
	firstRunCompleted: boolean;
	// In seconds
	createdAt: number;
}

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));
const FirstTestRunStatus = dynamic(() => import("@ui/containers/tests/firstTestStatus"));
const EditTest = dynamic(() => import("@ui/containers/tests/editTest"));

const saveTest = (projectId: number, tempTestId: string, customTestName: string | null = null) => {
	const testName = customTestName ? customTestName : new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10);
	return backendRequest(`/projects/${projectId}/tests/actions/create`, {
		method: RequestMethod.POST,
		payload: { tempTestId, name: testName },
	});
};

const updateTest = (tempTestId: string, mainTestId: string) => {
	return backendRequest(`/tests/${mainTestId}/actions/update.steps`, {
		method: RequestMethod.POST,
		payload: { tempTestId },
	});
};

function TestCard(props: IBuildItemCardProps) {
	const { testData } = props;
	const { testName, isPassing, createdAt, imageURL, clipVideoURL, id, firstRunCompleted, draftBuildId, tags } = testData;
	const statusIcon = getBoolean(isPassing) ? (
		<TestStatusSVG type={"PASSED"} height={"16rem"} />
	) : (
		<TestStatusSVG
			css={css`
				margin-right: -3rem;
			`}
			type={firstRunCompleted ? "FAILED" : "RUNNING"}
			height={"16rem"}
		/>
	);

	const shouldPlayVideo = !imageURL && !!clipVideoURL;

	const [showEditBox, setShowEditBox] = useState(false);

	const testRunInThisHour = (Date.now() - testData.createdAt) / 1000 < 3600;
	return (
		<div css={itemContainerStyle}>
			<Conditional showIf={showEditBox}>
				<EditTest
					id={id}
					name={testName}
					tags={tags}
					onClose={() => {
						setShowEditBox(false);
					}}
				/>
			</Conditional>

			<a css={itemImageStyle} href={`crusher://replay-test?testId=${id}`}>
				<Conditional showIf={!firstRunCompleted}>
					<FirstTestRunStatus isRunning={true} />
				</Conditional>

				<Conditional showIf={!!imageURL}>
					<img src={imageURL} />
				</Conditional>

				<Conditional showIf={shouldPlayVideo}>
					<video
						height={"100%"}
						css={css`
							object-fit: cover;
							width: 100%;
							height: 100%;
						`}
						onMouseOver={(event) => event.target.play()}
						onMouseOut={(event) => {
							event.target.pause();
							event.target.currentTime = 0;
						}}
						muted={true}
					>
						<source src={clipVideoURL} type="video/mp4" />
					</video>
				</Conditional>
			</a>
			<div css={itemMainContainerStyle}>
				<div className={"flex flex-row items-center"}>
					<div css={testNameStyle} className={"font-cera"}>
						{testName}
					</div>
					<div className={"ml-auto"}>{statusIcon}</div>
				</div>
				<div css={createdAtStyle} className={"flex justify-between mt-24 text-13"}>
					<span>{timeSince(new Date(createdAt))}</span>
					<div className={"flex "}>
						<span
							className={"edit"}
							onClick={() => {
								!showEditBox && setShowEditBox(true);
							}}
						>
							Edit
						</span>
						<Conditional showIf={testRunInThisHour}>
							<Link href={`/app/build/${draftBuildId}?view_draft=true`}>
								<span className={"view-build"}>View test build </span>
							</Link>
						</Conditional>
					</div>
				</div>
			</div>
		</div>
	);
}

const createdAtStyle = css`
	color: rgba(255, 255, 255, 0.6);
`;

const testNameStyle = css`
	color: rgba(255, 255, 255, 0.8);
	font-size: 15.5rem;
	font-weight: bold;
`;

const itemMainContainerStyle = css`
	//background: rgba(16, 18, 21, 0.5);
	padding: 20rem 0rem;
`;
const itemContainerStyle = css`
	//background: rgba(16, 18, 21, 0.5);
	//border: 1px solid #171c24;
	border-radius: 4rem;
	color: rgba(255, 255, 255, 0.6);
	width: 252rem;
	margin-bottom: 40px;
	overflow: hidden;
	margin-right: 32px;
	:hover {
		//background: rgba(16, 18, 21, 1);
	}

	.edit {
		display: none;
	}

	:hover {
		.edit {
			display: block !important;
			:hover {
				text-decoration: underline;
			}
		}
	}

	.view-build {
		color: #96a7ff;

		margin-left: 12rem;
		:hover {
			text-decoration: underline;
		}
	}
`;
const itemImageStyle = css`
	height: 183rem;
	width: 100%;
	border-radius: 4rem;

	border-width: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.1);
	overflow: hidden;
`;

function TestSearchableList() {
	const [project] = useAtom(currentProject);
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [tempTestId, setTempTest] = useAtom(tempTestAtom);
	const [tempTestName, setTempTestName] = useAtom(tempTestNameAtom);
	const [tempTestType, setTempTestType] = useAtom(tempTestTypeAtom);
	const [tempTestUpdateId, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);

	const [filters, setFilters] = useAtom(testFiltersAtom);
	const { query } = useRouter();

	const setPage = useCallback((page) => {
		setFilters({ ...filters, page });
	}, []);

	const [newTestCreated, setNewTestCreated] = useState(false);

	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});

	const totalPages = data.totalPages || 1;

	const testsItems = useMemo(() => {
		return data.list.map((test: IProjectTestItem) => {
			const { id } = test;

			return <TestCard testData={test} key={id} id={id} />;
		});
	}, [data.list]);

	const isZeroBuild = data && data.list.length === 0;
	const currentPage = filters.page || 0;

	useEffect(() => {
		if (!tempTestId || tempTestId === "null") return;

		(async () => {
			setTempTest(null);
			setTempTestName(null);

			if (tempTestType === "update") {
				await updateTest(tempTestId, tempTestUpdateId);
				sendSnackBarEvent({ message: "Updated the test", type: "success" });
			} else {
				await saveTest(selectedProjectId, tempTestId, !!tempTestName ? tempTestName : null);
				sendSnackBarEvent({ message: "Successfully saved the test", type: "success" });
			}

			setTempTestType(null);
			setTempTestUpdateId(null);

			await mutate(getTestListAPI(project.id));
			setNewTestCreated(true);
		})();
	}, []);

	return (
		<div>
			<Conditional showIf={data && data.list.length > 0}>
				<div css={testItemsGridContainerStyle} className={"flex"}>
					{testsItems}
				</div>
			</Conditional>

			<Conditional showIf={false && data && data.list.length === 0}>
				<EmptyList title={"You don't have any test."} subTitle={"Your software needs some love. Create a test to keep it healthy."} />
			</Conditional>

			<CreateTestPrompt />

			<Conditional showIf={!isZeroBuild}>
				<div className={"flex justify-center mt-64 mb-80"}>
					<PaginationButton
						isPreviousActive={currentPage > 0}
						isNextActive={currentPage < totalPages - 1}
						onPreviousClick={setPage.bind(this, currentPage - 1)}
						onNextClick={setPage.bind(this, currentPage + 1)}
					/>
				</div>
			</Conditional>
		</div>
	);
}

const testItemsGridContainerStyle = css`
	flex-wrap: wrap;
`;
export { TestSearchableList };
