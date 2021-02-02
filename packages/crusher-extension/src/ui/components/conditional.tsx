import React from "react";

interface iConditional {
	If: any;
	children: any;
}

const Conditional = (props: iConditional): React.ReactElement | null => {
	const { If, children } = props;

	if (If) {
		return children;
	} else {
		return null;
	}
};

export { Conditional };
