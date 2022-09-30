import React, { useEffect, useState, useRef } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";

const ResizableInput = React.forwardRef(({ isEditingProp = false, onChange, selectAllOnDoubleClick = true, labelComponent = null, className, value, ...props }, ref) => {
	const [isEditing, setIsEditing] = useState(isEditingProp);
	const inputRef = useRef();

	React.useEffect(() => {
		setIsEditing(isEditingProp);
	}, [isEditingProp]);

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
			<div title="edit name" ref={inputRef} css={labelCSS} onDoubleClick={setIsEditing.bind(this, true)}>
				{labelComponent || value}
			</div>
		);
	}

	return (
		<OnOutsideClick
			onOutsideClick={() => {
				onChange && onChange(inputRef.current?.value || inputRef?.current.innerText);
				setIsEditing(false);
			}}
		>
			<Input
				onReturn={(value) => {
					setIsEditing(false);
					onChange && onChange(value);
				}}
				onBlur={(e) => {
					setIsEditing(false);
					onChange && onChange(e.target.value);
				}}
				title=""
				initialValue={value}
				size="small"
				className={String(className)}
				css={inputCss}
				type="text"
				ref={inputRef}
				{...props}
			/>
		</OnOutsideClick>
	);
});

const labelCSS = css`
	padding-left: 12px;
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
