import React from "react";
import { css } from "@emotion/react";
import { Action } from "./Action";
import { Steps } from "./Steps";
export const containerStyle = css`
	padding: 26rem;
`;
const Sidebar = (): JSX.Element => {
	return (
		<>
			<Action />
			<Steps />
		</>
	);
};

export default Sidebar;
