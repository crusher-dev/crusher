import { css } from "@emotion/react";
import React from "react";

export const ModuleCard = () => {
	return (
		<div className={"flex px-20 py-12 pt-16 items-start justify-between"} css={cardStyle}>
			<div>
				<div className={"text-15 font-700 mb-8 leading-none"}>Setup Crusher</div>
				<div className={"text-12 mb-2 leading-none"}>Run initial script</div>

				{/*<div className={"text-13 flex items-center font-500"}>*/}
				{/*	<div style={OnlineDotCSS} className={"mr-9 mb-1"}></div>Setup Complete*/}
				{/*</div>*/}
			</div>
			<div>
				{/*<Button className="text-13" css={smallButtonStyle} type={"small"} onClick={onClick}>*/}
				{/*	Install*/}
				{/*</Button>*/}
			</div>
		</div>
	);
};

const cardStyle = css`
	width: 508px;
	background: #0f1214;
	background: #1b1d1f;
	border-radius: 9px;
	border: 1px solid #292f33;
`;
