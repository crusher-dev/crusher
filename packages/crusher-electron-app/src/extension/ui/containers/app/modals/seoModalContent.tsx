import React, { useState } from "react";
import { AssertionFormTable } from "../../../components/app/assertionFormTable";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import { ASSERTION_OPERATION_TYPE } from "../../../../interfaces/assertionOperation";
import { iSeoMetaInformationMeta } from "../../../../messageListener";
import { TEXT_ALIGN } from "../../../../interfaces/css";
import { BulbIcon } from "../../../../assets/icons";
import uniqueId from "lodash/uniqueId";
import { getStore } from "../../../../redux/store";
import { recordAction } from "../../../../redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { Button } from "../../../components/app/button";
import { pxToRemValue } from "../../../../utils/helpers";

interface iSEOModalProps {
	onClose?: any;
}

const getValidationFields = (seoInfo: iSeoMetaInformationMeta): iField[] => {
	if (!seoInfo) return [];
	const { title } = seoInfo;
	const metaTags = Object.values(seoInfo.metaTags);

	const MetaTagsFields = metaTags.map((metaTag) => ({
		name: metaTag.name,
		value: metaTag.value,
		meta: { type: "META" },
	}));
	return [{ name: "title", value: title, meta: { type: "TITLE" } }, ...MetaTagsFields];
};

const getSeoFieldValue = (fieldInfo: iField) => fieldInfo.value;

const SeoModalContent = (props: iSEOModalProps) => {
	const { onClose } = props;
	const [validationRows, setValidationRows] = useState([] as iAssertionRow[]);
	const validationFields = getValidationFields(seoInfo!);
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
		if (rowIndex === -1) throw Error("Invalid id for validation row");
		const newField = validationFields.find((validationField) => validationField.name === newFieldName);
		if (!newField) throw Error("Invalid field provided for validation row");

		validationRows[rowIndex].field = newField;
		validationRows[rowIndex].validation = getSeoFieldValue(newField);
		setValidationRows(validationRows.slice());
	};

	const updateOperationOfValidationRow = (newFieldName: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw Error("Invalid id for validation row");

		validationRows[rowIndex].operation = newFieldName;
		setValidationRows(validationRows.slice());
	};

	const updateValidationValueOfValidationRow = (newValidationValue: string, rowId: string) => {
		const rowIndex = validationRows.findIndex((validationRow) => validationRow.id === rowId);
		if (rowIndex === -1) throw Error("Invalid id for validation row");

		validationRows[rowIndex].validation = newValidationValue;
		setValidationRows(validationRows.slice());
	};

	const saveSeoValidationAction = () => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ActionsInTestEnum.VALIDATE_SEO,
				payload: {
					meta: {
						validations: validationRows,
					},
				},
				url: "",
			}),
		);
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
					<div style={advanceLinkContainerStyle} onClick={createNewSeoAssertionRow}>
						<span>Add a check</span>
						<span style={{ marginLeft: "0.5rem" }}>
							<img width={12} src={chrome.extension.getURL("/icons/arrow_down.svg")} />
						</span>
					</div>
					<div style={generateChecksContainerStyle} onClick={generateDefaultChecksForPage}>
						<BulbIcon style={bulbIconStyle} />
						<div id={"modal-generate-checks-seo"} style={generateTextStyle}>
							Generate Checks!
						</div>
					</div>
				</div>
				<Button title={"Save action"} style={saveButtonStyle} onClick={saveSeoValidationAction}></Button>
			</div>
		</div>
	);
};

const containerStyle = (areRowsPresent) => ({
	marginTop: areRowsPresent ? pxToRemValue(36) : pxToRemValue(24),
});
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
	padding: "10px 32px",
	fontSize: "0.9rem",
	textAlign: TEXT_ALIGN.CENTER,
	color: "#fff",
	marginLeft: 24,
};

export { SeoModalContent };
