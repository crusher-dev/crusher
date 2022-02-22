import React, { SyntheticEvent, useEffect, useRef } from "react";

export const isChildOfOnCloseClass = (element, root) => {
	while (element !== root && element && document.body.contains(element)) {
		if (element?.classList?.contains("close-on-click")) {
			return true;
		}

		element = element.parentNode;
	}
	return false;
};

export const OnOutsideClick = ({ onOutsideClick, children }) => {
	const ref = useRef();
	useEffect(() => {
		const handleMouseDown = (e: SyntheticEvent) => {
			const insideClick = ref?.current?.contains(e.target) || ref.current === e.target;
			if (!insideClick || isChildOfOnCloseClass(e.target, ref.current)) onOutsideClick();
		};
		window.addEventListener("mousedown", handleMouseDown, { capture: true });

		return () => {
			window.removeEventListener("mousedown", handleMouseDown, { capture: true });
		};
	}, []);

	return <div className={"outsideDiv"} ref={ref}>{children}</div>;
};
