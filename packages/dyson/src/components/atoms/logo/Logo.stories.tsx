import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { HEIGHT_NAMES, Logo, LogoProps } from './Logo';
export default {
    title: 'Example/logo',
    component: Logo,
} as Meta;

const Template: Story<LogoProps> = (args) => <Logo {...args} />;

Template.parameters = {
    status: 'beta'
}

export const OnlyIcon = Template.bind({});

OnlyIcon.parameters = {
    status: 'ready',
}
OnlyIcon.args = {
    imgEelement: <img style={{ height: "inherit" }} src="https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg">

    </img>,
    height: "small",
    onlyIcon: true

};
