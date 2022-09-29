import { Button } from "@dyson/components/atoms/button/Button";
import { css } from "@emotion/react";
import React from "react";

const BrowserButton = ({ children, className, ...props }) => {
	return (
		<Button
			bgColor={"tertiary-dark"}
			css={css`
				border-color: transparent;
				padding: 0 6rem;
			`}
			className={`${className}`}
			{...props}
		>
			{children}
		</Button>
	);
};

export { BrowserButton };
