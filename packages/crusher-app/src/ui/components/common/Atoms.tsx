import React, { useContext } from "react";
import { ThemeContext } from "@constants/style";
import WhiteLogoSvg from "../../../../public/svg/logo_white.svg";

export const Logo = (props: any) => {
	const theme = useContext(ThemeContext);
	return (
		<img
			src={`/assets/img/logo/logo_${theme}.svg`}
			className="logo"
			{...props}
		></img>
	);
};

export const WhiteLogo = (props: any) => (
	<WhiteLogoSvg className={"logo"} {...props} />
);
