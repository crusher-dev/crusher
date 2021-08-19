import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { RadioProps, Radio } from "./radio";
export default {
	title: "Atoms/Forms/Radio",
	component: Radio,
} as Meta;

const Template: Story<RadioProps> = (args) => <Radio {...args}></Radio>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = {};

export const Disabled = Template.bind({});
Disabled.parameters = {
	status: "ready",
};
Disabled.args = { isSelected: true, disabled: true };

export const Labels = Template.bind({});
Labels.parameters = {
	status: "ready",
};
Labels.args = { isSelected: "Off", label: "On" };
