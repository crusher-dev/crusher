import React, { ChangeEvent, useState, useMemo, useEffect } from "react";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { css } from "@emotion/react";
import { SearchFilterBar } from "../common/searchFilterBar";
import { getTime } from "@utils/helpers";
import useSWR from "swr";
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
interface IBuildItemCardProps {
	testName: string;
	isPassing: boolean;
	imageURL: string | null;
	videoURL: null | string;
	// In seconds
	createdAt: number;
}

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));

const saveTest = (projectId: number, tempTestId: string) => {
	const testName = new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10);
	return backendRequest(`/projects/${projectId}/tests/actions/create`, {
		method: RequestMethod.POST,
		payload: { tempTestId, name: testName },
	});
};

function TestCard(props: IBuildItemCardProps) {
	const { testName, isPassing, createdAt, imageURL } = props;

	const statusIcon = isPassing ? <CompleteStatusIconSVG isCompleted={true} /> : <CompleteStatusIconSVG isCompleted={false} />;

	return (
		<div css={itemContainerStyle}>
			<img css={itemImageStyle} src={imageURL} />
			<div css={itemMainContainerStyle}>
				<div className={"flex flex-row items-center"}>
					<div css={testNameStyle} className={"font-cera"}>
						{testName}
					</div>
					<div className={"ml-auto"}>{statusIcon}</div>
				</div>
				<div css={createdAtStyle} className={"mt-24 text-13"}>
					{getTime(createdAt)}
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
`;
const itemImageStyle = css`
	height: 183rem;
	width: 100%;
	border-top-left-radius: 12rem;
	border-top-right-radius: 12rem;
	border-width: 0;
`;

function TestSearchableList() {
	const [searchQuery, setSearchQuery] = useState(null as null | string);
	const [project] = useAtom(currentProject);
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [tempTestId, setTempTest] = useAtom(tempTestAtom);
	const [newTestCreated, setNewTestCreated] = useState(false);

	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, newTestCreated), { suspense: true });

	const testsItems = useMemo(() => {
		return data.map((test: IProjectTestItem) => {
			const { testName, isPassing, createdAt, imageURL, videoURL, id } = test;

			return <TestCard videoURL={videoURL} imageURL={imageURL} testName={testName} isPassing={isPassing} createdAt={createdAt} key={id} />;
		});
	}, [data]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	useEffect(() => {
		if (!tempTestId) return;
		(async () => {
			setTempTest(null);

			await saveTest(selectedProjectId, tempTestId);
			sendSnackBarEvent({ message: "Successfully saved the test", type: "success" });
			setNewTestCreated(true);
		})();
	}, []);

	return (
		<div>
			<Conditional showIf={data && data.length > 0}>
				<SearchFilterBar placeholder={"Search tests"} handleInputChange={handleInputChange} value={searchQuery!} />
				<div css={testItemsGridContainerStyle} className={"flex mt-44"}>
					{testsItems}
				</div>
			</Conditional>

			<Conditional showIf={data && data.length === 0}>
				<EmptyList title={"You don't have any test."} subTitle={"Your software needs some love. Create a test to keep it healthy."} />
			</Conditional>
		</div>
	);
}

const testItemsGridContainerStyle = css`
	flex-wrap: wrap;
`;
export { TestSearchableList };
