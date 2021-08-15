import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { TextBlock, TextBlockProps } from "./TextBlock";
export default {
	title: "Atoms/TextBlock",
	component: TextBlock,
} as Meta;

const Template: Story<TextBlockProps> = (args) => <TextBlock {...args}>Heading</TextBlock>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { fontSize: 16, weight: 400, color: "#fff", leading: false, className: "mt-2" };
