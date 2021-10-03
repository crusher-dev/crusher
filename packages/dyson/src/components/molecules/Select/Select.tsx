import { css, SerializedStyles } from "@emotion/react";
import React, { ReactElement, useState } from "react";
import { OnOutsideClick } from "../../layouts/onOutsideClick/onOutsideClick";

import { Conditional } from "../../layouts";
import { CloseSVG } from "../../icons/CloseSVG";
import { DropdownIconSVG } from "../../../../../crusher-app/src/svg/builds";
import Checkbox from "../../atoms/checkbox/checkbox";

type TSelectBox = {
	css?: SerializedStyles;
	values: { value: any; component: ReactElement; inactive: boolean };
	isMultiSelect: boolean;
	selected: any;
	size: "small" | "medium" | "large"; // 28/32/36/42
	placeholder: string;
	callback: (selectedValue: any) => void;
} & React.DetailedHTMLProps<any, any>;

const SelectDefaultProps = {
	placeholder: "Select a value",
	isMultiSelect: false,
	size: "medium",
	values: [],
	callback: () => {},
};

export const SelectBox: React.FC<TSelectBox> = ({ selected = [], placeholder, css, values, size, isMultiSelect, callback }) => {
	const [openSelectBox, setOpenSelectBox] = useState(false);

	const getSelectedComponent = () => {
		return values.filter(({ value }) => selected.includes(value));
	};

	const selectValue = (value) => {
		if (isMultiSelect) {
			if (selected.includes(value)) {
				const arrayWithoutThisValue = selected.filter((item) => item !== value);
				callback(arrayWithoutThisValue);
			} else {
				callback([...selected, value]);
			}
		} else {
			callback([value]);
		}
		!isMultiSelect && setOpenSelectBox(false);
	};

	return (
		<>
			<div css={[selectBoxContainer(openSelectBox, size), css]} className={"relative"}>
				<div className={"flex justify-between text-13 px-12 pr-10 selectBox"} onClick={setOpenSelectBox.bind(this, true)}>
					<Conditional showIf={selected.length === 0}>{placeholder}</Conditional>
					<Conditional showIf={selected !== null}>
						<span css={selectedValueCSS}>
							{getSelectedComponent()
								.map(({ label }) => label)
								.join(", ")}
						</span>
					</Conditional>
					<Conditional showIf={openSelectBox}>
						<CloseSVG height={9}></CloseSVG>
					</Conditional>
					<Conditional showIf={!openSelectBox}>
						<DropdownIconSVG className={"mr-4"} />
					</Conditional>
				</div>

				<Conditional showIf={openSelectBox}>
					<OnOutsideClick onOutsideClick={setOpenSelectBox.bind(this, false)}>
						<DropdownBox>
							{values.map(({ value, component, label }) => (
								<div css={dropdDownItem(isMultiSelect)} className={"flex  items-center px-12 py-8 "} onClick={selectValue.bind(this, value)}>
									<Conditional showIf={isMultiSelect}>
										<Checkbox className={"mr-12"} isSelected={selected.includes(value)} />
									</Conditional>
									{component || label}
								</div>
							))}
						</DropdownBox>
					</OnOutsideClick>
				</Conditional>
			</div>
		</>
	);
};

type TDropdownBox = {} & React.DetailedHTMLProps<any, any>;

const DropdownBox = ({ children, dropdownCSS }: TDropdownBox) => (
	<div css={[dropdDown, dropdownCSS]} className={"dropdown-box flex flex-col justify-between"}>
		{children}
	</div>
);

SelectBox.defaultProps = SelectDefaultProps;

const selectBoxContainer = (isOpen, size) => css`
	.selectBox {
		width: 100%;

		background: #121519;
		border: 1px solid #181c23;
		box-sizing: border-box;
		border-radius: 4px;

		display: flex;
		align-items: center;
		color: #797979;

		:hover {
			background: #16191d;
			border: 1px solid #262c36;
		}

		${size === "small" && `height:28rem;`}
		${size === "medium" && `height:34rem;`}
    ${size === "large" && `height:42rem;`}
		${isOpen ? `	border-color: #6893e7;` : ""}
	}
`;
export const dropdDown = css`
	top: calc(100% + 8rem);
	left: 0;
	position: absolute;
	width: 100%;

	overflow: hidden;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 4px;
	padding: 8rem 0;
	z-index: 1;
`;

const dropdDownItem = (isMultiSelect) => css`
	font-size: 13rem;
	color: #fff;
	:hover {
		background: ${isMultiSelect ? "#16191D" : "#687ef2"} !important;
	}
`;

const selectedValueCSS = css`
	color: white;
`;
