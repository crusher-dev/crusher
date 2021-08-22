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
		const handleClick = (e: SyntheticEvent) => {
			const insideClick = ref?.current?.contains(e.target) || ref.current === e.target;
			if (!insideClick || isChildOfOnCloseClass(e.target, ref.current)) onOutsideClick();
		};
		window.addEventListener("click", handleClick, { capture: true });

		return () => {
			window.removeEventListener("click", handleClick, { capture: true });
		};
	}, []);

	return <div ref={ref}>{children}</div>;
};
