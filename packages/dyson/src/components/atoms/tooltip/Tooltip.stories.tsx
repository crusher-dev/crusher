import React from "react";
import "../../../style/base.css";
// @ts-ignore
import markdown from "../info.stories.md";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Tooltip, ButtonProps } from "./Tooltip";
export default {
	title: "Atoms/Tooltip",
	component: Tooltip,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Tooltip {...args} />;

Template.parameters = {
	status: "beta",
};

export const Primary = Template.bind({});

Primary.parameters = {
	notes: { markdown },
	status: "ready",
};
Primary.args = {
	children: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
	children: "Button",
};

export const Large = Template.bind({});
Large.args = {
	size: "large",
	children: "Buttons",
};

export const Small = Template.bind({});
Small.args = {
	size: "small",
	children: "Button",
};
