import React, { useContext, useMemo, useState } from "react";
import { css } from "@emotion/react";
import Checkbox from "../../atoms/checkbox/checkbox";
import { EmojiPicker } from "../../molecules/EmojiPicker";
import { BasketBallIcon } from "../svg/emoji";
import { Conditional } from "../../layouts";
import { EditIcon, LoadingIconV2, PlayIcon } from "../svg/list";
import { EditableInput } from "../EditableInput";
import { TestListContext } from "../utils/basic";

const EditableTestName = ({ testName, testId }) => {
	const [testEditName, setTestEditName] = useState(null);
	const [name, setName] = React.useState(testName);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const { type } = useContext(TestListContext)


	const handleOnChange = (value) => {
		// CloudCrusher.updateTestName(testId, value);
		setTestEditName(false as any);
		setName(value);
	};

	const editThisTestName = testEditName === testId;


	return (
		<EditableInput
			id={testId}
			labelCss={[InputCSS,
				type === "web" && webInput
			]}
			ref={inputRef}
			onChange={handleOnChange}
			value={name}
			isEditingProp={editThisTestName}
		/>
	);
};

const InputCSS = css`
				padding-left: 12px;
				font-size:
			`

const webInput = css`
	font-size: 14rem;
`


const TestListItem = ({ id, isItemSelected, onEdit, onUpdateEmoji, onDelete, onRename, test, deleteTestCallback }) => {
	const { runTest } = useContext(TestListContext);
	const [emoji, setEmoji] = React.useState(test.emoji);
	const handleEmojiSelected = (emoji) => {
		setEmoji(emoji.native);
		onUpdateEmoji && onUpdateEmoji(id, emoji.native);
	};

	const handleEdit = () => { onEdit && onEdit([id]); };
	const handleRunTest = () => {
		runTest([id]);
	 };


	return (
		<div css={testItem(isItemSelected)} title={`Run test - ${test.testName}`} id="test-item">
			<Checkbox id="checkbox" css={checkboxCss} isSelectAllType={false} isSelected={isItemSelected} />

			<EmojiPicker onEmojiSelected={handleEmojiSelected}>
				<div className={"emoji-block"} css={emojiBlock}>
					{emoji ? (
						<span css={emojiCSS}>{emoji}</span>
					) : (
						<BasketBallIcon
							css={css`
								width: 18px;
								height: 18px;
								:hover {
									opacity: 0.8;
								}
							`}
						/>
					)}
				</div>
			</EmojiPicker>

			<EditableTestName
				css={testNameInputCss}
				testId={test.id}
				testName={test.testName}
			/>

			<Conditional showIf={!test.firstRunCompleted}>
				<div css={loadingContainerCss} title={"verifying..."}>
					<span className="pt-1 ml-10">verifying</span>
					<LoadingIconV2 css={loadingIconCss} />
				</div>
			</Conditional>

			<div className={"action-buttons"} css={listItemActionsCss}>
				<div onClick={handleEdit} css={editContainerCss} title="edit this test">
					<EditIcon css={editIconCss} />
					<span css={editTextCss} className="mt-2">
						edit
					</span>
				</div>
				<div onClick={handleRunTest} css={runTestsCSS} title="run this test">
					<PlayIcon css={playIconCss} />
					<span css={runTextCss}>run</span>
				</div>
			</div>
		</div>
	);
}


const listItemActionsCss = css`
		display: none;
		color: #9f87ff;
		margin-left: auto;
		align-items: center;
		gap: 4rem;
`;
const testItem = (isItemSelected: boolean) => css`
	#checkbox {
		visibility: ${isItemSelected ? "visible" : "hidden"};
	}
	:hover {
		#checkbox {
			visibility: visible;
		}
	}
	height: 40px;
	padding: 6px 18px;
	padding-right: 16px;
	display: flex;
	flex: 1;
	align-items: center;
	:hover {
		& > .action-buttons {
			display: flex !important;
		}
	}
`;

const loadingContainerCss = css`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 11px;
`;

const checkboxCss = css`
	.checkbox-container {
		border-radius: 6rem;
	}
	margin-right: 14px;
`;
const testNameInputCss = css`
	margin-left: 8px;
`;
const emojiBlock = css`
	display: flex;
	min-height: 22px;
	min-width: 22px;
	align-items: center;
	justify-content: center;

	padding-top: 1rem;
	border-radius: 6px;
	:hover {
		background: rgba(217, 217, 217, 0.12);
		cursor: pointer;
		path {
			stroke: #fff;
		}
	}
`;
const emojiCSS = css`
	font-family: "EmojiMart";
	display: block;
	font-size: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 2px;
	padding-left: 2px;
	line-height: 13px;
`;

const runTextCss = css`
	font-weight: 500;
	font-size: 12rem;

	letter-spacing: 0.03em;
	position: relative;
	top: 1rem;

	color: #ba27ff;
`;
const editTextCss = css`
	font-weight: 500;
	font-size: 12rem;
	letter-spacing: 0.03em;
	margin-left: 4px;
	color: #bdbdbd;
`;

const editIconCss = css`
	width: 13rem;
	height: 13rem;
	:hover {
		opacity: 0.8;
	}
`;
const runTestsCSS = css`
	display: flex;
	align-items: center;
	gap: 4rem;
	position: relative;

	font-size: 13rem;

	padding: 6rem;
	border-radius: 6rem;
	:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.10);
	}
`;
const editContainerCss = css`
	display: flex;
	align-items: center;

	padding: 6rem;
	border-radius: 6rem;
	:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.10);
	}
`;
const playIconCss = css`
	width: 10.25rem;
	height: 12rem;
`;
const loadingIconCss = css`
	width: 20px;
	height: 20px;
	margin-left: -5x;
`;

export { TestListItem };