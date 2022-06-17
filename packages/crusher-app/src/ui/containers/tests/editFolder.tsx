import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import React from "react";

import { useAtom } from "jotai";
import useSWR, { mutate } from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { changeTestInfoAPI, deleteFolderAPI, deleteTestApi, getTestListAPI, updateFolderAPI } from "@constants/api";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { currentProject } from "../../../store/atoms/global/project";
import { RequestMethod } from "../../../types/RequestOptions";
import { SelectBox } from "../../../../../dyson/src/components/molecules/Select/Select";
import { TextBlock } from "../../../../../dyson/src/components/atoms/textBlock/TextBlock";
import { IProjectTestsListResponse } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { sentenceCase } from "@utils/common/textUtils";

const changeFolderData = (projectId: number, folderId: number, name: string) => {
	return backendRequest(updateFolderAPI(projectId), {
		method: RequestMethod.POST,
		payload: {
			name: name,
			folderId: folderId,
		},
	});
};

const deleteFolderInServer = (projectId: number, folderId: number) => {
	return backendRequest(deleteFolderAPI(projectId), {
		method: RequestMethod.POST,
		payload: { folderId },
	});
};

export const getOptions = ({ list }, id) => {
	return list.filter((listItem) => listItem.id !== id).map((listItem) => ({ label: sentenceCase(listItem.testName), value: listItem.id }));
};

export const EditFolderModal = ({ name, id, onClose }) => {
	const [folderName, changeFolderName] = useState(name);
	const [processing, setProcessing] = useState(false);
	const [processingDelete, setProcessingDelete] = useState(false);
	const [project] = useAtom(currentProject);

	const isFormChanged = name !== folderName;
	const changeTestNameCallback = useCallback(() => {
		(async () => {
			try {
				await changeFolderData(project.id, id, folderName);
				sendSnackBarEvent({ type: "normal", message: "Changes have been saved." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch (e) {
				console.error(e);
				sendSnackBarEvent({ type: "error", message: "Failed to save changes" });
			}
			setProcessing(false);
		})();
		setProcessing(true);
	}, [folderName]);

	const deleteFolder = useCallback(() => {
		(async () => {
			try {
				await deleteFolderInServer(project.id, id);
				sendSnackBarEvent({ type: "normal", message: "We have deleted the folder." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch {
				sendSnackBarEvent({ type: "error", message: "Failed to delete folder." });
			}
			setProcessingDelete(false);
		})();
		setProcessingDelete(true);
	}, []);
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
				Folder name
			</div>
			<Input
				placeholder={"User login flow?"}
				css={css`
					width: 100%;
				`}
				onChange={(e: React.FormEvent<HTMLInputElement>) => {
					changeFolderName(e.currentTarget.value);
				}}
				initialValue={name}
				size={"medium"}
			/>

			<div className={"flex justify-end mt-20"}>
				<Button
					css={css`
						min-width: 112rem;
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
				<Button bgColor={"danger"} impactLevel={"low"} size={"x-small"} onClick={deleteFolder}>
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

export default EditFolderModal;
