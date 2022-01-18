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

const changeTestData = (testId: number, name: string, testTags?: string, runAfterTest?: number) => {
	return backendRequest(changeTestInfoAPI(testId), {
		method: RequestMethod.POST,
		payload: {
			name: name,
			tags: testTags,
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

export const EditTestModal = ({ name, id, onClose, tags }) => {
	const [testName, changeTestName] = useState(name);
	const [testTags, changeTags] = useState(tags);
	const [processing, setProcessing] = useState(false);
	const [processingDelete, setProcessingDelete] = useState(false);
	const [project] = useAtom(currentProject);
	const isFormChanged = testName !== name  || testTags !== tags;


	const changeTestNameCallback = useCallback(() => {
		(async () => {
			try {
				await changeTestData(id, testName, testTags);
				sendSnackBarEvent({ type: "normal", message: "Changes have been saved." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch {
				sendSnackBarEvent({ type: "error", message: "Failed to save changes" });
			}
			setProcessing(false);
		})();
		setProcessing(true);
	}, [testName, testTags]);

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
	return (
		<Modal
			onOutsideClick={onClose}
			onClose={() => {
				onClose();
			}}
		>
			<div className={"font-cera text-16 font-600 leading-none"}>Edit info</div>

			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
				`}
			>
				Enter test name
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
						Tag
					</TextBlock>

					<Input
						size={"medium"}
						onChange={(e: React.FormEvent<HTMLInputElement>) => {
							changeTags(e.currentTarget.value);
						}}
						css={css`max-width: 40%`}
						initialValue={testTags}
					/>
				</div>
			</div>
			<div className={"flex justify-end mt-20"}>
				<Button
					css={css`
						min-width: 132rem;
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
				<Button
					css={css`
						min-width: 96rem;
						color: #e74174 !important;
						border: 1px solid #c93965;
						background-color: #101215;

						:hover {
							background-color: #1e2126 !important;
						}
					`}
					size={"x-small"}
					onClick={deleteTest}
				>
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
