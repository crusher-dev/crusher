import { ReactElement, useEffect, useState } from "react";
import { OnOutsideClick } from "../onOutsideClick/onOutsideClick";

type TShowOnClick = {
	component: ReactElement | string;
	callback: Function;
	initialState: boolean;
} & React.DetailedHTMLProps<any, any>;

export function ShowOnClick({ children, component, callback, initialState }: TShowOnClick) {
	const [showDropDown, setShow] = useState(initialState);

	useEffect(() => {
		callback && callback();
	}, [showDropDown]);

	useEffect(() => {
		setShow(initialState);
	}, [initialState]);

	return (
		<OnOutsideClick
			onOutsideClick={() => {
				setShow(false);
			}}
		>
			<div
				className={"flex relative"}
				onClick={(e) => {
					setShow(true);
				}}
			>
				{children}
				{showDropDown && component}
			</div>
		</OnOutsideClick>
	);
}
