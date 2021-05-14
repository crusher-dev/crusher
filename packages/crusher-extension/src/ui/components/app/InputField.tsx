import React from "react";

interface iInputField {
	className?: string;
	style?: object;
	placeholder: string;
	onChange?: () => void;
}
const InputField = (props: iInputField) => {
	const { className, style, onChange, placeholder } = props;
	return (
		<input
			type="text"
			style={style ? style : {}}
			onChange={onChange}
			placeholder={placeholder}
			className={`p-2 border-2 
            focus:outline-none
            focus:border-gray-400
            rounded-md
            bg-transparent text-white border-gray-600 ${className}`}
		/>
	);
};

export default InputField;
