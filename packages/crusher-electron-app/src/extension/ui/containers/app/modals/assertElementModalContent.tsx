import React, { RefObject, useState } from "react";
import { useSelector } from "react-redux";
import { getActionsRecordingState } from "../../../../redux/selectors/recorder";
import { AssertionFormTable } from "../../../components/app/assertionFormTable";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import { ASSERTION_OPERATION_TYPE } from "../../../../interfaces/assertionOperation";
import { BulbIcon } from "../../../../assets/icons";
import uniqueId from "lodash/uniqueId";
import { getStore } from "../../../../redux/store";
import { recordAction } from "../../../../redux/actions/actions";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { updateActionsRecordingState } from "../../../../redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "../../../../interfaces/actionsRecordingState";
import { turnOffInspectModeInFrame } from "../../../../messageListener";
import { iElementInfo } from "@shared/types/elementInfo";
import { Button } from "../../../components/app/button";
import { TEXT_ALIGN } from "../../../../interfaces/css";
import { pxToRemValue } from "../../../../utils/helpers";

interface iAssertElementModalProps {
	onClose?: any;
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}

const getValidationFields = (elementInfo: iElementInfo): Array<iField> => {
	if (!elementInfo) return [];
	const innerHTML = elementInfo.innerHTML;
	const attributes = elementInfo.attributes;

	const MetaTagsFields = attributes.map((attribute) => {
		return {
			name: attribute.name,
			value: attribute.value,
			meta: { type: "ATTRIBUTE" },
		};
	});
	return [{ name: "innerHTML", value: innerHTML, meta: { type: "innerHTML" } }, ...MetaTagsFields];
};

const getElementFieldValue = (fieldInfo: iField) => {
	return fieldInfo.value;
};

const AssertElementModalContent = (props: iAssertElementModalProps) => {
	const { onClose, deviceIframeRef } = props;
	const recordingState = useSelector(getActionsRecordingState);
	const elementInfo: iElementInfo = recordingState.elementInfo as iElementInfo;

	const [validationRows, setValidationRows] = useState([] as Array<iAssertionRow>);
	const validationFields = getValidationFields(elementInfo!);
	const validationOperations = [ASSERTION_OPERATION_TYPE.MATCHES, ASSERTION_OPERATION_TYPE.CONTAINS, ASSERTION_OPERATION_TYPE.REGEX];

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

	const addValidationRows = (
		rows: Array<{
			field: iField;
			operation: ASSERTION_OPERATION_TYPE;
			validation: string;
		}>,
	) => {
		const newValidationRows = [...validationRows];
		for (let i = 0; i < rows.length; i++) {
			newValidationRows.push({
				id: uniqueId("generate-checks-row"),
				field: rows[i].field,
				operation: rows[i].operation,
				validation: rows[i].validation,
			});
		}
		setValidationRows([...newValidationRows]);
	};

	const createNewElementAssertionRow = () => {
		addValidationRow(validationFields[0], validationOperations[0], getElementFieldValue(validationFields[0]));
	};

	const generateDefaultChecksForPage = () => {
		const newValidationRowsData = [];
		for (let i = 0; i < validationFields.length; i++) {
			newValidationRowsData.push({
				field: validationFields[i],
				operation: ASSERTION_OPERATION_TYPE.MATCHES,
				validation: getElementFieldValue(validationFields[i]),
			});
		}
		addValidationRows(newValidationRowsData);
	};

	const updateFieldOfValidationRow = (newFieldName: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");
		const newField = validationFields.find((validationField) => validationField.name === newFieldName);
		if (!newField) throw new Error("Invalid field provided for validation row");

		validationRows[rowIndex].field = newField;
		validationRows[rowIndex].validation = getElementFieldValue(newField);
		setValidationRows([...validationRows]);
	};

	const updateOperationOfValidationRow = (newFieldName: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");

		validationRows[rowIndex].operation = newFieldName;
		setValidationRows([...validationRows]);
	};

	const updateValidationValueOfValidationRow = (newValidationValue: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw new Error("Invalid id for validation row");

		validationRows[rowIndex].validation = newValidationValue;
		setValidationRows([...validationRows]);
	};

	const saveElementValidationAction = () => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ACTIONS_IN_TEST.ASSERT_ELEMENT,
				payload: {
					selectors: elementInfo.selectors,
					meta: {
						validations: validationRows,
					},
				},
				url: "",
			}),
		);
		store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
		turnOffInspectModeInFrame(deviceIframeRef);

		if (onClose) {
			onClose();
		}
	};

	return (
		<div style={containerStyle(validationRows.length)}>
			<AssertionFormTable
				rowItems={validationRows}
				fields={validationFields}
				operations={validationOperations}
				onFieldChange={updateFieldOfValidationRow}
				onOperationChange={updateOperationOfValidationRow}
				onValidationChange={updateValidationValueOfValidationRow}
			/>
			<div style={bottomBarStyle}>
				<div style={formButtonStyle}>
					<div style={advanceLinkContainerStyle} onClick={createNewElementAssertionRow}>
						<span>{"Add a check"}</span>
						<span style={{ marginLeft: "0.5rem" }}>
							<img width={12} src={chrome.extension.getURL("/icons/arrow_down.svg")} />
						</span>
					</div>
					<div style={generateChecksContainerStyle} onClick={generateDefaultChecksForPage}>
						<BulbIcon style={bulbIconStyle} />
						<div id={"modal-generate-test"} style={generateTextStyle}>
							Generate Checks!
						</div>
					</div>
				</div>
				<Button style={saveButtonStyle} title={"Save action"} onClick={saveElementValidationAction}></Button>
			</div>
		</div>
	);
};

const containerStyle = (areRowsPresent) => {
	return { marginTop: areRowsPresent ? pxToRemValue(36) : pxToRemValue(24) };
};
const bottomBarStyle = {
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	marginTop: "1.5rem",
};
const formButtonStyle = {
	color: "#5B76F7",
	marginRight: "auto",
	fontFamily: "DM Sans",
	fontSize: "0.9rem",
	textDecorationLine: "underline",
	fontWeight: 900,
	cursor: "pointer",
	display: "flex",
};
const advanceLinkContainerStyle = {
	display: "flex",
	alignItems: "center",
};
const generateChecksContainerStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	marginLeft: "1.935rem",
};
const bulbIconStyle = {
	position: "relative",
	top: "-0.15rem",
};
const generateTextStyle = {
	marginLeft: "0.3rem",
	color: "#fff",
	textDecoration: "underline",
	fontSize: "0.9rem",
	cursor: "pointer",
};
const saveButtonStyle = {
	fontSize: "0.9rem",
	padding: "10px 32px",
	textAlign: TEXT_ALIGN.CENTER,
	color: "#fff",
	marginLeft: 24,
};

export { AssertElementModalContent };
