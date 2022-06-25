import React, { RefObject, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { AssertionFormTable, ASSERTION_OPERATION_TYPE } from "../../forms/assertionForm";
import { iAssertionRow, iField } from "@shared/types/assertionRow";
import uniqueId from "lodash/uniqueId";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { Button } from "@dyson/components/atoms/button/Button";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { enableJavascriptInDebugger, recordHoverDependencies, registerActionAsSavedStep } from "electron-app/src/ui/commands/perform";
import { recordStep, setSelectedElement, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { BulbIcon } from "electron-app/src/ui/icons";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../topBar";
import { css } from "@emotion/react";
import { ipcRenderer } from "electron";
import { Text } from "@dyson/components/atoms/text/Text";
import { useTour } from "@reactour/tour";
import { iAction } from "@shared/types/action";
import { sendSnackBarEvent } from "../../toast";

interface iAssertElementModalProps {
	stepIndex?: number;
	stepAction?: iAction;

	isOpen: boolean;
	handleClose?: () => void;
}

const getValidationFields = (elementInfo: any): Array<iField> => {
	if (!elementInfo) return [];
	const innerHTML = elementInfo.innerHTML;
	const innerText = elementInfo.innerText;
	const attributes = elementInfo.attributes;

	const MetaTagsFields = attributes.map((attribute) => {
		return {
			name: attribute.name,
			value: attribute.value,
			meta: { type: "ATTRIBUTE" },
		};
	});
	return [
		{ name: "innerText", value: innerText, meta: { type: "innerText" } },
		{ name: "innerHTML", value: innerHTML, meta: { type: "innerHTML" } },
		...MetaTagsFields,
	];
};

const getElementFieldValue = (fieldInfo: iField) => {
	return fieldInfo.value;
};

const AssertElementModal = (props: iAssertElementModalProps) => {
	const { handleClose, isOpen } = props;
	const [elementInfo, setElementInfo] = useState(null);
	const store = useStore();
	const selectedElement = useSelector(getSelectedElement);
	const { isOpen: isOnboardingOpen, setCurrentStep } = useTour();

	const [validationRows, setValidationRows] = useState([] as Array<iAssertionRow>);
	const validationFields = getValidationFields(elementInfo!);
	const validationOperations = [ASSERTION_OPERATION_TYPE.MATCHES, ASSERTION_OPERATION_TYPE.CONTAINS, ASSERTION_OPERATION_TYPE.REGEX];

	React.useEffect(() => {
		if (isOpen && !props.stepAction) {
			setValidationRows([]);
			ipcRenderer
				.invoke("get-element-assert-info", selectedElement)
				.then((res) => {
					console.log("Element info is", res);
					setElementInfo(res);
				})
				.catch((err) => {
					console.error("Error is", err);
				});
		}
		if (isOpen && props.stepAction) {
			const elementInfoFromActions = (props.stepAction.payload.meta.validations as iAssertionRow[]).reduce(
				(prev, validation) => {
					if (validation.field.name === "innerHTML") {
						return { ...prev, innerHTML: validation.field.value };
					} else if (validation.field.name === "innerText") {
						return { ...prev, innerText: validation.field.value };
					}
					return {
						...prev,
						attributes: { ...prev.attributes, [validation.field.name]: { name: validation.field.name, value: validation.field.value } },
					};
				},
				{ innerHTML: null, innerText: null, attributes: {} },
			);
			const attributesArray = Object.keys(elementInfoFromActions.attributes).map((key) => {
				return { name: key, value: elementInfoFromActions.attributes[key].value };
			});
			elementInfoFromActions.attributes = attributesArray;

			setElementInfo(elementInfoFromActions);
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

	const saveElementValidationAction = async () => {
		await recordHoverDependencies(selectedElement);

		await registerActionAsSavedStep({
			type: ActionsInTestEnum.ASSERT_ELEMENT,
			payload: {
				selectors: selectedElement.selectors,
				meta: {
					uniqueNodeId: selectedElement.uniqueElementId,
					validations: validationRows,
				},
			},
		});

		await enableJavascriptInDebugger();

		store.dispatch(setSelectedElement(null));
		handleCloseWrapper();
	};

	const updateSeoValidationAction = () => {
		if (!props.stepAction) {
			sendSnackBarEvent({ type: "error", message: "No action to update" });
			return;
		}

		props.stepAction.payload.meta.validations = validationRows;
		store.dispatch(updateRecordedStep({ ...props.stepAction }, props.stepIndex));
		sendSnackBarEvent({ type: "success", message: "Updated Element assertions" });
		handleCloseWrapper();
	};

	const deleteValidationRow = (rowIndex) => {
		const newValidationRows = validationRows.filter((a) => a.id !== rowIndex);
		setValidationRows([...newValidationRows]);
	};

	const handleCloseWrapper = () => {
		if (isOnboardingOpen) {
			setCurrentStep(4);
		}
		if (handleClose) {
			handleClose();
		}
	};

	if (!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={handleCloseWrapper}>
			<ModalTopBar title={"Assert element"} desc={"These are run over the selected element"} closeModal={handleCloseWrapper} />
			<div
				css={css`
					padding: 0rem 34rem;
					margin-top: 8rem;
				`}
			>
				<AssertionFormTable
					rowItems={validationRows}
					fields={validationFields}
					operations={validationOperations}
					onFieldChange={updateFieldOfValidationRow}
					onOperationChange={updateOperationOfValidationRow}
					onValidationChange={updateValidationValueOfValidationRow}
					deleteValidationRow={deleteValidationRow}
				/>
				<div
					style={bottomBarStyle}
					css={css`
						margin-bottom: 22rem;
						margin-top: 38rem;
					`}
				>
					<div style={formButtonStyle}>
						<Text css={linkStyle} onClick={createNewElementAssertionRow}>
							Add a check
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
					<Button css={buttonStyle} onClick={props.stepAction ? updateSeoValidationAction : saveElementValidationAction}>
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
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem !important;
	min-height: 214rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const containerStyle = (areRowsPresent) => {
	return { marginTop: areRowsPresent ? "2.25rem" : "1.5rem" };
};
const bottomBarStyle = {
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	marginTop: "1.5rem",
};
const formButtonStyle = {
	marginRight: "auto",
	fontFamily: "DM Sans",
	fontSize: "0.9rem",
	fontWeight: 900,
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
	textAlign: "center",
	color: "#fff",
	marginLeft: 24,
};

export { AssertElementModal };
