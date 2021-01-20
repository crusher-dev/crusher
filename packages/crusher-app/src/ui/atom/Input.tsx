import React, { Ref, useRef } from "react";
import { css } from "@emotion/core";
import { Conditional } from "@ui/components/common/Conditional";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iInputProps {
	placeholder?: string;
	value: string;
	label?: string;
	actionIcon?: React.ReactNode;
	isOnlyReadable?: boolean;
	onChange?: any;
	inputContainerCSS?: any;
	onKeySubmit?: any;
	actionButton?: React.ReactNode;
}

const Input = (props: iInputProps) => {
	const {
		placeholder,
		value,
		onChange,
		label,
		isOnlyReadable,
		actionIcon,
		actionButton,
		inputContainerCSS: _customInputContainerCSS,
		onKeySubmit,
	} = props;
	const _inputRef: Ref<HTMLInputElement> = useRef(null);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.keyCode === 13 && onKeySubmit) {
			onKeySubmit();
		}
	};

	return (
		<div css={containerCSS}>
			<Conditional If={label}>
				<label
					onClick={() => {
						(_inputRef.current as any).focus();
					}}
					css={labelCSS}
				>
					{label}
				</label>
			</Conditional>
			<div css={inputRowContainerCSS}>
				<div css={[inputContainerCSS, _customInputContainerCSS]}>
					<input
						ref={_inputRef}
						placeholder={placeholder}
						onChange={onChange}
						value={value}
						disabled={isOnlyReadable}
						css={inputCSS}
						onKeyDown={handleKeyDown}
					/>
					<Conditional If={actionIcon}>
						<div css={actionIconContainerCSS}>{actionIcon}</div>
					</Conditional>
				</div>
				<Conditional If={actionButton}>
					{actionButton as React.ReactElement}
				</Conditional>
			</div>
		</div>
	);
};

const containerCSS = css``;
const labelCSS = css`
	color: #323232;
	font-family: Gilroy;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 700;
`;
const inputCSS = css`
	padding: ${10 / PIXEL_REM_RATIO}rem ${17 / PIXEL_REM_RATIO}rem;
	width: 100%;
	font-size: ${13 / PIXEL_REM_RATIO}rem;
	background: #fff;
	font-family: Gilroy;
	border: none;
	font-weight: 500;
	border-radius: ${6 / PIXEL_REM_RATIO}rem;
	&::placeholder {
		color: #ababab;
	}
`;
const inputRowContainerCSS = css`
	display: flex;
	align-items: center;
	margin-top: ${13 / PIXEL_REM_RATIO}rem;
`;
const inputContainerCSS = css`
	display: flex;
	align-items: center;
	border: 1.5px solid #c4c4c4;
	border-radius: ${6 / PIXEL_REM_RATIO}rem;
	width: ${320 / PIXEL_REM_RATIO}rem;
`;
const actionIconContainerCSS = css`
	margin-right: ${17 / PIXEL_REM_RATIO}rem;
	cursor: pointer;
`;
Input.defaultProps = {
	isOnlyReadable: false,
	showCopyIcon: false,
};
export { Input };
