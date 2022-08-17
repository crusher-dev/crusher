import React from "react";
import "../../../style/base.css";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { SelectBox, TSelectBoxProps,RightClickMenu } from "./RightClick";
export default {
	title: "Molecules/RightClick",
	component: SelectBox,
} as Meta;
import { css, SerializedStyles } from "@emotion/react";

const boxCSS= css`
border: 1px dashed #ffffff1a;
    color: white;
    border-radius: 4px;
    font-size: 15px;
    background: black;
    user-select: none;
    padding: 60px 0px;
    width: 600px;
    text-align: center;
	margin: 0 auto;
`

const Template: Story<TSelectBoxProps> = (args) => {
	

	return (<RightClickMenu>
		<div css={boxCSS}>Click here to activate</div>
	</RightClickMenu>)
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
