import React, { useState } from "react";
import { pxToRemValue } from "../../../utils/helpers";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { Conditional } from "../conditional";

interface iButtonProps {
	id?: string;
	title: string;
	style?: React.CSSProperties;
	icon?: any;
	onClick?: () => void;
}

const Button = (props: iButtonProps) => {
	const [, setIsHovered] = useState(false);
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
			className="text-15"
			style={{ ...buttonStyle(), ...(style || {}) }}
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

const buttonStyle = () => ({
	borderRadius: 6,
	width: "max-content",
	fontWeight: 500,
	background: COLOR_CONSTANTS.TRINARY,
	display: "flex",
	color: "#fff",
	border: `solid ${COLOR_CONSTANTS.BUTTON_BORDER_COLOR}`,
	borderWidth: "1px",
	alignItems: "center",
	justifyContent: "space-evenly",
	padding: `${pxToRemValue(6)} ${pxToRemValue(14)}`,
	cursor: "pointer",
});

const buttonNameStyle = (isIconThere: boolean) => ({
	marginLeft: isIconThere ? "1.2rem" : "0rem",
});
export { Button };
