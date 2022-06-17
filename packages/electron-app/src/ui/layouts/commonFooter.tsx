import React from "react";
import { css } from "@emotion/react";
import { shell } from "electron";

function CommonFooter() {
	const handleDocsClick = React.useCallback(() => {
		shell.openExternal("https://docs.crusher.dev");
	}, []);

	return (
		<div css={navBarStyle}>
			<div className={"navItem"} onClick={handleDocsClick}>
				Docs
			</div>
			<div
				className="navItem"
				css={css`
					margin-left: auto;
				`}
			>
				{/* {"Settings"} */}
			</div>
		</div>
	);
}

const navBarStyle = css`
	display: flex;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	z-index: 99;
	width: 100%;
	color: rgba(255, 255, 255, 0.67);
	.navItem {
		:hover {
			opacity: 0.8;
		}
	}
`;

export { CommonFooter };
