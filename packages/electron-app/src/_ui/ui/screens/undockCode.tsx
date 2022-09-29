import React from "react";
import { css } from "@emotion/react";
import { CustomCodeModal } from "../containers/components/modals/page/customCodeModal";

function UnDockCodeScreen() {
	const handleClose = () => {
		window.close();
	};

	return (
		<div
			css={css`
				height: 100vh;
			`}
		>
			{process.platform === "darwin" ? <div css={dragStyle} className={"drag"}></div> : ""}
			<CustomCodeModal isOpen={true} handleClose={handleClose} />
		</div>
	);
}

const titleStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
`;
const dragStyle = css`
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;
const testItemStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	letter-spacing: 0.03em;

	color: #ffffff;

	li {
		padding: 14px 46px;
		position: relative;
		.action-buttons {
			display: none;
		}
		:hover {
			background: rgba(217, 217, 217, 0.04);
			color: #9f87ff;
			.action-buttons {
				display: block;
			}
		}
	}
`;

export { UnDockCodeScreen };
export default React.memo(UnDockCodeScreen);
