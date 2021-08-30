import React from "react";
import "../../../style/base.css";
// @ts-ignore
import markdown from "../info.stories.md";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Input, InputProps } from "./Input";
export default {
	title: "Atoms/Input",
	component: Input,
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args} />;

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
