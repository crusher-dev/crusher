import { editInputAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { useAtom } from "jotai";
import React from "react";
import { ResizableInput } from "../ResizableInput";

const EditableInput = ({ defaultValue, labelComponent, id, inputCss, className, onChange }) => {
	const [currentItemId, setTestEditName] = useAtom(editInputAtom);
	const [name, setName] = React.useState(defaultValue);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleOnChange = (value) => {
        setName(value);
		onChange(value);
	};

	const editThisTestName = currentItemId === id;
	const isEditingThisItem = currentItemId === id;

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