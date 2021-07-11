import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { GithubSocialBtn, GithubSocialBtnProps } from "./GithubSocialBtn";
export default {
    title: "Atoms/social Buttons/GithubSocialBtn",
    component: GithubSocialBtn,
} as Meta;

const Template: Story<GithubSocialBtnProps> = (args) => <GithubSocialBtn {...args} />;

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

