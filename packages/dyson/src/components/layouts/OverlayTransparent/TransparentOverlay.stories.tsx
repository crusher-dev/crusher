import { Story, Meta } from "@storybook/react/types-6-0";
import { OverlayTransparent } from "./OverlayTransparent";
import { CenterLayout } from "../CenterLayout/CenterLayout";
import { css } from "@emotion/react";

export default {
	title: "Layouts/OverlayTransparent",
	component: OverlayTransparent,
} as Meta;

// @ts-ignore
const Template: Story<OverlayTransparent> = (args) => (
	<OverlayTransparent {...args}>
		<CenterLayout
			css={css`
				color: white;
			`}
		>
			HI
		</CenterLayout>
	</OverlayTransparent>
);

Template.parameters = {
	status: "ready",
};

export const Default = Template.bind({});
Default.parameters = {
	status: "ready",
};
Default.args = {};
