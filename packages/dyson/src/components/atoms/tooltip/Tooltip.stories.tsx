import React from "react";
import "../../../style/base.css";
// @ts-ignore
import markdown from "../info.stories.md";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, SerializedStyles } from "@emotion/react";

import { Tooltip, TooltipWrapperProps } from "./Tooltip";
export default {
	title: "Atoms/Tooltip",
	component: Tooltip,
	argTypes: {
		type: {
			options: ["click", "hover"],
			control: { type: "select" },
		},
		autoHide: {
			options: [true, false],
			control: { type: "radio" },
		},
		placement: {
			options: [
				"top-start",
				"top-end",
				"right-start",
				"right-end",
				"bottom-start",
				"bottom-end",
				"left-start",
				"left-end",
				"left",
				"right",
				"top",
				"bottom",
			],
			control: { type: "select" },
		},
		padding: {
			control: { type: "text" },
		},
		offset: {
			control: { type: "text" },
		},
	},
} as Meta;

const ClickTemplate: ComponentStory<TooltipWrapperProps> = (args) => {
	return (
		<div style={{ marginTop: 60, marginLeft: 200 }}>
			{/*Component starts*/}
			<Tooltip
				{...args}
				css={css`
					padding: 8rem;
				`}
			>
				<span className={"underline"}>Click over me</span>
			</Tooltip>

			{/*Component ends*/}
		</div>
	);
};

ClickTemplate.parameters = {
	status: "beta",
};

export const Click = ClickTemplate.bind();
Click.args = {
	content: "More info appears here",
	placement: "bottom-start",
	type: "click",
	autoHide: true,
};

const Template: ComponentStory<TooltipWrapperProps> = (args) => {
	console.log(args);
	return (
		<div style={{ marginTop: 60, marginLeft: 200 }}>
			{/*Component starts*/}
			<Tooltip {...args}>
				<span>Hover over me</span>
			</Tooltip>

			{/*Component ends*/}

			{args.offset < 0 && <div className={"mt-60"}>To make component sticky, set padding and negative offset.</div>}
		</div>
	);
};

Template.parameters = {
	status: "beta",
};

export const Hover = Template.bind({});
Hover.args = {
	content: "More info appears here",
	placement: "bottom",
	type: "hover",
	autoHide: true,
};

export const Sticky = Template.bind({});
Sticky.args = {
	content: "More info appears here",
	placement: "left",
	type: "hover",
	padding: 8,
	offset: -2,
	autoHide: true,
};

const TooltipTemplate2: ComponentStory<TooltipWrapperProps> = (args) => {
	return (
		<div style={{ marginTop: 60, marginLeft: 200 }}>
			{/*Component starts*/}
			<Tooltip
				{...args}
				content={
					<div
						css={css`
							min-width: 300px;
						`}
						className={"p-12"}
					>
						<div className={"font-600 text-15 mb-8"}>This is how you need to do</div>
						<div>Crusher makes it super easy tp create test</div>
					</div>
				}
				type={"hover"}
				css={css`
					padding: 8rem;
				`}
			>
				<span>Hover over me</span>
			</Tooltip>

			{/*Component ends*/}
		</div>
	);
};

TooltipTemplate2.parameters = {
	status: "beta",
};

export const Card = TooltipTemplate2.bind();
Card.args = {
	type: "hover",
	autoHide: true,
};
