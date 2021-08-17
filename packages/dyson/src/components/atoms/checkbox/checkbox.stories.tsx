import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { ChecboxProps, Checkbox } from "./checkbox";
export default {
	title: "Atoms/Forms/Checkbox",
	component: Checkbox,
} as Meta;

const Template: Story<ChecboxProps> = (args) => <Checkbox {...args}></Checkbox>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.parameters = {
	status: "ready",
};
WithLabel.args = { label: "true" };

export const Selected = Template.bind({});
Selected.parameters = {
	status: "ready",
};
Selected.args = { label: "true", isSelected: true };

export const Disabled = Template.bind({});
Disabled.parameters = {
	status: "ready",
};
Disabled.args = { label: "true", isSelected: true };

export const SelectAll = Template.bind({});
SelectAll.parameters = {
	status: "ready",
};
SelectAll.args = { disabled: true, label: "true", isSelected: true, isSelectAllType: true };
