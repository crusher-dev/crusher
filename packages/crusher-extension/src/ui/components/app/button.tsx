import React, { useState } from "react";
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
			<span style={buttonNameStyle(!!Icon)}>{title}</span>
		</div>
	);
};

const buttonStyle = (isHovered: boolean) => ({
	borderRadius: 4,
	fontWeight: 600,
	fontSize: "0.825rem",
	background: COLOR_CONSTANTS.TRINARY,
	display: "flex",
	color: "#fff",
	border: `solid ${COLOR_CONSTANTS.BORDER}`,
	borderWidth: "1px",
	alignItems:"center",
	justifyContent:"space-evenly",
	padding:"0.2rem",
	paddingRight:"0.5rem",
	paddingLeft:"0.5rem"
});

const buttonNameStyle = (isIconThere: boolean) => ({
	marginLeft: isIconThere ? "1.2rem" : "0rem",
});
export { Button };
