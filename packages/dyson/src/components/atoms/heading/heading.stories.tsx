import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { Heading, HeadingProps } from "./Heading";
export default {
	title: "Atoms/Heading",
	component: Heading,
} as Meta;

const Template: Story<HeadingProps> = (args) => <Heading {...args}>Heading</Heading>;

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = { type: 1, fontSize: 16, weight: 700, color: "#fff", leading: false };

export const H1 = Template.bind({});
H1.parameters = {
	status: "ready",
};
H1.args = { type: 1, fontSize: 36, weight: 700, color: "#fff", leading: false };

export const H2 = Template.bind({});
H2.parameters = {
	status: "ready",
};
H2.args = { type: 1, fontSize: 32, weight: 700, color: "#fff", leading: false };

export const H3 = Template.bind({});
H3.parameters = {
	status: "ready",
};
H3.args = { type: 1, fontSize: 28, weight: 700, color: "#fff", leading: false };

export const H4 = Template.bind({});
H4.parameters = {
	status: "ready",
};
H4.args = { type: 1, fontSize: 24, weight: 700, color: "#fff", leading: false };

export const H5 = Template.bind({});
H5.parameters = {
	status: "ready",
};
H5.args = { type: 1, fontSize: 20, weight: 700, color: "#fff", leading: false };

export const H6 = Template.bind({});
H6.parameters = {
	status: "ready",
};
H6.args = { type: 1, fontSize: 18, weight: 700, color: "#fff", leading: false };
