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
				...style,
			}}
			className="focus:outline-none px-32 py-8
					text-13 max-w-max mt-4 rounded-md  text-white"
		>
			{title}
		</button>
	);
};

export { BlueButton };
