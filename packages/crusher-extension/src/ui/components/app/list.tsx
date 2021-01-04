import React from "react";
import { FLEX_DIRECTION, FONT_WEIGHT } from "../../../interfaces/css";

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
	const { item, onClick } = props;

	const handleItemClick = () => {
		onClick(item.id);
	};

	return (
		<div style={itemRowStyle}>
			<div style={itemContainerStyle} id={item.id} onClick={handleItemClick}>
				<img style={actionImageStyle} src={item.icon} />
				<div style={actionContentStyle}>
					<span style={actionTextStyle}>{item.title}</span>
					<span style={actionDescStyle}>{item.desc}</span>
				</div>
			</div>
		</div>
	);
};

const itemRowStyle = {
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "1rem",
};
const itemContainerStyle = {
	padding: "0.8rem 0.8rem",
	fontFamily: "DM Sans",
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: "0.8rem",
	color: "#fff",
	background: "#15181E",
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
	fontSize: "0.9rem",
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
}

const List = (props: iListProps) => {
	const { heading, items, onItemClick } = props;

	const out = items.map((item) => (
		<Item key={item.id} item={item} onClick={onItemClick} />
	));

	return (
		<div>
			<div style={headingStyle}>{heading}</div>
			<div style={listContainerStyle}>{out}</div>
		</div>
	);
};

const headingStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.ROW,
	fontFamily: "DM Sans",
	fontSize: "0.875rem",
	color: "#fff",
};
const listContainerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	marginTop: "2rem",
};

export { List };
