import React, { useState } from "react";
import { useStore } from "react-redux";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import uniqueId from "lodash/uniqueId";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../topBar";
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Button } from "@dyson/components/atoms/button/Button";
import { recordStep, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { AssertionFormTable, ASSERTION_OPERATION_TYPE } from "../../forms/assertionForm";
import { iSeoMetaInformationMeta } from "../../../../../../types";
import { Conditional } from "@dyson/components/layouts";
import { ipcRenderer } from "electron";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { sendSnackBarEvent } from "../../toast";
import { retryStep } from "electron-app/src/_ui/ui/screens/recorder/sidebar/stepsPanel/failedCard";

interface iSEOModalProps {
	stepIndex?: number;
	stepAction?: iAction;
	handleClose?: () => void;
	isOpen: boolean;
}

const getValidationFields = (seoInfo: iSeoMetaInformationMeta): iField[] => {
	if (!seoInfo) return [];
	const { title } = seoInfo;
	const metaTags = Object.values(seoInfo.metaTags);

	const MetaTagsFields = metaTags.map((metaTag) => {
		return { name: metaTag.name, value: metaTag.value, meta: { type: "META" } };
	});
	return [{ name: "title", value: title, meta: { type: "TITLE" } }, ...MetaTagsFields];
};

const getSeoFieldValue = (fieldInfo: iField) => {
	return fieldInfo.value;
};

const SeoModalContent = (props: iSEOModalProps) => {
	const { isOpen, handleClose } = props;
	const [seoInfo, setSeoInfo] = React.useState(null);

	const store = useStore();

	const [validationRows, setValidationRows] = useState([] as iAssertionRow[]);
	const validationFields = getValidationFields(seoInfo!);
	const validationOperations = [ASSERTION_OPERATION_TYPE.MATCHES, ASSERTION_OPERATION_TYPE.CONTAINS, ASSERTION_OPERATION_TYPE.REGEX];
	React.useEffect(() => {
		if (isOpen && !props.stepIndex) {
			setValidationRows([]);
			ipcRenderer.invoke("get-page-seo-info").then((res) => {
				setSeoInfo(res);
			});
		}
		if (isOpen && props.stepAction) {
			const seoInfoFromActions = (props.stepAction.payload.meta.validations as iAssertionRow[]).reduce(
				(prev, validation) => {
					if (validation.field.name === "title") {
						return { ...prev, title: validation.field.value };
					}
					return { ...prev, metaTags: { ...prev.metaTags, [validation.field.name]: { name: validation.field.name, value: validation.field.value } } };
				},
				{ title: null, metaTags: {} },
			);
				ipcRenderer.invoke("get-page-seo-info").then((res) => {
					setSeoInfo(res);
				});
			setValidationRows(props.stepAction.payload.meta.validations);
		}
	}, [props.stepAction, isOpen]);

	const addValidationRow = (rowField: iField, rowOperation: ASSERTION_OPERATION_TYPE, rowValidation: string) => {
		setValidationRows([
			...validationRows,
			{
				id: uniqueId("new-row"),
				field: rowField,
				operation: rowOperation,
				validation: rowValidation,
			},
		]);
	};

	const createNewSeoAssertionRow = () => {
		addValidationRow(validationFields[0], validationOperations[0], getSeoFieldValue(validationFields[0]));
	};

	const generateDefaultChecksForPage = () => {
		const newValidationRowsData = [];
		for (let i = 0; i < validationFields.length; i++) {
			newValidationRowsData.push({
				id: uniqueId("generate-checks-row"),
				field: validationFields[i],
				operation: ASSERTION_OPERATION_TYPE.MATCHES,
				validation: getSeoFieldValue(validationFields[i]),
			});
		}
		setValidationRows(newValidationRowsData.slice());
	};

	const updateFieldOfValidationRow = (newFieldName: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");
		const newField = validationFields.find((validationField) => validationField.name === newFieldName);
		if (!newField) throw new Error("Invalid field provided for validation row");

		validationRows[rowIndex].field = newField;
		validationRows[rowIndex].validation = getSeoFieldValue(newField);
		setValidationRows(validationRows.slice());
	};

	const updateOperationOfValidationRow = (newFieldName: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");

		validationRows[rowIndex].operation = newFieldName;
		setValidationRows(validationRows.slice());
	};

	const updateValidationValueOfValidationRow = (newValidationValue: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");

		validationRows[rowIndex].validation = newValidationValue;
		setValidationRows(validationRows.slice());
	};

	const deleteValidationRow = (rowIndex) => {
		const newValidationRows = validationRows.filter((a) => a.id !== rowIndex);
		setValidationRows(newValidationRows.slice());
	};

	const saveSeoValidationAction = () => {
		store.dispatch(
			recordStep(
				{
					type: ActionsInTestEnum.VALIDATE_SEO,
					payload: {
						meta: {
							validations: validationRows,
						},
					},
					url: "",
				},
				ActionStatusEnum.COMPLETED,
			),
		);
		handleClose();
	};

	const updateSeoValidationAction = () => {
		if (!props.stepAction) {
			sendSnackBarEvent({ type: "error", message: "No action to update" });
			return;
		}

		props.stepAction.payload.meta.validations = validationRows;
		store.dispatch(updateRecordedStep(props.stepAction, props.stepIndex));
		retryStep(props.stepIndex);
		sendSnackBarEvent({ type: "success", message: "Updated seo validations" });
		handleClose();
	};

	if (!isOpen) return null;

	return (
		<Modal id="current-modal" modalStyle={modalStyle} onOutsideClick={handleClose}>
			<ModalTopBar title={"SEO Checks"} desc={"These are run when page is loaded"} closeModal={handleClose} />
			<div
				css={css`
					padding: 0rem 34rem;
					margin-top: 8rem;
				`}
			>
				<Conditional showIf={seoInfo === null}>
					<span
						css={css`
							font-size: 14rem;
							color: #fff;
						`}
					>
						Loading...
					</span>
				</Conditional>
				<Conditional showIf={seoInfo !== null}>
					<AssertionFormTable
						rowItems={validationRows}
						fields={validationFields}
						operations={validationOperations}
						onFieldChange={updateFieldOfValidationRow}
						onOperationChange={updateOperationOfValidationRow}
						deleteValidationRow={deleteValidationRow}
						onValidationChange={updateValidationValueOfValidationRow}
					/>
				</Conditional>
				<div
					style={bottomBarStyle}
					css={css`
						margin-bottom: 22rem;
						margin-top: 38rem;
					`}
				>
					<div style={formButtonStyle}>
						<Text css={linkStyle} onClick={createNewSeoAssertionRow}>
							+ Add a check
						</Text>
						<Text
							css={[
								linkStyle,
								css`
									margin-left: 24rem;
								`,
							]}
							onClick={generateDefaultChecksForPage}
						>
							Generate Checks!
						</Text>
					</div>
					<Button css={buttonStyle} onClick={props.stepAction ? updateSeoValidationAction : saveSeoValidationAction}>
						{props.stepAction ? "Update" : "Save"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const linkStyle = css`
	color: #fff !important;
	font-size: 13rem !important;
	&:hover {
		opacity: 0.9 !important;
		text-decoration: underline;
		text-underline-offset: 2rem;
	}
`;

const buttonStyle = css`
	font-size: 13rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	height: 34rem;
	padding: 4rem 8rem;
	min-width: 100rem;
	border: none;
`;

const modalStyle = css`
	width: 700rem;
	min-height: auto !important;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem;
	background: #0D0E0E;
    border: 1px solid rgba(142, 142, 142, 0.1);
`;

const bottomBarStyle = {
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
};
const formButtonStyle = {
	color: "#5B76F7",
	marginRight: "auto",
	fontFamily: "Gilroy",
	fontWeight: 700,
	display: "flex",
};

export { SeoModalContent };
