import React, { ChangeEvent } from "react";
import { ASSERTION_OPERATION_TYPE } from "../../../interfaces/assertionOperation";
import { TEXT_ALIGN } from "../../../interfaces/css";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import Select from "react-select";
import { iReactSelectOption } from "../../../interfaces/reactSelectOptions";
import { DeleteIcon } from "crusher-electron-app/src/extension/assets/icons";

interface iAssertionFormTableProps {
	rowItems: Array<iAssertionRow>;
	fields: Array<iField>;
	operations: Array<ASSERTION_OPERATION_TYPE>;
	onFieldChange?: (selectedFieldName: string, rowId: string) => void;
	onOperationChange?: (selectedOperation: ASSERTION_OPERATION_TYPE, rowId: string) => void;
	onValidationChange?: (newValidation: string, rowId: string) => void;
	deleteValidationRow?: (rowIndex: string) => void;
}

function checkIfValidationPasses(fieldValue: string, validationValue: string, operation: ASSERTION_OPERATION_TYPE) {
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

const reactSelectDefaultStyles = {
	option: (provided, state) => ({
		...provided,
		fontSize: 14,
	}),
	control: (provided, state) => ({
		...provided,
		minHeight: 32,
		maxHeight: 32,
		padding: 0,
	}),
	singleValue: (provided) => ({
		...provided,
		fontSize: 14,
	}),
	valueContainer: (provided) => ({
		...provided,
		top: "-0.2rem",
	}),
};

const AssertionFormTable = (props: iAssertionFormTableProps) => {
	const { rowItems, fields, operations, onFieldChange, onOperationChange, onValidationChange, deleteValidationRow } = props;

	const renderFieldInput = (selectedField: string, rowId: string) => {
		const getFieldOptions = () => {
			const options: iReactSelectOption[] = [];
			fields.forEach((field) => {
				options.push({ value: field.name, label: field.name });
			});
			return options;
		};
		const fieldOptions = getFieldOptions();

		const selectedOption = fieldOptions.find((option) => option.value === selectedField);

		const handleOnFieldChange = (option: iReactSelectOption) => {
			if (onFieldChange) {
				onFieldChange(option.value, rowId);
			}
		};

		return (
			<Select className="w-40" styles={reactSelectDefaultStyles} defaultValue={selectedOption ? selectedOption : fieldOptions[0]} options={fieldOptions} onChange={handleOnFieldChange} />
		);
	};

	const renderFieldOperationInput = (selectedOperation: ASSERTION_OPERATION_TYPE, rowId: string) => {
		const getOperationOptions = () => {
			const options: iReactSelectOption[] = [];
			operations.forEach((operation) => {
				options.push({ value: operation, label: operation });
			});
			return options;
		};

		const operationOptions = getOperationOptions();

		const handleOnOperationChange = (option: iReactSelectOption) => {
			if (onOperationChange) {
				onOperationChange(option.value as ASSERTION_OPERATION_TYPE, rowId);
			}
		};

		return (
			<Select
				options={operationOptions}
				styles={reactSelectDefaultStyles}
				defaultValue={operationOptions[0]}
				onChange={handleOnOperationChange}
				className="w-40"
			/>
		);
	};

	const renderValidationInput = (validationValue: string, rowId: string) => {
		const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
			if (onValidationChange) {
				onValidationChange(event.target.value, rowId);
			}
		};

		return <input placeholder={"Enter value"} value={validationValue} style={inputTableGridOptionValueInputStyle} onChange={handleInputChange} />;
	};

	const handleDeleteRow = (rowIndex: string) => {
		deleteValidationRow(rowIndex);
	};

	const rowOut = rowItems.map((row, index: number) => {
		const isValidationCorrect = checkIfValidationPasses(row.field.value, row.validation, row.operation as ASSERTION_OPERATION_TYPE);
		return (
			<div key={row.id} className="grid grid-cols-3 gap-4 my-8 mb-20">
				<div style={inputTableItemFieldContainerStyle}>
					<DeleteIcon
						onClick={handleDeleteRow.bind(this, row.id)}
						style={{ height: "0.65rem", marginTop: "0.6rem" }}
						containerStyle={{ marginRight: "0.85rem" }}
					/>
					{renderFieldInput(row.field.name, row.id)}
				</div>
				<div>{renderFieldOperationInput(row.operation as ASSERTION_OPERATION_TYPE, row.id)}</div>
				<div className="flex items-center justify-center">
					<div>{renderValidationInput(row.validation, row.id)}</div>
					<img
						src={chrome.runtime.getURL(isValidationCorrect ? "/icons/correct.svg" : "/icons/cross.svg")}
						style={{ marginLeft: "0.85rem", height: "1rem" }}
					/>
				</div>
			</div>
		);
	});

	return <div style={containerStyle}>{rowOut}</div>;
};

const containerStyle = {
	width: "100%",
	textAlign: TEXT_ALIGN.LEFT,
	borderSpacing: "0 0.75rem",
};

const inputTableItemFieldContainerStyle = {
	fontFamily: "DM Sans",
	minWidth: "7rem",
	fontStyle: "normal",
	fontSize: "0.82rem",
	display: "flex",
};

const inputTableGridOptionValueInputStyle = {
	padding: "6px 16px",
	borderRadius: "0.25rem",
	width: "100%",
	fontSize: 14,
};

export { AssertionFormTable };
