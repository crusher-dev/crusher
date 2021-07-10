import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { DiscordSocialBtn, DiscordSocialBtnProps } from "./DiscordSocialBtn";
export default {
    title: "Atoms/Social Buttons/DiscordSocialBtn",
    component: DiscordSocialBtn,
} as Meta;

const Template: Story<DiscordSocialBtnProps> = (args) => <DiscordSocialBtn {...args} />;

Template.parameters = {
    status: "beta",
};

export const Primary = Template.bind({});

Primary.parameters = {
    status: "ready",
};
Primary.args = {
    count: 234
};

