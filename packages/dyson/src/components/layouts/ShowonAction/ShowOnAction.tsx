import { ReactElement, useEffect, useRef, useState } from 'react';
import { OnOutsideClick } from "../onOutsideClick/onOutsideClick";

type TShowOnClick = {
	component: ReactElement | string;
	callback: Function;
	initialState: boolean;
} & React.DetailedHTMLProps<any, any>;

export function ShowOnClick({ children, component, callback, initialState }: TShowOnClick) {
	const [showDropDown, setShow] = useState(initialState);
	const customRef = useRef(null);

	useEffect(() => {
		callback && callback();
	}, [showDropDown]);

	useEffect(() => {
		setShow(initialState);
	}, [initialState]);

	return (
		<OnOutsideClick
			onOutsideClick={() => {
				console.log("Closing it now");
				setTimeout(() => {
					setShow(false);
				}, 100);
			}}
		>
			<div
				ref={customRef}
				className={"flex relative"}
				onClick={(e) => {
					e.stopPropagation();
					if(!showDropDown) {
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
