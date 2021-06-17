import React from "react";

interface IInputField {
	className?: string;
	style?: object;
	placeholder: string;
	onChange?: () => void;
}
const InputField = (props: IInputField) => {
	const { className } = props;
	return (
		<input
			{...props}
			type="text"
			style={{ borderWidth: "1px", maxHeight: "2rem", ...props.style }}
			className={`p-4  
            focus:outline-none
            focus:border-gray-400
            rounded-md
            bg-transparent text-white border-gray-600 ${className}`}
		/>
	);
};

export default InputField;
