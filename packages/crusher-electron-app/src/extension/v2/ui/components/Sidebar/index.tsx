import React from "react";
import { css } from "@emotion/react";
import { Action } from "./Action";
import { Steps } from "./Steps";
import { Modal } from "@dyson/components/molecules/Modal";
import { Text } from "@dyson/components/atoms/text/Text";

export const containerStyle = css`
	padding: 26rem;
`;
const Sidebar = (): JSX.Element => {
	return (
		<>
			{/* <Modal
				modalStyle={css`
					width: 60vw;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -40%);
				`}
			>
				<div css={css``}>OKay</div>
				<Text
					CSS={css`
						font-size: 48rem;
					`}
				>
					Hey
				</Text>
			</Modal> */}
			<Action />
			<Steps />
		</>
	);
};

export default Sidebar;
