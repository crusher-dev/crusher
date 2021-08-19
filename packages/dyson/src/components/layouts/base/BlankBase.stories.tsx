import React from "react";

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { BlankBase, BlankBaseProps } from "./BlankBase";
export default {
	title: "Layouts/Base/BlankBase",
	component: BlankBase,
} as Meta;

const Template: Story<BlankBaseProps> = (args) => <BlankBase {...args} />;

Template.parameters = {
	status: "beta",
};

export const Primary = Template.bind({});

Primary.parameters = {
	status: "ready",
};
Primary.args = {
	children: "ReactNode",
};
