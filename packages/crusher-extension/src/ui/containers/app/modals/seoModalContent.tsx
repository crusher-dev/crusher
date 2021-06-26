import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSeoMetaInfo } from "../../../../redux/selectors/recorder";
import { AssertionFormTable } from "../../../components/app/assertionFormTable";
import { iAssertionRow, iField } from "../.././../../../../crusher-shared/types/assertionRow";
import { ASSERTION_OPERATION_TYPE } from "../../../../interfaces/assertionOperation";
import { iSeoMetaInformationMeta } from "../../../../messageListener";
import { TEXT_ALIGN } from "../../../../interfaces/css";
import { BulbIcon } from "../../../../assets/icons";
import uniqueId from "lodash/uniqueId";
import { getStore } from "../../../../redux/store";
import { recordAction } from "../../../../redux/actions/actions";
import { ACTIONS_IN_TEST } from "../../../../../../crusher-shared/constants/recordedActions";
import { Button } from "../../../components/app/button";

interface iSEOModalProps {
	onClose?: any;
}

const getValidationFields = (seoInfo: iSeoMetaInformationMeta): Array<iField> => {
	if (!seoInfo) return [];
	const title = seoInfo.title;
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
	const { onClose } = props;
	const seoInfo = useSelector(getSeoMetaInfo);
	const [validationRows, setValidationRows] = useState([] as Array<iAssertionRow>);
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

	const createNewSeoAssertionRow = () => {
		addValidationRow(validationFields[0], validationOperations[0], getSeoFieldValue(validationFields[0]));
	};

	const generateDefaultChecksForPage = () => {
		const newValidationRowsData = [];
		for (let i = 0; i < validationFields.length; i++) {
			newValidationRowsData.push({
				field: validationFields[i],
				operation: ASSERTION_OPERATION_TYPE.MATCHES,
				validation: getSeoFieldValue(validationFields[i]),
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
		validationRows[rowIndex].validation = getSeoFieldValue(newField);
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

	const saveSeoValidationAction = () => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ACTIONS_IN_TEST.VALIDATE_SEO,
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
		<div style={containerStyle}>
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

const containerStyle = {};
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
