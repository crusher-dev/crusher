import React from "react";

interface ICheckboxProps {
	labelText: string;
	id: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = (props: ICheckboxProps) => {
	const { labelText, id, onChange } = props;

	return (
		<div>
			<input type="checkbox" onChange={onChange} id={id} />
			<label htmlFor={id} style={checkBoxLabelStyle}>
				{labelText}
			</label>
		</div>
	);
};

const checkBoxLabelStyle = {
	marginLeft: 12,
	fontSize: 15,
};

export { Checkbox };
