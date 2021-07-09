import { Story, Meta } from '@storybook/react/types-6-0';

import { CenterLayout, CenterLayoutProps } from './CenterLayout';
export default {
    title: 'Example/Layouts/CenterLayout',
    component: CenterLayout,
} as Meta;

const Template: Story<CenterLayoutProps> = (args) => <CenterLayout {...args} />;

Template.parameters = {
    status: 'beta'
}

export const Primary = Template.bind({});

Primary.parameters = {
    status: 'ready',
}
Primary.args = {
    children: 'ReactNode',
};


