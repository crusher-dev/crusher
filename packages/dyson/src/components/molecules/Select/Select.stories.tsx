import React from "react";
import "../../../style/base.css";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { SelectBox, TSelectBoxProps } from "./Select";
export default {
	title: "Molecules/SelectBox",
	component: SelectBox,
} as Meta;

const Template: Story<TSelectBoxProps> = (args) => {
	const [selected, setSelected] = React.useState<string>(args.selected);

	const handleCallback = (selected: any) => {
		setSelected([...selected] as any);

		if (args.callback) {
			args.callback(selected);
		}
	};

	return <SelectBox {...args} selected={selected} callback={handleCallback} />;
};

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});

Default.parameters = {
	status: "ready",
	height: "100rem",
	docs: { iframeHeight: 270 },
};
Default.args = {
	children: "SelectBox",
	values: generateSelectBoxValues(5),
	callback: () => {},
	placeholder: "Select an option",
};

function generateSelectBoxValues(len: number): Array<{ component: any; value: string; inactive: boolean }> {
	const CustomSelectOptionComponent = ({ label }) => {
		return <div>{label}</div>;
	};

	const values: Array<{ component: any; value: string; inactive: boolean }> = [];
	for (let i = 0; i < len; i++) {
		values.push({
			component: <CustomSelectOptionComponent label={`Item ${i + 1}`} />,
			value: `item${i}`,
			inactive: false,
		});
	}
	return values;
}
