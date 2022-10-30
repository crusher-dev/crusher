import React from "react";
import { css } from "@emotion/react";

const HoverButton = ({ onClick, wrapperCss, children, title = "", height = 20, width = 20, className = "", ...props }: any) => {
	return (
		<div onClick={onClick} className={`flex items-center justify-center ${className}`} css={[hoverIconCss(height, width), wrapperCss]} title={title} {...props}>
			{children}
		</div>
	);
};

const hoverIconCss = (height, width) => css`
	height: ${height}px;
	width: ${width}px;
	border-radius: 2rem;

	:hover {
		path {
			fill: #fff;
		}
		background: rgba(255, 255, 255, 0.15);
	}
`;
export { HoverButton };