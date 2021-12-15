import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { SearchIcon } from "crusher-electron-app/src/extension/assets/icons";
import { Action } from "./Action";
import { Steps } from "./Steps";
import { ActionModal } from "./Modal";
import { Conditional } from "@dyson/components/layouts/Conditional/Conditional";

const Sidebar = (): JSX.Element => {
	const [selected, setSelected] = React.useState(false);

	return (
		<>
			<ActionModal />
			<div css={headerContainer}>
				<Text CSS={headerText}>Actions</Text>
				<SearchIcon />
			</div>
			<div className="custom-scroll" css={actionScrollContainer}>
				<Conditional showIf={selected}>
					<div css={selectActionContainer}>
						<Text CSS={selectActionHeading}>Action required element selection</Text>
						<Text CSS={selectActionText}>Select an element on left side</Text>
						<Text onClick={() => setSelected(false)} CSS={selectActionCancel}>
							Cancel action
						</Text>
					</div>
				</Conditional>
				<Conditional showIf={!selected}>
					<Action setSelected={setSelected} />
				</Conditional>
			</div>

			<Steps />
		</>
	);
};

export default Sidebar;

const headerContainer = css`
	display: flex;
	padding: 18rem 26rem;
	justify-content: space-between;
`;

const headerText = css`
	font-family: Cera Pro;
	font-size: 15rem;
`;
const actionScrollContainer = css`
	padding: 26rem;
	padding-top: 0rem;
	height: 45vh;
	overflow-y: auto;
`;
const selectActionContainer = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
`;
const selectActionHeading = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 19rem;
	margin-bottom: 10rem;
`;
const selectActionText = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 15rem;
	line-height: 17rem;
	margin-bottom: 26rem;
`;
const selectActionCancel = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 16rem;
	text-decoration-line: underline;
`;
