import React from "react";
import { ResizableInput } from "../ResizableInput";

const EditableInput = ({ defaultValue, className, labelComponent, id, inputCss, labelCss, onChange, forwardRef }) => {
	const [name, setName] = React.useState(defaultValue);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleOnChange = (value) => {
		setName(value);
		const returnValue = onChange(value);
		if(returnValue?.value) {
			setName(returnValue.value);
		}
	};

	return <ResizableInput labelCss={labelCss} className={className} inputCSS={inputCss} id={id} ref={inputRef} onChange={handleOnChange} value={name} labelComponent={labelComponent} />;
};

export { EditableInput };
