import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iSettingsContentProps {
	children: React.ReactNode;
	contentCSS?: any;
}
const SettingsContent = (props: iSettingsContentProps) => {
	const { children, contentCSS: _manualContentCSS } = props;
	return (
		<div css={containerCSS}>
			<div css={[contentCSS, _manualContentCSS]}>{children}</div>
		</div>
	);
};

const containerCSS = css`
	width: 100%;
`;

const contentCSS = css`
	margin: 0 auto;
	margin-top: ${46 / PIXEL_REM_RATIO}rem;
	width: ${1024 / PIXEL_REM_RATIO}rem;
`;

export { SettingsContent };
