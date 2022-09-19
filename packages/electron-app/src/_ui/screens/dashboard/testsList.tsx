import React from "react";
import { css } from "@emotion/react";
import { LoadingIconV2, PlayIcon } from "electron-app/src/ui/icons";
import { EditIcon } from "../../icons";
import { min } from "lodash";
import { useNavigate } from "react-router-dom";
import { goFullScreen, performReplayTestUrlAction } from "electron-app/src/ui/commands/perform";
import { triggerLocalBuild } from "../../utils/recorder";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { shell } from "electron";
import { resolveToFrontend } from "electron-app/src/utils/url";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { ListBox } from "../../components/selectableList";
import { useSelectableList } from "../../hooks/list";
const TestListNameInput = ({ testName, testId, isActive, isEditing, setIsEditing }) => {
    const [name, setName] = React.useState(testName);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleDoubleClick = React.useCallback(() => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        });
    }, []);

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

    const handleOutsideClick = React.useCallback(() => {
        setIsEditing(false);
        handleSubmit();
    }, []);

    const testInputStyle = React.useMemo(() => testInputCss(isActive, isEditing, name), [isEditing, name, isActive]);

    return (
        <OnOutsideClick disable={!isEditing} onOutsideClick={handleOutsideClick}>
            <span css={testInputContainerCss} onDoubleClick={handleDoubleClick}>
                <input
                    size={testName.length}
                    ref={inputRef}
                    css={testInputStyle}
                    onKeyDown={handleKeyDown}
                    onChange={handleOnChange}
                    value={name}
                    disabled={!isEditing}
                />
            </span>
        </OnOutsideClick>

    );
};

const testInputContainerCss = css``;
const testInputCss = (isActive, isEditing, name) => {
    return css`
        background: transparent;
        padding: 5px 8px;
        padding-left: 0px;
        border: ${isEditing ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent"};
        border-radius: ${isEditing ? "4px" : "0px"};
        width: ${isEditing ? Math.max(7.5 * name.length, 120) + "rem" : "100%"};

        font-family: Gilroy;
        font-style: normal;
        font-weight: 500;
        font-size: 13.25px;
        letter-spacing: 0.05em;
        color: auto;

    `;
};

function ContextMenuItemDropdown({ test, closeDropdown, renameTest, deleteTest, ...props }) {
    const MenuItem = ({ label, onClick, ...props }) => {
        return (
            <div css={contextMenuItemCss} onClick={onClick}>
                {label}
            </div>
        );
    };

    const handleViewReport = React.useCallback(() => {
        shell.openExternal(resolveToFrontend(`/app/build/${test.draftBuildId}`));
        closeDropdown();
    }, [test]);

    const handleRename = React.useCallback(() => {
        renameTest();
        closeDropdown();
    }, [test]);
    const handleDelete = React.useCallback(() => {
        deleteTest();
        closeDropdown();
    }, []);

    return (
        <div
            className={"flex flex-col justify-between h-full"}
            css={contextMenuDropdownListContainerCss}
        >
            <div>
                <MenuItem onClick={handleViewReport} label={"View Report"} className={"close-on-click"} />
                <MenuItem onClick={handleRename} label={"Rename"} className={"close-on-click"} />
                <MenuItem onClick={handleDelete} label={"Delete"} className={"close-on-click"} />
            </div>
        </div>
    );
}

const contextMenuDropdownListContainerCss = css`
    font-size: 13rem;
    color: #fff;
`;
const contextMenuItemCss = css`
    padding: 6rem 13rem;
    :hover {
        background: #687ef2 !important;
    }
`;
const TestListItem = ({ test, isItemSelected, index, deleteTest, lock }) => {

    const [isHover, setIsHover] = React.useState(false);
    const [isEditingName, setIsEditingName] = React.useState(false);

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

    return (
        <div css={css`display: flex; flex: 1; align-items: center; :hover { & > .action-buttons { display: flex !important; } }`}>
            <TestListNameInput isActive={isHover} testId={test.id} isEditing={isEditingName} setIsEditing={setIsEditingName} testName={test.testName} />
            {!test.firstRunCompleted ? (
                <LoadingIconV2 css={loadingIconCss} />
            ) : (
                ""
            )}


            <div className={"action-buttons"} css={listItemActionsStyle}>
                <div onClick={handleEdit} css={editContainerCss}>
                    <EditIcon css={editIconCss} />
                    <span css={editTextCss}>edit</span>
                </div>
                <div onClick={handleRunTest} css={playIconContainerCss}>
                    <PlayIcon css={playIconCss} />
                    <span css={runTextCss}>run</span>
                </div>
            </div>
        </div>
    )
};

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
    font-weight: 600;
    font-size: 13rem;

    letter-spacing: 0.03em;
    position: relative;
    top: 2rem;

    color: #b061ff;
`;
const editTextCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.03em;
    margin-left: 6px;
    color: #BDBDBD;
`;

const editIconCss = css`
    width: 13rem;
    height: 13rem;
    :hover {
        opacity: 0.8;
    }
`;
const playIconContainerCss = css`
    display: flex;
    align-items: center;
	gap: 6rem;
    position: relative;
    top: -2px;
	:hover {
		opacity: 0.8;
    }
`;
const editContainerCss = css`
    display: flex;
    align-items: center;
    :hover {
        opacity: 0.8;
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
            gap: 16rem;
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

const TestList = ({ tests, deleteTest }) => {
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
                        isItemSelected={isItemSelected}
                        lock={lockMechanism}
                        test={test}
                        deleteTest={deleteTest}
                    />
                )
            };
        });
    }, [tests]);


    const SelectedTestActions = React.useMemo(() => ({ items, selectedList }) => {
        const handleRun = React.useCallback(() => {
            triggerLocalBuild(selectedList);
        }, [items, selectedList]);

        const handleDelete = React.useCallback(() => {
            for (let testId of selectedList)
                deleteTest(testId);
        }, [items, selectedList]);

        return (
            <div className={"action-buttons"} css={[listItemActionsCss, css`display: flex`]}>
                <div onClick={handleDelete} css={editContainerCss}>
                    <EditIcon css={editIconCss} />
                    <span css={editTextCss}>delete</span>
                </div>
                <div onClick={handleRun} css={playIconContainerCss}>
                    <PlayIcon css={playIconCss} />
                    <span css={runTextCss}>run</span>
                </div>
            </div>
        )
    }, [deleteTest]);

    return (
        <ListBox selectedHeaderActions={SelectedTestActions} items={items} />
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

const listCss = css`
    height: 100%;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #ffffff;
    height: 38rem;

    li {
        padding: 6px 46px;
        padding-right: 40px;
        position: relative;
        display: flex;
        align-items: center;
    }
`;

export { TestList };