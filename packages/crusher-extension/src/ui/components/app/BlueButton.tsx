import React from "react";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";

interface iButtonProps {
	id?: string;
	title: string;
	style?: React.CSSProperties;
	className?: string;
	onClick?: () => void;
}

const BlueButton = (props: iButtonProps) => {
	const { id, title, onClick, style, className } = props;
	return (
		<button
			id={id}
			onClick={onClick}
			style={{
				backgroundColor: COLOR_CONSTANTS.BUTTON_BLUE,
				...style,
			}}
			className={`focus:outline-none px-32 py-8
					text-13 max-w-max rounded-md  text-white ${className || ""}`}
		>
			{title}
		</button>
	);
};

export { BlueButton };
