// .storybook/YourTheme.js

import { create } from '@storybook/theming';

export default create({
	base: 'dark',

	colorPrimary: 'hotpink',
	colorSecondary: 'deepskyblue',

	// UI
	appBg: '#181717',
	appContentBg: '#181717',
	appBorderColor: '#181717',
	appBorderRadius: 0,


	// Text colors
	textColor: '#fff',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: 'silver',
	barSelectedColor: '#fff',
	barBg: '#100f0f',

	// Form colors
	inputBg: '#100f0f',
	inputBorder: 'silver',
	inputTextColor: '#fff',
	inputBorderRadius: 4
});