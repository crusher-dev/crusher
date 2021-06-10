import React, { useState } from "react";
import { FLEX_DIRECTION, FONT_WEIGHT } from "../../../interfaces/css";
import { Conditional } from "../conditional";
import { BackIcon } from "../../../assets/icons";
import { COLOR_CONSTANTS } from "../../colorConstants";

interface iItem {
	id: string;
	icon: string;
	title: string;
	desc: string;
}

interface iItemProps {
	item: iItem;
	onClick: (id: string) => void;
}

const Item = (props: iItemProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const { item, onClick } = props;

	const handleItemClick = () => {
		onClick(item.id);
	};

	const handleMouseOver = () => {
		setIsHovered(true);
	};
	const handleMouseOut = () => {
		setIsHovered(false);
	};

	return (
		<div id={item.id} style={itemRowStyle(isHovered)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
			<div style={itemContainerStyle} id={item.id} onClick={handleItemClick}>
				<img style={actionImageStyle} src={item.icon} />
				<div style={actionContentStyle}>
					<span className="text-13" style={actionTextStyle}>
						{item.title}
					</span>
					<span style={actionDescStyle}>{item.desc}</span>
				</div>
			</div>
		</div>
	);
};

const itemRowStyle = (isHovered: boolean) => ({
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "1rem",
	background: isHovered ? "rgba(21,24,30, 0.6)" : "#15181E",
	color: isHovered ? "rgba(255,255,255, 1)" : "rgba(255,255,255, 0.95)",
});
const itemContainerStyle = {
	padding: "0.8rem 0.8rem",
	fontFamily: "DM Sans",
	fontSize: "0.8rem",
	fontWeight: FONT_WEIGHT.BOLD,
	borderRadius: "0.2rem",
	width: "100%",
	display: "flex",
	cursor: "pointer",
};
const actionImageStyle = {};
const actionContentStyle = {
	marginLeft: "1rem",
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
};
const actionTextStyle = {
	fontFamily: "DM Sans",
};
const actionDescStyle = {
	fontSize: "0.82rem",
	fontFamily: "DM Sans",
	fontWeight: 500,
	marginTop: "0.15rem",
};

interface iListProps {
	heading: string;
	items: Array<iItem>;
	onItemClick: (id: string) => void;
	onBackPressed?: () => void;
	showBackButton?: boolean;
}

const List = (props: iListProps) => {
	const { heading, items, onItemClick, showBackButton, onBackPressed } = props;

	const out = items.map((item) => <Item key={item.id} item={item} onClick={onItemClick} />);

	return (
		<div>
			<div className="text-15" style={headingStyle}>
				<Conditional If={showBackButton}>
					<div onClick={onBackPressed}>
						<BackIcon style={backIconStyle} />
					</div>
				</Conditional>
				<span style={headingTitleStyle(!!showBackButton)}>{heading}</span>
			</div>
			<div style={listContainerStyle}>{out}</div>
		</div>
	);
};

const headingStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.ROW,
	fontFamily: "DM Sans",
	fontWeight: FONT_WEIGHT.BOLD,
	color: COLOR_CONSTANTS.GREEN_HEADING,
	alignItems: "center",
};
const backIconStyle = {
	width: "0.75rem",
	height: "0.75rem",
	cursor: "pointer",
};
const headingTitleStyle = (isBackIconPresent: boolean) => ({
	marginLeft: isBackIconPresent ? "0.85rem" : 0,
});
const listContainerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	marginTop: "1rem",
};

export { List };
