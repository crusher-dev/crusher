import React, { ChangeEvent, useState, useMemo, useEffect } from "react";
import { CompleteStatusIconSVG, LoadingSVG } from "@svg/dashboard";
import { css } from "@emotion/react";
import { SearchFilterBar } from "../common/searchFilterBar";
import useSWR, { mutate } from "swr";
import { getTestListAPI } from "@constants/api";
import { useAtom } from "jotai";
import { currentProject } from "../../../store/atoms/global/project";
import { IProjectTestsListResponse, IProjectTestItem } from "@crusher-shared/types/response/iProjectTestsListResponse";
import dynamic from "next/dynamic";
import { Conditional } from "dyson/src/components/layouts";
import { tempTestAtom } from "../../../store/atoms/global/tempTestId";
import { sendSnackBarEvent } from "@utils/notify";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../../types/RequestOptions";
import { appStateAtom } from "../../../store/atoms/global/appState";
import { timeSince } from "@utils/dateTimeUtils";
import { TestStatusSVG } from "@svg/testReport";
import { PaginationButton } from "../../../../../dyson/src/components/molecules/PaginationButton";

interface IBuildItemCardProps {
	id: number;
	testName: string;
	isPassing: boolean;
	imageURL: string | null;
	videoURL: null | string;
	firstRunCompleted: boolean;
	// In seconds
	createdAt: number;
}

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));
const FirstTestRunStatus = dynamic(() => import("@ui/containers/tests/firstTestStatus"));
const EditTest = dynamic(() => import("@ui/containers/tests/editTest"));

const saveTest = (projectId: number, tempTestId: string) => {
	const testName = new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10);
	return backendRequest(`/projects/${projectId}/tests/actions/create`, {
		method: RequestMethod.POST,
		payload: { tempTestId, name: testName },
	});
};

function TestCard(props: IBuildItemCardProps) {
	const { testName, id, isPassing, createdAt, imageURL, videoURL, firstRunCompleted } = props;
	const statusIcon = isPassing ? (
		<TestStatusSVG type={"PASSED"} height={16} />
	) : (
		<TestStatusSVG type={firstRunCompleted ? "FAILED" : "RUNNING"} height={16} />
	);

	console.log("VIDEO URL IS", videoURL);
	const shouldPlayVideo = !imageURL && !!videoURL;

	const [showEditBox, setShowEditBox] = useState(false);
	return (
		<div
			css={itemContainerStyle}
			onClick={() => {
				!showEditBox && setShowEditBox(true);
			}}
		>
			<Conditional showIf={showEditBox}>
				<EditTest
					id={id}
					name={testName}
					onClose={() => {
						setShowEditBox(false);
					}}
				/>
			</Conditional>

			<div css={itemImageStyle}>
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
							height: 100%;
						`}
						onMouseOver={(event) => event.target.play()}
						onMouseOut={(event) => {
							event.target.pause();
							event.target.currentTime = 0;
						}}
						muted={true}
					>
						<source src={videoURL} type="video/mp4" />
					</video>
				</Conditional>
			</div>
			<div css={itemMainContainerStyle}>
				<div className={"flex flex-row items-center"}>
					<div css={testNameStyle} className={"font-cera"}>
						{testName}
					</div>
					<Conditional showIf={isPassing}>
						<div className={"ml-auto"}>{statusIcon}</div>
					</Conditional>
				</div>
				<div css={createdAtStyle} className={"flex justify-between mt-24 text-13"}>
					<span>{timeSince(new Date(createdAt))}</span>
					<span className={"edit"}>Edit</span>
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
	background: rgba(16, 18, 21, 0.5);
	padding: 20rem 16rem;
`;
const itemContainerStyle = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	border-radius: 8rem;
	color: rgba(255, 255, 255, 0.6);
	width: 252rem;
	margin-bottom: 40px;
	overflow: hidden;
	margin-right: 32px;
	:hover {
		background: rgba(16, 18, 21, 1);
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
`;
const itemImageStyle = css`
	height: 183rem;
	width: 100%;
	border-top-left-radius: 12rem;
	border-top-right-radius: 12rem;
	border-width: 0;
`;

function TestSearchableList() {

	const [project] = useAtom(currentProject);
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [tempTestId, setTempTest] = useAtom(tempTestAtom);
	const [newTestCreated, setNewTestCreated] = useState(false);

	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});

	const testsItems = useMemo(() => {
		return data.list.map((test: IProjectTestItem) => {
			const { testName, isPassing, createdAt, imageURL, videoURL, id, firstRunCompleted } = test;

			return (
				<TestCard
					firstRunCompleted={firstRunCompleted}
					videoURL={videoURL}
					imageURL={imageURL}
					testName={testName}
					isPassing={isPassing}
					createdAt={createdAt}
					key={id}
					id={id}
				/>
			);
		});
	}, [data.list]);


	useEffect(() => {

		if (!tempTestId || tempTestId==="null") return;

		(async () => {
			setTempTest(null);

			await saveTest(selectedProjectId, tempTestId);
			sendSnackBarEvent({ message: "Successfully saved the test", type: "success" });

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

			<Conditional showIf={data && data.list.length === 0}>
				<EmptyList title={"You don't have any test."} subTitle={"Your software needs some love. Create a test to keep it healthy."} />
			</Conditional>
		</div>
	);
}

const testItemsGridContainerStyle = css`
	flex-wrap: wrap;
`;
export { TestSearchableList };
