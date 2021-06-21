import React, { useContext } from "react";
import { ThemeContext } from "@constants/style";

export const Logo = (props: any) => {
	const theme = useContext(ThemeContext);
	return <img src={`/assets/img/logo/logo_${theme}.svg`} className="logo" {...props}></img>;
};

export const WhiteLogo = (props: any) => <img src={"/assets/img/logo/logo_dark.svg"} className="logo" {...props}></img>;
