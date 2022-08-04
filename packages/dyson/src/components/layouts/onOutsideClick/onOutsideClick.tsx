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

/* @Todo: Find better inexpensive approach for blackListingClassNames */
export const OnOutsideClick = ({ onOutsideClick, disable, blackListClassNames = [], children, className }) => {
	const ref = useRef();
	useEffect(() => {
		if(!disable) {
			const handleMouseDown = (e: React.MouseEvent) => {
				const insideClick = ref?.current?.contains(e.target) || ref.current === e.target;
				if (!insideClick || isChildOfOnCloseClass(e.target, ref.current)) {
					const isBlackListed = e.composedPath().some((element) => {
						return blackListClassNames.some((className) => element.classList?.contains(className));
					});

					if (!isBlackListed) return onOutsideClick();
				}
			};
			window.addEventListener("mousedown", handleMouseDown, { capture: true });

			return () => {
				window.removeEventListener("mousedown", handleMouseDown, { capture: true });
			};
		}
	}, [disable]);

	return (
		<div className={className ? `${className} outsideDiv` : "outsideDiv"} ref={ref}>
			{children}
		</div>
	);
};
