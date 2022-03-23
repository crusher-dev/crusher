import { ReactElement, useEffect, useRef, useState } from "react";
import { OnOutsideClick } from "../onOutsideClick/onOutsideClick";

type TShowOnClick = {
	component: ReactElement | string;
	callback: Function;
	initialState: boolean;

	// For emotion
	className?: string;
} & React.DetailedHTMLProps<any, any>;

/*
	Should close on outside click
 */
export function ShowOnClick({ children, component, className, callback, initialState }: TShowOnClick) {
	const [showDropDown, setShow] = useState(initialState);
	const customRef = useRef(null);

	useEffect(() => {
		callback && callback(showDropDown);
	}, [showDropDown]);

	useEffect(() => {
		setShow(initialState);
	}, [initialState]);

	return (
		<OnOutsideClick
			className={className}
			onOutsideClick={() => {
				// This timeout here is workaround to allow children event listeners to get
				// triggered before dropdown is removed from the DOM.
				setTimeout(() => {
					setShow(false);
				}, 100);
			}}
		>
			<div
				ref={customRef}
				className={"showOnClick flex relative"}
				onClick={(e) => {
					e.stopPropagation();
					if (!showDropDown) {
						setShow(true);
					}
				}}
			>
				{children}
				{showDropDown && component}
			</div>
		</OnOutsideClick>
	);
}
