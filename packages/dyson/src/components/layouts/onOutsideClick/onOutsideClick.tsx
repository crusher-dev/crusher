import React, { SyntheticEvent, useEffect, useRef } from "react";

export const OnOutsideClick = ({ onOutsideClick, children }) => {
	const ref = useRef();
	useEffect(() => {
		const handleClick = (e: SyntheticEvent) => {
			e.stopPropagation();
			const insideClick = ref?.current?.contains(e.target) || ref.current === e.target;
			if (!insideClick) onOutsideClick();
		};
		document.body.addEventListener("click", handleClick, { passive: true });

		return () => {
			document.body.removeEventListener("click", handleClick);
		};
	}, []);

	return <div ref={ref}>{children}</div>;
};
