import React, { useState, useRef, useContext } from "react";
import { css } from "@emotion/react";
import Input from "../../components/atoms/input/Input";
import { OnOutsideClick } from "../../components/layouts/onOutsideClick/onOutsideClick";
import { TestListContext } from "./utils/basic";

const EditableInput = React.forwardRef(
	({ isEditingProp = false, id, onChange, inputCSS, selectAllOnDoubleClick = true, labelCss, labelComponent = null, className, value, ...props }) => {
		const { setCurrentRenameInput, currentRenameInput } = useContext(TestListContext);

		const [isEditing, setIsEditing] = useState(isEditingProp);
		const inputRef = useRef();

		// Hacky way to get around
		React.useEffect(() => {
			return () => {
				if (isEditing) {
					setCurrentRenameInput(false as any);
				}
			};
		}, [isEditing]);

		React.useEffect(() => {
			if (currentRenameInput === id) {
				setIsEditing(true);
			} else {
				setIsEditing(false);
			}
		}, [currentRenameInput]);

		React.useEffect(() => {
			if (isEditing) {
				requestAnimationFrame(() => {
					inputRef.current.focus();
					const totalLength = inputRef.current.value.length;
					inputRef.current.setSelectionRange(selectAllOnDoubleClick ? 0 : totalLength, totalLength);
				});
			}
		}, [isEditing]);

		if (!isEditing) {
			return (
				<div title="edit name" ref={inputRef} css={[labelCSS, labelCss]} onDoubleClick={setCurrentRenameInput.bind(this, id)}>
					{labelComponent || value}
				</div>
			);
		}

		return (
			<OnOutsideClick
				onOutsideClick={() => {
					onChange && onChange(inputRef.current?.value || inputRef?.current.innerText);
					setCurrentRenameInput(null);
				}}
				className={className}
			>
				<Input
					onReturn={(value) => {
						setCurrentRenameInput(null);
						onChange && onChange(value);
					}}
					onBlur={(e) => {
						setCurrentRenameInput(null);
						onChange && onChange(e.target.value);
					}}
					title=""
					initialValue={value}
					size="small"
					className={String(className)}
					css={[inputCss, inputCSS]}
					type="text"
					ref={inputRef}
					{...props}
					// onBlur={() =>{}}
				/>
			</OnOutsideClick>
		);
	},
);

const labelCSS = css`
	font-size: 13px;
	padding-top: 1px;
`;

const inputCss = css`
min-width: fit-content;

input{
  padding-right 8px !important;
min-width: 200px;
font-size: 13px;
margin-left: 2px;
height: 28px;
padding-left: calc(9rem + 0rem);

font-size: 13px;
padding-top: 1px;
}
`;
export { EditableInput };
