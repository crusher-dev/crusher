import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import useSWR, { mutate } from "swr";
import { Conditional } from "dyson/src/components/layouts";
import { TestsList } from "dyson/src/components/sharedComponets/testList";
import { TestListContext } from "dyson/src/components/sharedComponets/utils/basic";
import { deleteTestApi, getTestListAPI } from "@constants/api";
import { IProjectTestsListResponse } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { useProjectDetails } from "@hooks/common";
import { tempTestTypeAtom } from "@store/atoms/global/temp/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/temp/tempTestUpdateId";
import { testFiltersAtom } from "@store/atoms/pages/testPage";
import CreateTestPrompt from "@ui/containers/tests/CreateTestPrompt";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { appStateAtom } from "../../../store/atoms/global/appState";
import { tempTestAtom } from "../../../store/atoms/global/temp/tempTestId";
import { tempTestNameAtom } from "../../../store/atoms/global/temp/tempTestName";
import { RequestMethod } from "../../../types/RequestOptions";
import { OpenDeepLinkPrompt } from "../dashboard/OpenDeepLinkPrompt";


const EditTest = dynamic(() => import("@ui/containers/tests/editTest"));

const saveTest = (projectId: number, tempTestId: string, customTestName: string | null = null) => {
	const testName = customTestName || new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10);
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

const SELECTED_TEST_MENU = [
	{ id: "edit", label: "Edit test", shortcut: null },
	{ id: "run", label: "Run test", shortcut: null },
	{ id: "rename", label: "Rename", shortcut: null },
	{ id: "delete", label: "Delete", shortcut: <div>Delete</div> },
];

const MULTI_SELECTED_MENU = [
	{ id: "run", label: "Run all", shortcut: null },
	{ id: "delete-all", label: "Delete all", shortcut: <div>Delete</div> },
];

function TestSearchableList() {
	const { currentProject: project } = useProjectDetails();
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [tempTestId, setTempTest] = useAtom(tempTestAtom);
	const [tempTestName, setTempTestName] = useAtom(tempTestNameAtom);
	const [tempTestType, setTempTestType] = useAtom(tempTestTypeAtom);
	const [tempTestUpdateId, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);
	const [showEditBox, setShowEditBox] = useState(false);
	const [currentRenameInput, setCurrentRenameInput] = useState(null);
	const [showRunTestPrompt, setShowRunTestPrompt] = useState(false);

	const [filters] = useAtom(testFiltersAtom);

	const [newTestCreated, setNewTestCreated] = useState(false);

	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});


	useEffect(() => {
		if (!tempTestId || tempTestId === "null") return;

		(async () => {
			setTempTest(null);
			setTempTestName(null);

			if (tempTestType === "update") {
				await updateTest(tempTestId, tempTestUpdateId);
				sendSnackBarEvent({ message: "Updated the test", type: "success" });
			} else {
				await saveTest(selectedProjectId, tempTestId, tempTestName || null);
				sendSnackBarEvent({ message: "Successfully saved the test", type: "success" });
			}

			setTempTestType(null);
			setTempTestUpdateId(null);

			await mutate(getTestListAPI(project.id));
			setNewTestCreated(true);
		})();
	}, []);

	const handleMenuCallback = async (id, selectedList) => {
		switch (id) {
			case "delete":
			case "delete-all":
				const filteredProjects = data.list.filter(({ id }) => !selectedList.includes(id));
				for (let i = 0; i < selectedList.length; i++) {
					backendRequest(deleteTestApi(selectedList[i]), {
						method: RequestMethod.POST,
						payload: {},
					});
				}
				await mutate(getTestListAPI(project.id), { ...data, list: filteredProjects }, false);
				break;
			case "run":
				const testIds = selectedList.join(",");
				window.location.href = `crusher://run-tests-in-local-build?tests=${testIds}`;
				setShowRunTestPrompt(true);
				break;
			case "edit":
				setShowEditBox(selectedList[0]);
				break;
			case "rename":
				setCurrentRenameInput(selectedList[0]);
				break;
		}
	};

	const currentEditTestInfo = data.list.find(({ id }) => id === showEditBox);

	return (
		<div css={testListCSS}>
			{showRunTestPrompt ? (<OpenDeepLinkPrompt onClose={setShowRunTestPrompt.bind(this, false)}/>) : ""}
			<Conditional showIf={data && data.list.length > 0}>

				<TestListContext.Provider value={{
					type: "web",
					runTest: (selectedList) => {
						const testIds = selectedList.join(",");
						window.location.href = `crusher://run-tests-in-local-build?tests=${testIds}`;
						setShowRunTestPrompt(true);
					},
					currentRenameInput,
					setCurrentRenameInput,
				}}>
					<TestsList contextMenu={{
						"single": {
							callback: handleMenuCallback,
							menuItems: SELECTED_TEST_MENU
						}, "multi": {
							callback: handleMenuCallback,
							menuItems: MULTI_SELECTED_MENU
						}
					}} onDelete={handleMenuCallback.bind(this, "delete")} onRename={handleMenuCallback.bind(this, "rename")} onEdit={handleMenuCallback.bind(this, "edit")} tests={data.list} />

				</TestListContext.Provider>
				{showEditBox ? (
					<EditTest
						id={showEditBox}
						name={currentEditTestInfo.testName}
						folderId={currentEditTestInfo.folderId}
						tags={currentEditTestInfo.tags}
						onClose={() => {
							setShowEditBox(false);
						}}
					/>
				) : ""}

			</Conditional>

			<Conditional showIf={data && data.list.length < 3}>
				<CreateTestPrompt />
			</Conditional>
		</div>
	);
}

const testListCSS = css`
	#test-header{
		max-width: 1298rem;
		width: calc(100vw - 342rem);
		margin: 0 auto;
		padding-left: 12rem !important;
		padding-right: 0 !important;
	}

	#test-item{
		max-width: 1208rem;
		width: calc(100vw - 340rem);
		margin: 0 auto;
		padding-left: 16rem!important;
		padding-right: 0!important;

		@media screen and (min-width: 1600px){
			max-width: 1304rem !important;
			width: calc(100vw - 342rem) !important;
		}
	}
`;

export { TestSearchableList };
