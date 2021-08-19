import { Story, Meta } from "@storybook/react/types-6-0";
import { Conditional } from "./Conditional";

export default {
	title: "Layouts/Conditional",
	component: Conditional,
} as Meta;

// @ts-ignore
const Template: Story<Conditional> = (args) => <Conditional {...args}>Lorem ipsum</Conditional>;

Template.parameters = {
	status: "ready",
};

export const ShowComponent = Template.bind({});
ShowComponent.parameters = {
	status: "ready",
};
ShowComponent.args = {
	showIf: true,
};

export const HideComponent = Template.bind({});
HideComponent.parameters = {
	status: "ready",
};
HideComponent.args = {
	showIf: false,
};
