import React from "react";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";

interface iButtonProps {
	id?: string;
	title: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

const BlueButton = (props: iButtonProps) => {
	const { id, title, onClick, style } = props;
	return (
		<button
			id={id}
			onClick={onClick}
			style={{
				backgroundColor: COLOR_CONSTANTS.BUTTON_BLUE,
				paddingTop: "6px",
				paddingBottom: "6px",
				...style,
			}}
			className="focus:outline-none pr-8 pl-8 
					text-sm max-w-max mt-4 rounded-md  text-white"
		>
			{title}
		</button>
	);
};

export { BlueButton };
