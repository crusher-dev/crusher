import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { LinkBlock, TextProps } from "./Link";
export default {
	title: "Atoms/Link",
	component: LinkBlock,
} as Meta;

const Template: Story<TextProps> = (args) => <LinkBlock {...args}>Heading</LinkBlock>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { fontSize: 16, weight: 400, color: "#fff", leading: false, className: "mt-2" };
