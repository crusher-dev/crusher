import { editTestNameAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { useAtom } from "jotai";
import React from "react";
import { ResizableInput } from "../ResizableInput";

const EditableInput = ({ defaultValue, labelComponent, id, onChange }) => {
	const [currentItemId, setTestEditName] = useAtom(editTestNameAtom);
	const [name, setName] = React.useState(defaultValue);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleOnChange = (value) => {
        setName(value);
		onChange(value);
	};

	const editThisTestName = currentItemId === id;

	return (
		<ResizableInput
			ref={inputRef}
			onChange={handleOnChange}
			value={name}
			isEditingProp={editThisTestName}
			labelComponent={labelComponent}
		/>
	);
};

export {EditableInput};