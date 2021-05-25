import React, { useState } from "react";
import { pxToRemValue } from "../../../utils/helpers";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";
import { Conditional } from "../conditional";

interface iButtonProps {
	id?: string;
	title: string;
	style?: React.CSSProperties;
	icon?: any;
	onClick?: () => void;
}

const Button = (props: iButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const { id, title, icon: Icon, onClick, style } = props;

	const handleMouseOver = () => {
		setIsHovered(true);
	};

	const handleMouseOut = () => {
		setIsHovered(false);
	};

	return (
		<div
			id={id}
			style={{ ...buttonStyle(isHovered), ...(style ? style : {}) }}
			onClick={onClick}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
		>
			<Conditional If={Icon}>
				<Icon />
			</Conditional>
			<div style={buttonNameStyle(!!Icon)}>{title}</div>
		</div>
	);
};

const buttonStyle = (isHovered: boolean) => ({
	borderRadius: 6,
	fontWeight: 500,
	fontSize: "0.925rem",
	background: COLOR_CONSTANTS.TRINARY,
	display: "flex",
	color: "#fff",
	border: `solid ${COLOR_CONSTANTS.BUTTON_BORDER_COLOR}`,
	borderWidth: "1px",
	alignItems: "center",
	justifyContent: "space-evenly",
	padding: `${pxToRemValue(12)} ${pxToRemValue(28)}`,
	cursor: "pointer",
	height: pxToRemValue(34),
});

const buttonNameStyle = (isIconThere: boolean) => ({
	marginLeft: isIconThere ? "1.2rem" : "0rem",
});
export { Button };
