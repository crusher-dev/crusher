import React, { ChangeEvent } from "react";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import { DeleteIcon } from "electron-app/src/_ui/constants/old_icons";
import { css } from "@emotion/react";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Input } from "@dyson/components/atoms/input/Input";

interface iAssertionFormTableProps {
	rowItems: Array<iAssertionRow>;
	fields: Array<iField>;
	operations: Array<ASSERTION_OPERATION_TYPE>;
	onFieldChange?: (selectedFieldName: string, rowId: string) => void;
	onOperationChange?: (selectedOperation: ASSERTION_OPERATION_TYPE, rowId: string) => void;
	onValidationChange?: (newValidation: string, rowId: string) => void;
	deleteValidationRow?: (rowIndex: string) => void;
}

export enum ASSERTION_OPERATION_TYPE {
	MATCHES = "MATCHES",
	CONTAINS = "CONTAINS",
	REGEX = "REGEX",
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
		width: "70rem",
	}),
};

const DropdownOption = ({ label }) => {
	return <div css={{ padding: "7rem 8rem", width: "100%", cursor: "default" }}>{label}</div>;
};

const AssertionFormTable = (props: iAssertionFormTableProps) => {
	const { rowItems, fields, operations, onFieldChange, onOperationChange, onValidationChange, deleteValidationRow } = props;

	const renderFieldInput = (selectedField: string, rowId: string) => {
		const getFieldOptions = () => {
			const options = [];
			fields.forEach((field) => {
				options.push({ value: field.name, label: field.name, component: <DropdownOption label={field.name} />, inactive: false });
			});
			return options;
		};
		const fieldOptions = getFieldOptions();

		const selectedOption = fieldOptions.find((option) => option.value === selectedField);

		const handleOnFieldChange = (option: string) => {
			if (onFieldChange) {
				onFieldChange(option[0], rowId);
			}
		};

		return (
			<SelectBox
				dropDownHeight={"200rem"}
				isSearchable={true}
				css={css`
					input {
						outline: none;
						width: 80%;
					}
					.selectBox {
						height: 34rem;
					}
					.selectBox__value {
						margin-right: 10rem;
						font-size: 13rem;
					}
					width: 160rem;
					.dropdown-box .dropdown-label {
						padding-top: 4rem !important;
						padding-bottom: 4rem !important;
					}
				`}
				size={"large"}
				selected={[selectedOption]}
				values={fieldOptions}
				callback={handleOnFieldChange}
			/>
		);
	};

	const renderFieldOperationInput = (selectedOperation: string, rowId: string) => {
		const getOperationOptions = () => {
			const options = [];
			operations.forEach((operation) => {
				options.push({ value: operation, label: operation, component: <DropdownOption label={operation} />, inactive: false });
			});
			return options;
		};

		const operationOptions = getOperationOptions();
		const selectedOption = operationOptions.find((option) => option.value === selectedOperation);

		const handleOnOperationChange = (selectedOptions: Array<string>) => {
			if (onOperationChange) {
				onOperationChange(selectedOptions[0] as any, rowId);
			}
		};

		return (
			<SelectBox
				isSearchable={true}
				css={css`
					input {
						outline: none;
						width: 80%;
					}
					.selectBox {
						height: 34rem;
					}
					.selectBox__value {
						margin-right: 10rem;
						font-size: 13rem;
					}
					width: 100%;
					.dropdown-box .dropdown-label {
						padding-top: 4rem !important;
						padding-bottom: 4rem !important;
					}
				`}
				size={"large"}
				selected={[selectedOption]}
				values={operationOptions}
				callback={handleOnOperationChange}
			/>
		);
	};

	const renderValidationInput = (validationValue: string, rowId: string) => {
		const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
			if (onValidationChange) {
				onValidationChange(event.target.value, rowId);
			}
		};

		return <Input css={inputStyle} placeholder={"Enter Value"} size={"medium"} initialValue={validationValue} onChange={handleInputChange} />;
	};

	const handleDeleteRow = (rowIndex: string) => {
		if (deleteValidationRow) deleteValidationRow(rowIndex);
	};

	const rowOut = rowItems.map((row, index: number) => {
		const isValidationCorrect = checkIfValidationPasses(row.field.value, row.validation, row.operation as ASSERTION_OPERATION_TYPE);
		return (
			<div
				key={row.id}
				css={css`
					display: grid;
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 4rem;
					margin-bottom: 25rem;
				`}
			>
				<div style={inputTableItemFieldContainerStyle}>
					<DeleteIcon
						onClick={handleDeleteRow.bind(this, row.id)}
						style={{ height: "10rem", marginTop: "11rem" }}
						containerStyle={{ marginRight: "18rem" }}
					/>
					{renderFieldInput(row.field.name, row.id)}
				</div>
				<div>{renderFieldOperationInput(row.operation as ASSERTION_OPERATION_TYPE, row.id)}</div>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				>
					<div>{renderValidationInput(row.validation, row.id)}</div>
					<img
						src={isValidationCorrect ? "./static/assets/icons/correct.svg" : "./static/assets/icons/cross.svg"}
						style={{ marginLeft: "18rem", height: "15rem" }}
					/>
				</div>
			</div>
		);
	});

	return (
		<div
			style={containerStyle}
			css={css`
				&::-webkit-scrollbar {
					display: none;
				}
			`}
		>
			{rowOut}
		</div>
	);
};

const containerStyle = {
	width: "100%",
	textAlign: "left",
	borderSpacing: "0 0.75rem",
	marginBottom: "20rem",
	maxHeight: "400rem",
	overflow: "overlay",
};

const inputTableItemFieldContainerStyle = {
	fontFamily: "Gilroy",
	minWidth: "7rem",
	color: "#000",
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

const inputStyle = css`
	outline: none;
	height: 34rem;
`;

export { AssertionFormTable };
