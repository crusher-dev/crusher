"use strict";
const COLOR = {
	BLUE: {
		600: "#5667BA",
		500: "#6074DE",
		400: "#8899EF",
		300: "#B3BFFD",
	},
	BLACK: {
		500: "#1B2028",
		600: "#161A20",
		400: "#2E333A",
	},
	WHITE: {
		500: "#979797",
		100: "#FFFFFF",
		600: "#2E333A",
	},
	PINK: {
		500: "#F141BF",
		600: "#D548AD",
		300: "#FF89DE",
	},
	GREEN: {
		500: "#AFDE73",
		600: "#95BC65",
		400: "#CCFF98",
	},
	RED: {
		500: "linear-gradient(0deg, rgba(0, 0, 0, 0.00), rgba(0, 0, 0, 0.00)), #E3345E;",
		600: "linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), #E3345E;",
		700: "linear-gradient(0deg, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)), #E3345E;",
	},
	PRIMARY: {
		500: "linear-gradient(0deg, rgba(0, 0, 0, 0.00), rgba(0, 0, 0, 0.00)), #B341F9;",
	}
};

const background = {};

const border = {};

module.exports = {
	colors: COLOR,
	background,
	border,
};
