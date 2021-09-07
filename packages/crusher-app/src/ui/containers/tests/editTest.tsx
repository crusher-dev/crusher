import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import React from "react";

import { useAtom } from "jotai";
import { mutate } from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { changeTestInfoAPI, deleteTestApi, getTestListAPI } from "@constants/api";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { currentProject } from "../../../store/atoms/global/project";
import { RequestMethod } from "../../../types/RequestOptions";

const changeTestNameInServer = (testId: number, name: string) => {
	return backendRequest(changeTestInfoAPI(testId), {
		method: RequestMethod.POST,
		payload: {
			name: name,
		},
	});
};

const deleteTestInServer = (testId: number) => {
	return backendRequest(deleteTestApi(testId), {
		method: RequestMethod.POST,
		payload: {},
	});
};

export const EditTestModal = ({ name, id, onClose }) => {
	const [testName, changeTestName] = useState(name);
	const [processing, setProcessing] = useState(false);
	const [processingDelete, setProcessingDelete] = useState(false);
	const [project] = useAtom(currentProject);
	const isNameSame = testName === name;

	const changeTestNameCallback = useCallback(() => {
		(async () => {
			try {
				await changeTestNameInServer(id, testName);
				sendSnackBarEvent({ type: "normal", message: "Changes have been saved." });
				await mutate(getTestListAPI(project.id));
				onClose();
			} catch {
				sendSnackBarEvent({ type: "error", message: "Failed to save changes" });
			}
			setProcessing(false);
		})();
		setProcessing(true);
	}, [testName]);

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
			/>

			<div className={"flex justify-end mt-12"}>
				<Button
					css={css`
						min-width: 132rem;
					`}
					disabled={isNameSame || processing}
					bgColor={isNameSame ? "disabled" : ""}
					title={isNameSame && "Please enter project name"}
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

			<div className={"flex mt-32 items-center justify-between"}>
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
						min-width: 122rem;
						color: #e74174 !important;
						border: 1px solid #c93965;
						background-color: #101215;

						:hover {
							background-color: #1e2126 !important;
						}
					`}
					size={"small"}
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
