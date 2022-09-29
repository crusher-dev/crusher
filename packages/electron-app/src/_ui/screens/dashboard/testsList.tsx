import React from "react";
import { css } from "@emotion/react";
import { DeleteIcon, GarbageIcon, LoadingIconV2, PlayIcon } from "electron-app/src/ui/icons";
import { BasketBallIcon, EditIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { goFullScreen, performReplayTestUrlAction } from "electron-app/src/ui/commands/perform";
import { triggerLocalBuild } from "../../utils/recorder";
import { KeyboardInputEvent, shell } from "electron";
import { resolveToFrontend } from "electron-app/src/utils/url";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { ContextMenuTypeEnum, ListBox } from "../../components/selectableList";
import { useStore } from "react-redux";
import { EmojiPicker } from "../../components/emojiPicker";
import Checkbox from "@dyson/components/atoms/checkbox/checkbox";
import { useBuildNotifications } from "../../hooks/tests";
import { ResizableInput } from "../../components/ResizableInput";
import { Conditional } from "@dyson/components/layouts";

const TestListNameInput = ({ testName, testId, isActive, isEditing, setIsEditing, className }) => {
    const [name, setName] = React.useState(testName);
    const inputRef = React.useRef<HTMLInputElement>(null);



    const handleOnChange = React.useCallback((event) => {
        setName(event.target.value);
    }, []);

    const handleSubmit = React.useCallback(() => {
        CloudCrusher.updateTestName(testId, inputRef.current.value);
    }, [name]);

    const handleKeyDown = React.useCallback((event) => {
        if (event.key === "Enter") {
            setIsEditing(false);
            handleSubmit();
        }
    }, []);

    return (
        <ResizableInput
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
            value={name}
            isEditingProp={isEditing}
            onEditModeChange={setIsEditing.bind(this)}
        // disabled={!isEditing}
        />
    );
};

const TestListItem = ({ test, isItemSelected, isEditingName, setIsEditingName, index, deleteTest, lock }) => {

    const [isHover, setIsHover] = React.useState(false);
    const [emoji, setEmoji] = React.useState(test.emoji);
    const { addNotification } = useBuildNotifications();
    const navigate = useNavigate();

    const listItemActionsStyle = React.useMemo(() => listItemActionsCss(isHover), [isHover]);

    const handleEdit = React.useCallback(() => {
        navigate("/recorder");
        goFullScreen();
        performReplayTestUrlAction(test.id);
    }, [test]);

    const handleRunTest = React.useCallback(() => {
        triggerLocalBuild([test.id]);
    }, [test]);

    const handleEmojiSelected = React.useCallback((emoji) => {
        if (emoji) {
            setEmoji(emoji.native);
            CloudCrusher.updateTestEmoji(test.id, emoji.native);
        }
    }, []);

    const handleSelectAll = React.useCallback((shouldSelect) => {

    }, []);

    return (
        <div css={testItem(isItemSelected)} title={`Run test - ${test.testName}`}>
            <Checkbox id="checkbox" css={checkboxCss} callback={handleSelectAll} isSelectAllType={false} isSelected={isItemSelected} />

            <EmojiPicker onEmojiSelected={handleEmojiSelected}>
                <div className={"emoji-block"} css={emojiBlock}>
                    {emoji ? (
                        <span css={emojiCSS}>{emoji}</span>
                    ) : (<BasketBallIcon css={css`width: 18px; height: 18px; :hover { opacity: 0.8; }`} />)}
                </div>
            </EmojiPicker>


            <TestListNameInput css={testNameInputCss} isActive={isHover} testId={test.id} isEditing={isEditingName} setIsEditing={setIsEditingName} testName={test.testName} />
            <Conditional showIf={!test.firstRunCompleted}>
                <div css={loadingContainerCss} title={"verifying..."}>
                    <span className="pt-1">verifying</span>
                    <LoadingIconV2 css={loadingIconCss} />

                </div>
            </Conditional>

            <div className={"action-buttons"} css={listItemActionsStyle}>
                <div onClick={handleEdit} css={editContainerCss} title="edit this test">
                    <EditIcon css={editIconCss} />
                    <span css={editTextCss} className="mt-2">edit</span>
                </div>
                <div onClick={handleRunTest} css={runTestsCSS} title="run this test">
                    <PlayIcon css={playIconCss} />
                    <span css={runTextCss}>run</span>
                </div>
            </div>
        </div>
    )
};

const testItem = (isItemSelected) => css`
#checkbox{
    visibility: ${isItemSelected ? 'visible' : 'hidden'};
}
:hover{
    #checkbox{
        visibility: visible;
    }
}
height: 40px;
padding: 6px 18px; padding-right: 16px; display: flex; flex: 1; align-items: center; :hover { & > .action-buttons { display: flex !important; } }`

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
justify-content:center;


border-radius: 6px;
:hover{
	background: rgba(217, 217, 217, 0.12);
	cursor: pointer;
	path{
		stroke: #fff;
	}
}
`
const emojiCSS = css`
font-family: 'EmojiMart';
    display: block;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
	padding-left: 2px;
    line-height: 13px;
`
const contextMenuDropdownCss = (pos) => {
    return css`
        position: absolute;
        left: ${pos.x}px;
        top: ${pos.y}px;
    `;
};
const contextMenuDropdownBoxCss = css`
    position: absolute;
    width: 130rem;
    left: 0rem;
    top: 0rem;
`;
const runTextCss = css`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 12rem;

    letter-spacing: 0.03em;
    position: relative;
    top: 1rem;

    color: #b061ff;
`;
const editTextCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 12rem;
    letter-spacing: 0.03em;
    margin-left: 4px;
    color: #BDBDBD;
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
        background: linear-gradient(
            0deg
            , rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)),#131314;
                border-radius: 6px;
    }
`;
const editContainerCss = css`
    display: flex;
    align-items: center;

    padding: 6px 6px;
    :hover {
        color: #fff;
        background: linear-gradient(
            0deg
            , rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)),#131314;
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
            margin-left: auto;
            align-items: center;
            gap: 4rem;
     `;
}
const loadingIconCss = css`
    width: 18px;
    height: 18px;
    margin-left: -5x;
`;
const itemCss = (isActive: boolean) => {
    return css`
        position: relative;
        background: ${isActive ? "linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)), rgba(54, 54, 54, 0.2)" : "none"};
        color: ${isActive ? "#fff" : "#A6A6A6"};
        border-bottom: 1px solid rgba(153, 153, 153, 0.09);
    `;
}

const SELECTED_TESTS_MENU = [
    { id: "edit", label: "Edit", shortcut: null },
    { id: "rename", label: "Rename", shortcut: (<div>Enter</div>) },
    { id: "delete", label: 'Delete', shortcut: <div>Delete</div> }
];

const MULTI_SELECTED_MENU = [
    { id: "run", label: "Run all", shortcut: null },
    { id: "delete-all", label: 'Delete all', shortcut: <div>Delete</div> }
];

const TestList = ({ tests, deleteTest }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isRenaming, setIsRename] = React.useState(null);
    const navigate = useNavigate();

    const setRename = React.useCallback((testId, value) => {
        if (value === null || !value) {
            return setIsRename(null);
        }
        setIsRename(testId);
    }, []);
    const items: Array<any> = React.useMemo(() => {
        if (!tests) return null;
        let isAcquired = false;
        const lockMechanism = { isAcquired: () => isAcquired, acquire: () => { if (!isAcquired) { isAcquired = true; return true; } return false }, release: () => { isAcquired = false; return true; } };

        return tests.map((test, index) => {
            return {
                id: test.id,
                content: (isItemSelected) => (
                    <TestListItem
                        key={test.id}
                        index={index}
                        isEditingName={isRenaming === test.id}
                        setIsEditingName={setRename.bind(this, test.id)}
                        isItemSelected={isItemSelected}
                        lock={lockMechanism}
                        test={test}
                        deleteTest={deleteTest}
                    />
                )
            };
        });
    }, [isRenaming, tests]);

    const SelectedTestActions = React.useMemo(() => ({ items, toggleSelectAll, selectedList }) => {
        const store = useStore();

        const handleRun = React.useCallback(() => {
            triggerLocalBuild(selectedList);
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
            }
        }, [items, selectedList]);

        if (selectedList.length < 1) return null;
        return (
            <div className={"action-buttons pt-2"} css={[listItemActionsCss, css`display: flex`]}>
                <div onClick={handleDelete} css={editContainerCss}>
                    <GarbageIcon css={editIconCss} />
                    <span css={editTextCss} className="mt-2">delete</span>
                </div>
                <div onClick={handleRun} css={runTestsCSS}>
                    <PlayIcon css={playIconCss} />
                    <span css={runTextCss}>run</span>
                </div>
            </div>
        )
    }, [deleteTest]);

    const handleRightCallback = React.useCallback((id, selectedList) => {
        const selectedTests = tests.filter((test) => selectedList.includes(test.id));

        if (id === "delete" || id === "delete-all") {
            deleteTest(selectedList);
        } else if (id === "run" || id === "run-all") {
            triggerLocalBuild(selectedList);
        } else if (id === "edit") {
            navigate("/recorder");
            goFullScreen();
            performReplayTestUrlAction(selectedList[0], false, selectedTests);
        } else if (id === "rename") {
            setIsRename(selectedList[0]);
        }
    }, [tests]);


    return (
        <ListBox contextMenu={{ [ContextMenuTypeEnum.SINGLE]: { callback: handleRightCallback, menuItems: SELECTED_TESTS_MENU }, [ContextMenuTypeEnum.MULTI]: { callback: handleRightCallback, menuItems: MULTI_SELECTED_MENU } }} selectedHeaderActions={SelectedTestActions} items={items} />
    );
};

const testsCountCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.67);
    padding: 0px 46px;
    border-bottom: 1px solid rgba(153, 153, 153, 0.09);
    padding-bottom: 6rem;
`;


export { TestList };