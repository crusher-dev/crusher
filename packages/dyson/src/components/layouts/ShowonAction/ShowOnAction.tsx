import { useEffect, useState } from "react";
import { OnOutsideClick } from "../onOutsideClick/onOutsideClick";
export function ShowOnClick({ children, component, callback, initialState }) {
	const [showDropDown, setShow] = useState(initialState || false);

	useEffect(() => {
		callback();
	}, [showDropDown]);

	return (
		<OnOutsideClick
			onOutsideClick={() => {
				setShow(false);
			}}
		>
			<div className={"flex relative"} onClick={setShow.bind(this, true)}>
				{children}
				{showDropDown && component}
			</div>
		</OnOutsideClick>
	);
}
