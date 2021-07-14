import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { css } from '@emotion/react';
import { GithubSocialBtn, GithubSocialBtnProps } from "./GithubSocialBtn";
export default {
    title: "Atoms/Social Buttons/GithubSocialBtn",
    component: GithubSocialBtn,
} as Meta;

const basicCSS =     css`
      width: 300rem;
    `

const Template: Story<GithubSocialBtnProps> = (args) => <GithubSocialBtn css={basicCSS} {...args} />;

Template.parameters = {
    status: "beta",
};

export const Primary = Template.bind({});

Primary.parameters = {
    status: "ready",
};
Primary.args = {
    count: 234,

};

