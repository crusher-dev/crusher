import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { Text, TextProps } from "./Link";
export default {
	title: "Atoms/Text",
	component: Text,
} as Meta;

const Template: Story<TextProps> = (args) => <Text {...args}>Heading</Text>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { fontSize: 16, weight: 400, color: "#fff", leading: false, className: "mt-2" };
