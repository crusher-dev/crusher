import React, { ChangeEvent } from "react";
import { ASSERTION_OPERATION_TYPE } from "../../../interfaces/assertionOperation";
import { APPEARANCE, OVERFLOW, TEXT_ALIGN } from "../../../interfaces/css";
import { toPrettyEventName } from "../../../utils/helpers";
import {
	iAssertionRow,
	iField,
} from "../../../../../crusher-shared/types/assertionRow";

interface iAssertionFormTableProps {
	rowItems: Array<iAssertionRow>;
	fields: Array<iField>;
	operations: Array<ASSERTION_OPERATION_TYPE>;
	onFieldChange?: (selectedFieldName: string, rowId: string) => void;
	onOperationChange?: (
		selectedOperation: ASSERTION_OPERATION_TYPE,
		rowId: string,
	) => void;
	onValidationChange?: (newValidation: string, rowId: string) => void;
}

function checkIfValidationPasses(
	fieldValue: string,
	validationValue: string,
	operation: ASSERTION_OPERATION_TYPE,
) {
	switch (operation) {
		case ASSERTION_OPERATION_TYPE.MATCHES:
			return fieldValue === validationValue;
		case ASSERTION_OPERATION_TYPE.CONTAINS:
			return fieldValue.includes(validationValue);
		case ASSERTION_OPERATION_TYPE.REGEX: {
			try {
				const rgx = new RegExp(validationValue);
				if (rgx.test(fieldValue)) {
					return true;
				} else {
					throw new Error("Regex didn't match");
				}
			} catch (err) {
				return false;
			}
		}
		default:
			throw new Error("Unknown Validation Operation");
	}
}

const AssertionFormTable = (props: iAssertionFormTableProps) => {
	const {
		rowItems,
		fields,
		operations,
		onFieldChange,
		onOperationChange,
		onValidationChange,
	} = props;

	const renderFieldInput = (selectedField: string, rowId: string) => {
		const fieldOptions = fields.map((field, index) => {
			return (
				<option key={index} value={field.name}>
					{field.name}
				</option>
			);
		});

		const handleOnFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
			if (onFieldChange) {
				onFieldChange(event.target.value, rowId);
			}
		};

		return (
			<select
				style={selectStyle}
				value={selectedField}
				onChange={handleOnFieldChange}
			>
				{fieldOptions}
			</select>
		);
	};

	const renderFieldOperationInput = (
		selectedOperation: ASSERTION_OPERATION_TYPE,
		rowId: string,
	) => {
		const operationOptions = operations.map((operation) => {
			return (
				<option key={operation} value={operation}>
					{toPrettyEventName(operation)}
				</option>
			);
		});

		const handleOnOperationChange = (event: ChangeEvent<HTMLSelectElement>) => {
			if (onOperationChange) {
				onOperationChange(event.target.value as ASSERTION_OPERATION_TYPE, rowId);
			}
		};

		return (
			<select
				style={{ ...selectStyle, minWidth: "60%" }}
				value={selectedOperation}
				onChange={handleOnOperationChange}
			>
				{operationOptions}
			</select>
		);
	};

	const renderValidationInput = (validationValue: string, rowId: string) => {
		const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
			if (onValidationChange) {
				onValidationChange(event.target.value, rowId);
			}
		};

		return (
			<input
				placeholder={"Enter value"}
				value={validationValue}
				style={inputTableGridOptionValueInputStyle}
				onChange={handleInputChange}
			/>
		);
	};

	const rowOut = rowItems.map((row, index: number) => {
		const isValidationCorrect = checkIfValidationPasses(
			row.field.value,
			row.validation,
			row.operation as ASSERTION_OPERATION_TYPE,
		);
		return (
			<tr key={row.id} style={inputTableGridItemStyle}>
				<td style={inputTableItemFieldContainerStyle}>
					{renderFieldInput(row.field.name, row.id)}
					<img
						src={chrome.runtime.getURL(
							isValidationCorrect ? "/icons/correct.svg" : "/icons/cross.svg",
						)}
						style={{ marginLeft: "0.85rem" }}
					/>
				</td>
				<td style={inputTableGridOptionStyle}>
					{renderFieldOperationInput(
						row.operation as ASSERTION_OPERATION_TYPE,
						row.id,
					)}
				</td>
				<td>{renderValidationInput(row.validation, row.id)}</td>
			</tr>
		);
	});

	return <table style={containerStyle}>{rowOut}</table>;
};

const containerStyle = {
	width: "100%",
	textAlign: TEXT_ALIGN.LEFT,
	borderSpacing: "0 0.75rem",
	maxHeight: "47vh",
	overflowY: OVERFLOW.AUTO,
};
const inputTableGridItemStyle = {
	display: "table-row",
	gridTemplateColumns: "auto auto auto",
};
const inputTableItemFieldContainerStyle = {
	fontFamily: "DM Sans",
	minWidth: "7rem",
	fontStyle: "normal",
	fontSize: "0.82rem",
	color: "#fff",
	display: "flex",
};
const selectStyle = {
	minWidth: 120,
	maxWidth: "10rem",
	width: "100%",
	fontSize: 18,
	appearance: APPEARANCE.NONE,
	background: "#FAFAFA",
	border: "1px solid #DADADA",
	borderRadius: "0.20rem",
	padding: "12px 1rem",
	backgroundImage:
		"url(\"data:image/svg+xml;utf8,<svg fill='black' height='28' viewBox='0 0 24 24' width='28' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
	backgroundRepeat: "no-repeat",
	backgroundPositionX: "96.5%",
	backgroundPositionY: "50%",
};
const inputTableGridOptionStyle = {
	width: "50%",
	textAlign: TEXT_ALIGN.CENTER,
};
const inputTableGridOptionValueInputStyle = {
	padding: "12px 1rem",
	borderRadius: "0.25rem",
	width: "100%",
	fontSize: 18,
};

export { AssertionFormTable };
