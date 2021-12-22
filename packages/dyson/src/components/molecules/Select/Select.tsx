import { css, SerializedStyles } from "@emotion/react";
import React, { ReactElement, useState, useMemo, useEffect, useRef, useCallback } from "react";
import { OnOutsideClick } from "../../layouts/onOutsideClick/onOutsideClick";

import { Conditional } from "../../layouts";
import { CloseSVG } from "../../icons/CloseSVG";
import { DropdownIconSVG } from "../../../assets/icons";
import Checkbox from "../../atoms/checkbox/checkbox";

export type TSelectBoxProps = {
	/*
		Emotion style if any
	*/
	css?: SerializedStyles;
	/*
		The options to be displayed in the select dropdown
	*/
	values: Array<{ value: any; label: any; component: ReactElement; inactive: boolean }>;
	/* 
		Is multi select enabled
	*/
	isMultiSelect: boolean;
	/*
		Is search enabled
	*/
	isSearchable: boolean;
	/*
		Event handler when scrolled to bottom of select dropdown
	*/
	onScrollEnd: any;
	/*
		Height of dropdown
	*/
	dropdDownHeight?: string;
	/*
		Selected option
	*/
	selected?: any | {label: any, value: any};
	/*
		Size of select box
	*/
	size: "small" | "medium" | "large";
	/*
		Placeholder
	*/
	placeholder: string;
	/*
		Event handler when select box is changed
	*/
	callback: (selectedValue: any) => void;

	className?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, any>;


const SelectDefaultProps = {
	placeholder: "Select a value",
	isMultiSelect: false,
	onScrollEnd: () => {},
	isSearchable: false,
	size: "medium",
	dropDownHeight: "auto",
	values: [],
	callback: () => {},
};

export const SelectBox: React.FC<TSelectBoxProps> = ({
	selected = [],
	placeholder,
	onScrollEnd,
	values,
	size,
	isMultiSelect,
	isSearchable,
	className,
	dropDownHeight,
	callback,
}) => {
	const [openSelectBox, setOpenSelectBox] = useState(false);
	const [filterText, setFilterText] = useState("");

	const getSelectedComponent = () => {
		const selectedHasLabel = selected && selected.length > 0 && selected.every((item: any) => item && !!item.label);

		return !selectedHasLabel ? values.filter(({ value }) => selected.includes(value)) : selected ? selected : [];
	};

	const getReadableSelectedValues = () => {
		return getSelectedComponent()
			.map(({ label }) => label)
			.join(", ");
	};

	const selectedText = useMemo(() => {
		console.log("Selected inside is this", selected);
		if (!selected || selected.length === 0) return placeholder;
		return getReadableSelectedValues();
	}, [selected]);

	useEffect(() => {
		setFilterText("");
		console.log("Selected options", selected);
	}, [selected]);

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

	const handleFilterTextChange = (e: KeyboardEvent) => {
		setFilterText((e.target as any).value);
	};

	const handleOutSideClick = (shouldSetOpenBox: boolean) => {
		setFilterText("");
		setOpenSelectBox(shouldSetOpenBox);
	};

	const options = filterText ? values.filter(({ label }) => label.toLowerCase().includes(filterText.toLowerCase())) : values;

	return (
			<div css={[selectBoxContainer(openSelectBox, size)]} className={`relative ${className}`}>
				<div className={"flex justify-between text-13 px-12 pr-10 selectBox"} onClick={setOpenSelectBox.bind(this, true)}>
					<input
						onInput={handleFilterTextChange}
						type={"text"}
						disabled={!!isSearchable === false}
						css={[inputBoxCSS, selected !== null && selected.length ? selectedValueCSS : null]}
						value={filterText}
						className={"selectBox__input selectBox__value"}
					/>

					<div>
						<Conditional showIf={!filterText}>
							<span className={"selectBox__value"} css={[selected.length && selected !== null ? selectedValueCSS : null]}>{selectedText}</span>
						</Conditional>
					</div>

					<Conditional showIf={openSelectBox}>
						<CloseSVG height={9} className={"mr-4"}></CloseSVG>
					</Conditional>
					<Conditional showIf={!openSelectBox}>
						<DropdownIconSVG className={"mr-4"} />
					</Conditional>
				</div>

				<Conditional showIf={openSelectBox}>
					<OnOutsideClick onOutsideClick={handleOutSideClick.bind(this, false)}>
						<DropdownBox dropdownCSS={dropboxCSS(dropDownHeight)} onScrollEnd={onScrollEnd}>
							{options.map(({ value, component, label }) => (
								<div
									css={dropdDownItem(isMultiSelect)}
									className={"flex  items-center px-12 py-8 dropdown-label"}
									key={value}
									onClick={selectValue.bind(this, value)}
								>
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
	);
};

type TDropdownBox = {
	onScrollEnd?: any;
} & React.DetailedHTMLProps<any, any>;

const DropdownBox = ({ children, dropdownCSS, onScrollEnd }: TDropdownBox) => {
	const dropDownRef = useRef(null as any);
	const [isLoadingResults, setIsLoadingResults] = useState(false);

	const handleScroll = useCallback(async () => {
		const element = dropDownRef.current as HTMLElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			setIsLoadingResults(true);
			if (onScrollEnd) await onScrollEnd();

			setIsLoadingResults(false);
		}
	}, [dropDownRef, onScrollEnd]);

	return (
		<div css={dropdDownContainer} className="select-dropDownContainer">
			<div ref={dropDownRef} onScroll={handleScroll} css={[dropdDown, dropdownCSS]} className={"dropdown-box flex flex-col justify-between"}>
				{children}
			</div>
			<Conditional showIf={isLoadingResults}>
				<div style={{ textAlign: "center", padding: "4rem 0rem" }}>Loading....</div>
			</Conditional>
		</div>
	);
};

SelectBox.defaultProps = SelectDefaultProps;

const dropboxCSS = (dropDownHeight: string) => css`
	height: ${dropDownHeight};
`;

const selectBoxContainer = (isOpen, size) => css`
	position: relative;
	
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

export const dropdDownContainer = css`
	top: calc(100% + 8rem);
	left: 0;
	position: absolute;
	width: 100%;
	overflow: hidden;
	z-index: 1;
	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 4px;
	box-sizing: border-box;
	padding: 8rem 0;
`;

export const dropdDown = css`
	width: 100%;
	overflow: hidden;

	box-sizing: border-box;
	z-index: 1;
	overflow-y: overlay;

	::-webkit-scrollbar {
		background: transparent;
		width: 8rem;
	}
	::-webkit-scrollbar-thumb {
		background: white;
		border-radius: 14rem;
	}
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

const inputBoxCSS = css`
	position: absolute;
	background: transparent;
	color: white;
	color: #797979;
`;
