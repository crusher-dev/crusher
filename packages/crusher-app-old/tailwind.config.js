const getSpacingSizes = () => {
	let sizingMap = {};
	const remBaseUnit = 16;
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i / remBaseUnit}rem`;
	return sizingMap;
};

// Start constants
const colors = {
	grey: "grey",
};

const background = {
	grey: "grey",
};

const border = {
	grey: "grey",
};

const spacingSizes = getSpacingSizes();

module.exports = {
	important: false,
	darkModeVariant: true,
	theme: {
		fontFamily: {
			gilroy: ["Gilroy", "sans-serif"],
			cera: ["Cera Pro", "sans-serif"],
		},
		colors: { ...colors },
		backgroundColor: { ...background },
		borderColor: { ...border },
		fontSize: spacingSizes,
		extend: {
			margin: spacingSizes,
			padding: spacingSizes,
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
