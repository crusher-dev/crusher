import React, { SyntheticEvent, useEffect, useRef } from "react";

export const isChildOfOnCloseClass = (target, root) => {
	let element = target;

	while (element !== root) {
		if (element.className.includes("close-on-click")) {
			return true;
		}

		element = element.parentElement;
	}
	return false;
};

export const OnOutsideClick = ({ onOutsideClick, children }) => {
	const ref = useRef();
	useEffect(() => {
		const handleClick = (e: SyntheticEvent) => {
			e.stopPropagation();
			const insideClick = ref?.current?.contains(e.target) || ref.current === e.target;

			if (!insideClick || isChildOfOnCloseClass(e.target, ref.current)) onOutsideClick();
		};
		document.body.addEventListener("click", handleClick, { passive: true });

		return () => {
			document.body.removeEventListener("click", handleClick, { passive: true });
		};
	}, []);

	return <div ref={ref}>{children}</div>;
};
