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

const dragStyle = css`
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
`;

export { UnDockCodeScreen };
export default React.memo(UnDockCodeScreen);
