import React, { useContext } from "react";
import { ThemeContext } from "@constants/style";

export const Logo = (props) => {
	const theme = useContext(ThemeContext);
	return (
		<img
			src={`/assets/img/logo/logo_${theme}.svg`}
			className="logo"
			{...props}
		></img>
	);
};

export const WhiteLogo = (props) => (
	<img src="/svg/logo_white.svg" className="logo" {...props}></img>
);
