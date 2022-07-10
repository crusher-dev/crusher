import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import React from "react";

import { useAtom } from "jotai";
import useSWR, { mutate } from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { changeTestInfoAPI, deleteTestApi, getTestListAPI } from "@constants/api";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { currentProject } from "../../../store/atoms/global/project";
import { RequestMethod } from "../../../types/RequestOptions";
import { SelectBox } from "../../../../../dyson/src/components/molecules/Select/Select";
import { TextBlock } from "../../../../../dyson/src/components/atoms/textBlock/TextBlock";
import { IProjectTestsListResponse } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { sentenceCase } from "@utils/common/textUtils";
import { testFiltersAtom } from "@store/atoms/pages/testPage";

const changeTestData = (testId: number, name: string, selectedFolder: string | null) => {
	return backendRequest(changeTestInfoAPI(testId), {
		method: RequestMethod.POST,
		payload: {
			name: name,
			testFolder: selectedFolder,
		},
	});
};

const deleteTestInServer = (testId: number) => {
	return backendRequest(deleteTestApi(testId), {
		method: RequestMethod.POST,
		payload: {},
	});
};

export const getOptions = ({ list }, id) => {
	return list.filter((listItem) => listItem.id !== id).map((listItem) => ({ label: sentenceCase(listItem.testName), value: listItem.id }));
};

export const EditTestModal = ({ name, folderId, id, onClose, tags }) => {
	const [testName, changeTestName] = useState(name);
	const [processing, setProcessing] = useState(false);
	const [processingDelete, setProcessingDelete] = useState(false);
	const [project] = useAtom(currentProject);
	const [selectedFolder, setSelectedFolder] = useState(!!folderId ? [folderId] : []);

	const selectedFolderId = selectedFolder.length > 0 && selectedFolder[0];
	const isFormChanged = testName !== name || folderId !== selectedFolderId;

	const [filters] = useAtom(testFiltersAtom);
	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: 200000,
	});

	const changeTestNameCallback = useCallback(() => {
		(async () => {
			try {
				await changeTestData(id, testName, selectedFolder.length > 0 ? selectedFolder[0] : null);
				sendSnackBarEvent({ type: "normal", message: "Changes have been saved." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch {
				sendSnackBarEvent({ type: "error", message: "Failed to save changes" });
			}
			setProcessing(false);
		})();
		setProcessing(true);
	}, [testName, selectedFolder]);

	const deleteTest = useCallback(() => {
		(async () => {
			try {
				await deleteTestInServer(id);
				sendSnackBarEvent({ type: "normal", message: "We have deleted this test." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch {
				sendSnackBarEvent({ type: "error", message: "Failed to delete test." });
			}
			setProcessingDelete(false);
		})();
		setProcessingDelete(true);
	}, []);

	let folders = data.folders.map((folder) => ({ label: folder.name, value: folder.id }));

	if (folderId) {
		folders = [{ label: "No folder", value: null }, ...folders];
	}

	return (
		<Modal
			onOutsideClick={onClose}
			onClose={() => {
				onClose();
			}}
			modalStyle={css`
				padding-left: 28rem;
				padding-right: 28rem;
			`}
		>
			<div className={"font-cera text-16 font-600 leading-none"}>Edit info</div>

			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
				`}
			>
				Test name
			</div>
			<Input
				placeholder={"User login flow?"}
				css={css`
					width: 100%;
				`}
				onChange={(e: React.FormEvent<HTMLInputElement>) => {
					changeTestName(e.currentTarget.value);
				}}
				initialValue={name}
				size={"medium"}
			/>

			<div className={"flex mt-24 "}>
				<div className={"w-full mr-32"}>
					<TextBlock
						css={css`
							color: #d8d8d8;
						`}
						className={"mb-12"}
						fontSize={"12.4"}
						weight={600}
					>
						Folder
					</TextBlock>

					<SelectBox
						selected={selectedFolder}
						css={css`
							width: 50%;
						`}
						values={folders}
						isMultiSelect={false}
						isSearchable={true}
						size={"medium"}
						placeholder={"Select folder"}
						callback={(e) => {
							setSelectedFolder(e);
						}}
					/>
				</div>
			</div>
			<div className={"flex justify-end mt-20"}>
				<Button
					css={css`
						min-width: 104rem;
					`}
					disabled={!isFormChanged || processing}
					bgColor={!isFormChanged ? "disabled" : ""}
					title={!isFormChanged && "Please change form to save"}
					size={"small"}
					onClick={changeTestNameCallback}
				>
					<div className={"flex justify-center items-center"}>
						<Conditional showIf={processing}>
							<LoadingSVG
								css={css`
									margin-right: 8rem !important;
								`}
								color={"#fff"}
								height={"16rem"}
								width={"16rem"}
							/>
						</Conditional>
						Save
					</div>
				</Button>
			</div>

			<div className={"flex mt-24 items-center justify-between"}>
				<div
					className={"mt-12 text-13 font-600 mb-16 mr-24"}
					css={css`
						color: #d8d8d8;
					`}
				>
					Or take action
				</div>
				<Button bgColor={"danger"} impactLevel={"low"} size={"x-small"} onClick={deleteTest}>
					<div className={"flex justify-center items-center pt-2"}>
						<Conditional showIf={processingDelete}>
							<LoadingSVG
								css={css`
									margin-right: 8rem !important;
								`}
								color={"#fff"}
								height={"16rem"}
								width={"16rem"}
							/>
						</Conditional>
						Delete
					</div>
				</Button>
			</div>
		</Modal>
	);
};

export default EditTestModal;
