import { useProjectTests } from "electron-app/src/_ui/hooks/tests";
import React from "react";
import { css } from "@emotion/react";
import { GarbageIcon, LoadingIconV2, PlayIcon } from "electron-app/src/_ui/constants/old_icons";
import { BasketBallIcon, EditIcon } from "../../../../constants/icons";
import { useNavigate } from "react-router-dom";
import { continueDraftTest, goFullScreen, performReplayTestUrlAction } from "electron-app/src/ipc/perform";
import { triggerLocalBuild } from "../../../../utils/recorder";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { ContextMenuTypeEnum, ListBox } from "../../../components/selectableList";
import { EmojiPicker } from "../../../components/emojiPicker";
import Checkbox from "@dyson/components/atoms/checkbox/checkbox";
import { ResizableInput } from "../../../components/ResizableInput";
import { Conditional } from "@dyson/components/layouts";
import { useAtom } from "jotai";
import { editInputAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { setRecorderContext } from "electron-app/src/store/actions/recorder";
import { useStore } from "react-redux";
import { TRecorderVariant } from "electron-app/src/store/reducers/recorder";
import { timeSince } from "electron-app/src/_ui/utils/project";

const EditableTestName = ({ testName, testId }) => {
	const [testEditName, setTestEditName] = useAtom(editInputAtom);
	const [name, setName] = React.useState(testName);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleOnChange = (value) => {
		CloudCrusher.updateTestName(testId, value);
		setTestEditName(false as any);
		setName(value);
	};

	const editThisTestName = testEditName === testId;

	return (
		<ResizableInput
			id={testId}
			labelCss={css`
			padding-left: 10px;
			`}
			ref={inputRef}
			onChange={handleOnChange}
			value={name}
			isEditingProp={editThisTestName}
		/>
	);
};

const DraftItem = ({ test, isItemSelected, isEditingName, setIsEditingName }) => {
	const [isHover] = React.useState(false);
	const [emoji, setEmoji] = React.useState(test.emoji);
	const navigate = useNavigate();
	const store = useStore();

	const listItemActionsStyle = React.useMemo(() => listItemActionsCss(isHover), [isHover]);

	const handleEdit = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
		continueDraftTest(test.id);
	}, [test]);

	const handleEmojiSelected = React.useCallback((emoji) => {
		if (emoji) {
			setEmoji(emoji.native);
			CloudCrusher.updateTestEmoji(test.id, emoji.native);
		}
	}, []);

	const handleSelectAll = React.useCallback(() => { }, []);

	return (
		<div css={testItem(isItemSelected)} title={`Run test - ${test.testName}`}>
			<Checkbox id="checkbox" css={checkboxCss} callback={handleSelectAll} isSelectAllType={false} isSelected={isItemSelected} />

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
				isActive={isHover}
				testId={test.id}
				isEditing={isEditingName}
				setIsEditing={setIsEditingName}
				testName={test.testName}
			/>

			{test.host ? (
				<div className={"host ml-8"} css={hostCss}>
					{test.host}
				</div>
			) : null}
        
			<span className={"ml-auto"} css={timeAgoCss}>{  timeSince(new Date(test.createdAt)) } ago</span>
			<div className={"action-buttons"} css={listItemActionsStyle}>
				<div onClick={handleEdit} css={editContainerCss} title="edit this test">
					<EditIcon css={editIconCss} />
					<span css={editTextCss} className="mt-2">
						edit
					</span>
				</div>
			</div>
		</div>
	);
};

const hostCss = css`
	font-size: 12rem;
	color: #3f3f3f;
`;
const timeAgoCss = css`
	font-size: 12.5rem;
`;
const testItem = (isItemSelected) => css`
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

	color: #cd60ff;
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

	padding: 6px 6px;
	:hover {
		color: #fff;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #131314;
		border-radius: 6px;
	}
`;
const editContainerCss = css`
	display: flex;
	align-items: center;

	padding: 6px 6px;
	:hover {
		color: #fff;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #131314;
		border-radius: 6px;
	}
`;
const playIconCss = css`
	width: 10.25rem;
	height: 12rem;
`;
const listItemActionsCss = (isActive: boolean) => {
	return css`
		display: ${isActive ? "flex" : "none"};
		color: #9f87ff;
		align-items: center;
		gap: 4rem;
		margin-left: 8rem;
	`;
};

const SELECTED_TESTS_MENU = [
	{ id: "rename", label: "Rename", shortcut: <div>Enter</div> },
	{ id: "edit", label: "Edit test", shortcut: null },
	{ id: "delete", label: "Delete", shortcut: <div>Delete</div> },
];

const MULTI_SELECTED_MENU = [
	{ id: "delete-all", label: "Delete all", shortcut: <div>Delete</div> },
];

const TestList = ({ tests, deleteTest, listHeading }: any) => {
	const [, setTestEditName] = useAtom(editInputAtom);
	const navigate = useNavigate();
	const store = useStore();

	const items: any[] = React.useMemo(() => {
		if (!tests) return null;
		let isAcquired = false;
		const lockMechanism = {
			isAcquired: () => isAcquired,
			acquire: () => {
				if (!isAcquired) {
					isAcquired = true;
					return true;
				}
				return false;
			},
			release: () => {
				isAcquired = false;
				return true;
			},
		};

		return tests.map((test, index) => {
			return {
				id: test.id,
				content: (isItemSelected) => (
					<DraftItem key={test.id} index={index} isItemSelected={isItemSelected} lock={lockMechanism} test={test} deleteTest={deleteTest} />
				),
			};
		});
	}, [tests]);

	const SelectedTestActions = React.useMemo(
		() =>
			({ items, toggleSelectAll, selectedList }) => {
				const handleEdit = React.useCallback(() => {
					navigate("/recorder");
					goFullScreen();
					continueDraftTest(selectedList[0]);
				}, [items, selectedList]);

				const handleDelete = React.useCallback(() => {
					deleteTest(selectedList);
				}, [items, selectedList]);

				React.useEffect(() => {
					const keyPressListener = function (e: Event) {
						if (e.key === "Delete") {
							deleteTest(selectedList);
						} else if (e.key === "a" && e.ctrlKey) {
							toggleSelectAll(items.map((item) => item.id));
						}
					};
					window.addEventListener("keyup", keyPressListener, false);
					return () => {
						window.removeEventListener("keyup", keyPressListener, false);
					};
				}, [items, selectedList]);

				if (selectedList.length < 1) return null;
				return (
					<div
						className={"action-buttons pt-2"}
						css={[
							listItemActionsCss,
							css`
								display: flex;
								margin-left: auto;
							`,
						]}
					>
						<div onClick={handleDelete} css={editContainerCss}>
							<GarbageIcon css={editIconCss} />
							<span css={editTextCss} className="mt-2">
								delete
							</span>
						</div>
                        {selectedList.length === 1 && (
                          			<div onClick={handleEdit} css={runTestsCSS}>
                                      <PlayIcon css={playIconCss} />
                                      <span css={runTextCss}>edit</span>
                                  </div>  
                        )}
			
					</div>
				);
			},
		[deleteTest],
	);

	const handleRightCallback = React.useCallback(
		(id, selectedList) => {
			const selectedTests = tests.filter((test) => selectedList.includes(test.id));

			if (id === "delete" || id === "delete-all") {
				deleteTest(selectedList);
			} else if (id === "edit") {
				alert(selectedList[0]);
				navigate("/recorder");
				goFullScreen();
				continueDraftTest(selectedList[0]);
			} else if (id === "rename") {
				setTestEditName(selectedList[0]);
			}
		},
		[tests],
	);

	const contextMenu = {
		[ContextMenuTypeEnum.SINGLE]: { callback: handleRightCallback, menuItems: SELECTED_TESTS_MENU },
		[ContextMenuTypeEnum.MULTI]: { callback: handleRightCallback, menuItems: MULTI_SELECTED_MENU },
	};
	return <ListBox listHeading={listHeading} contextMenu={contextMenu} selectedHeaderActions={SelectedTestActions} items={items} />;
};


const DraftsList = () => {
    const { draftTests, deleteDraftTests } = useProjectTests();

    return (
        <TestList listHeading={<></>} deleteTest={deleteDraftTests} tests={draftTests} />
    ); 
};


export { DraftsList }