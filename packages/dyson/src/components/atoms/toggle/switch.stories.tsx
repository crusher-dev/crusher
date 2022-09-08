import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import SwitchDemo,{ ToggleProps} from "./toggle1";
export default {
	title: "Atoms/Forms/Switch",
	component: SwitchDemo,
} as Meta;

const Template: Story<ToggleProps> = (args) => (
	<SwitchDemo size={"medium"} {...args}/>

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
Labels.args = { size: "small"};
