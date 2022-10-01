import React, { useState, useRef } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { editInputAtom } from "../../store/jotai/testsPage";
import { useAtom } from "jotai";

const ResizableInput = React.forwardRef(
	({ isEditingProp = false, id, onChange, inputCSS, selectAllOnDoubleClick = true, labelCss, labelComponent = null, className, value, ...props }) => {
		const [currentItemId, setTestEditName] = useAtom(editInputAtom);

		const [isEditing, setIsEditing] = useState(isEditingProp);
		const inputRef = useRef();

		// Hacky way to get around
		React.useEffect(() => {
			return () => {
				if (isEditing) {
					setTestEditName(false as any);
				}
			};
		}, [isEditing]);

		React.useEffect(() => {
			if (currentItemId === id) {
				setIsEditing(true);
			} else {
				setIsEditing(false);
			}
		}, [currentItemId]);

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
				<div title="edit name" ref={inputRef} css={[labelCSS, labelCss]} onDoubleClick={setTestEditName.bind(this, id)}>
					{labelComponent || value}
				</div>
			);
		}

		return (
			<OnOutsideClick
				onOutsideClick={() => {
					onChange && onChange(inputRef.current?.value || inputRef?.current.innerText);
					setTestEditName(null);
				}}
			>
				<Input
					onReturn={(value) => {
						setTestEditName(null);
						onChange && onChange(value);
					}}
					onBlur={(e) => {
						setTestEditName(null);
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
font-size: 14px;
margin-left: 2px;
height: 28px;
padding-left: calc(10rem + 0rem);
letter-spacing 0.42px
}
`;
export { ResizableInput };
