import React, { useEffect, useState, useRef } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";

const ResizableInput = React.forwardRef(({ isEditingProp = false, onEditModeChange, selectAllOnDoubleClick = true, className, value, ...props }, ref) => {
	const [, setWidth] = useState(0);
	const [isEditing, setIsEditing] = useState(isEditingProp);
	const span = useRef();

	useEffect(() => {
		requestAnimationFrame(() => {
			setWidth(span?.current?.offsetWidth);
		});
	}, [value]);

	// set width when span is set
	useEffect(() => {
		if (span?.current) {
			setWidth(span?.current?.offsetWidth);
		}
	}, [span]);

	React.useEffect(() => {
		if (isEditing) {
			requestAnimationFrame(() => {
				ref.current.focus();
				const totalLength = ref.current.value.length;
				ref.current.setSelectionRange(selectAllOnDoubleClick ? 0 : totalLength, totalLength);
			});
		}
		onEditModeChange(isEditing);
	}, [isEditing]);

	React.useEffect(() => {
		setIsEditing(isEditingProp);
	}, [isEditingProp]);

	if (!isEditing) {
		return (
			<div title="edit name" css={labelCSS} onDoubleClick={setIsEditing.bind(this, true)}>
				{value}
			</div>
		);
	}

	return (
		<OnOutsideClick
			onClick={() => {
				setIsEditing(false);
				onEditModeChange(false);
			}}
		>
			<Input
				onReturn={() => {
					setIsEditing(false);
					onEditModeChange(false);
				}}
				onBlur={() => {
					setIsEditing(false);
					onEditModeChange(isEditingProp);
				}}
				title=""
				initialValue={value}
				size="small"
				className={String(className)}
				css={inputCss}
				ref={ref}
				type="text"
				{...props}
			/>
		</OnOutsideClick>
	);
});

const labelCSS = css`
	padding-left: 12px;
	font-size: 14px;
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
