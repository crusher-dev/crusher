// .storybook/manager.js

import { addons } from '@storybook/addons';
import yourTheme from './YourTheme';
import { themes } from "@storybook/theming";
addons.setConfig({
	theme: themes.dark,
});