import React from "react";
import { css } from "@emotion/react";

const TemplateActions = ({ className, ...props }: { className?: any }) => {
	return <div className={`${className}`} css={containerStyle}></div>;
};

const containerStyle = css``;

export { TemplateActions };
