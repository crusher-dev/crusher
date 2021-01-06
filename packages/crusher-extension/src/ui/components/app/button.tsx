import React, { useState } from "react";
import { Conditional } from "../conditional";

interface iButtonProps {
	title: string;
	style?: React.CSSProperties;
	icon?: any;
	onClick?: () => void;
}

const Button = (props: iButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const { title, icon: Icon, onClick, style } = props;

	const handleMouseOver = () => {
		setIsHovered(true);
	};

	const handleMouseOut = () => {
		setIsHovered(false);
	};

	return (
		<div
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
	background: isHovered ? "rgba(91,118,247, 0.85)" : "rgb(91,118,247, 1)",
	color: isHovered ? "rgba(255,255,255, 1)" : "rgba(255,255,255, 0.95)",
	fontFamily: "DM Sans",
	padding: "0.5rem 0.95rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	width: "auto",
	marginLeft: "auto",
});

const buttonNameStyle = (isIconThere: boolean) => ({
	marginLeft: isIconThere ? "1.2rem" : "0rem",
});
export { Button };
