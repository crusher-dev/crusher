import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { Logo, LogoProps } from "./Logo";
export default {
	title: "Atoms/Logo",
	component: Logo,
} as Meta;

const Template: Story<LogoProps> = (args) => <Logo {...args} />;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { height: "100rem" };

export const OnlyIcon = Template.bind({});
OnlyIcon.parameters = {
	status: "ready",
};
OnlyIcon.args = {
	showOnlyIcon: true,
	height: "100rem",
};

export const OnlyMonoChrome = Template.bind({});
OnlyMonoChrome.parameters = {
	status: "ready",
};
OnlyMonoChrome.args = {
	isMonochrome: true,
};
