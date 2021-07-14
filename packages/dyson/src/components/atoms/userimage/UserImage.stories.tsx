import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { UserImage } from "./UserImage";
export default {
	title: "Atoms/UserImage",
	component: UserImage,
} as Meta;

const Template = (args) => <UserImage {...args} />;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = {};
