import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { LogoAnimated } from "./LogoAnimated";
export default {
	title: "Atoms/LogoAnimated",
	component: LogoAnimated,
} as Meta;

const Template: Story<any> = (args) => <LogoAnimated {...args} />;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { };
