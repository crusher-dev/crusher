import React from "react";
import { ResizableInput } from "../ResizableInput";

const EditableInput = ({
    defaultValue,
    labelComponent,
    id,
    inputCss,
    onChange
}) => {
    const [name, setName] = React.useState(defaultValue);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleOnChange = (value) => {
        setName(value);
		onChange(value);
	};

    return (
		<ResizableInput
			inputCSS={inputCss}
			id={id}
			ref={inputRef}
			onChange={handleOnChange}
			value={name}
			labelComponent={labelComponent}
		/>
	);
};

export {EditableInput};