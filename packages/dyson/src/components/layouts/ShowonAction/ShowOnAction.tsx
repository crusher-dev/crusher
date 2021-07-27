import { useEffect, useRef, useState } from "react";
export function ShowOnClick({ children, component,callback, initialState, }) {
	const [showDropDown, setShow] = useState(initialState || false);

	const ref = useRef();
	useEffect(() => {
		const handleClick = (e) => {
			e.stopPropagation();
			const insideClick = ref.current.contains(e.target) || ref.current === e.target;

			if (!insideClick ) setShow(false);
		};
		document.body.addEventListener("click", handleClick, { passive: true });

		return () => {
			document.body.removeEventListener("click", handleClick);
		};
	}, []);

	useEffect(()=>{
		callback && callback(showDropDown)
	},[showDropDown])
	return (
		<div className={"flex relative"} ref={ref} onClick={setShow.bind(this,true)}>
			{children}
			{showDropDown && component}
		</div>
	);
}