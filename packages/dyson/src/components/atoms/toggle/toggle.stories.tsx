import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { Toggle,ToggleProps } from "./toggle";
export default {
	title: "Atoms/Forms/Toogle",
	component: Toggle,
} as Meta;

const Template: Story<ToggleProps> = (args) => (
	<Toggle {...args}></Toggle>
);

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
Disabled.args = { disabled: true };

export const Labels = Template.bind({});
Labels.parameters = {
	status: "ready",
};
Labels.args = { leftSide: "Off", rightSide: "On" };
