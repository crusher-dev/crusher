import React from "react";
import "../../../style/base.css";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import markdown from "./info.stories.md";

import { SunIcon} from '@radix-ui/react-icons'

import { TRightItemProps,RightClickMenu } from "./RightClick";
export default {
	title: "Molecules/RightClick",
	component: RightClickMenu,
} as Meta;
import { css } from "@emotion/react";

const boxCSS= css`
border: 1px dashed #ffffff1a;
    color: white;
    border-radius: 4px;
    font-size: 15px;
    background: black;
    user-select: none;
    padding: 60px 0px;
    width: 600px;
    text-align: center;
	margin: 0 auto;
`

const Template: Story<TRightItemProps> = (args) => {
	return (
	<RightClickMenu menuItems={[...args.menuItems]}>
		<div css={boxCSS} className="flex flex-col items-center justify-center">
			<SunIcon/>
			<div className="mt-12">Click here to open right click menu</div>
		</div>
	</RightClickMenu>
	)
};

Template.parameters = {
	status: "beta",
};

export const Default = Template.bind({});

Default.parameters = {
	notes: { markdown },
};
Default.args = {
	menuItems:[
		{
			type: 'menuItem',
			value: 'Back',
			rightItem: <div>⌘+[</div>,
			onClick: ()=>{
				alert("Back")
			}
		},
		{
			type: 'menuItem',
			value: 'Disabled',
			disabled: true,
			onClick: ()=>{
				alert("Disabled")
			}
		},
		{
			type: 'menuItem',
			value: 'Forward',
			rightItem: <div>⌘+F</div>,
			onClick: ()=>{
				alert("Forward")
			}
		},
		{
			type: 'menuItem',
			value: 'Reload',
			rightItem: <div>⌘+R</div>,
			subItems: [{
				type: 'menuItem',
				value: 'Back',
				rightItem: <div>⌘+[</div>,
				onClick: ()=>{
					alert("Back")
				}
			},
			{
				type: 'menuItem',
				value: 'Disabled',
				disabled: true,
				onClick: ()=>{
					alert("Disabled")
				}
			}],
			onClick: ()=>{
				alert("Disabled")
			}
		},
		{
			type: 'separator',
		},
		{
			type: 'heading',
			value: "People"
		},
		{
			type: 'menuItem',
			value: 'Forward',
			rightItem: <div>⌘+F</div>,
			onClick: ()=>{
				alert("Forward")
			}
		},
		{
			type: 'separator',
		},
		{
			type: 'menuItem',
			value: 'Rename',
			rightItem: <div>⌘+F</div>,
			onClick: ()=>{
				alert("Rename")
			}
		},
		{
			type: 'menuItem',
			value: 'Save as',
			onClick: ()=>{
				alert("Save as")
			}
		},
		]

};


