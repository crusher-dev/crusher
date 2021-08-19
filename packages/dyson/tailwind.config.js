const { spacingSizes } = require("./src/constant/layout");
const { colors, background, border } = require("./src/constant/color");
const { FONTS, FONT_WEIGHT_VALUE, LINE_HEIGHT_VALUE, FONT_SIZES } = require("./src/constant/font");

module.exports = {
	important: false,
	darkModeVariant: false,
	theme: {
		fontFamily: FONTS,
		colors: { ...colors },
		backgroundColor: { ...background },
		borderColor: { ...border },
		fontSize: spacingSizes,
		fontSize: FONT_SIZES,
		fontWeight: FONT_WEIGHT_VALUE,
		extend: {
			margin: spacingSizes,
			padding: spacingSizes,
			height: spacingSizes,
			width: spacingSizes,
			lineHeight: LINE_HEIGHT_VALUE,
		},
		borderRadius: {
			full: "50%",
		},
		objectPosition: {},
		order: {},
	},
	variants: {
		accessibility: ["focus"],
		alignContent: [],
		alignItems: [],
		alignSelf: [],
		appearance: [],
		backgroundAttachment: [],
		backgroundColor: ["hover", "focus"],
		backgroundPosition: [],
		backgroundRepeat: [],
		backgroundSize: [],
		borderCollapse: [],
		borderColor: ["hover", "focus"],
		borderRadius: [],
		borderStyle: [],
		borderWidth: [],
		boxShadow: ["hover", "focus"],
		cursor: [],
		display: [],
		fill: [],
		flex: [],
		flexDirection: [],
		flexGrow: [],
		flexShrink: [],
		flexWrap: [],
		float: [],
		fontFamily: [],
		fontSize: [],
		fontSmoothing: [],
		fontStyle: [],
		fontWeight: ["hover", "focus"],
		height: [],
		inset: [],
		justifyContent: [],
		letterSpacing: [],
		lineHeight: [],
		listStylePosition: [],
		listStyleType: [],
		margin: [],
		maxHeight: [],
		maxWidth: [],
		minHeight: [],
		minWidth: [],
		objectFit: [],
		objectPosition: [],
		opacity: ["hover", "focus"],
		order: [],
		outline: ["focus"],
		overflow: [],
		padding: [],
		placeholderColor: ["focus"],
		pointerEvents: [],
		position: [],
		resize: [],
		stroke: [],
		tableLayout: [],
		textAlign: [],
		textColor: ["hover", "focus"],
		textDecoration: ["hover", "focus"],
		textTransform: [],
		userSelect: [],
		verticalAlign: [],
		visibility: [],
		whitespace: [],
		width: [],
		wordBreak: [],
		zIndex: [],
	},
	corePlugins: {
		float: false,
		translate: false,
		gradientColorStops: false,
		skew: false,
		scale: false,
		gridAutoFlow: false,
		gridColumn: false,
		gridColumnEnd: false,
		gridColumnStart: false,
		gridRow: false,
		gridAutoColumns: false,
		gridRowEnd: false,
		gridRowStart: false,
		gridTemplateColumns: false,
		gridTemplateRows: false,
	},
	plugins: [],
};
