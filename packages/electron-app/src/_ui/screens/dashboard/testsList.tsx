import React from "react";
import { css } from "@emotion/react";
import { EditIcon, LoadingIconV2, PlayIcon } from "electron-app/src/ui/icons";
import { min } from "lodash";
import { useNavigate } from "react-router-dom";
import { goFullScreen, performReplayTestUrlAction } from "electron-app/src/ui/commands/perform";
import { triggerLocalBuild } from "../../utils/recorder";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { shell } from "electron";
import { resolveToFrontend } from "electron-app/src/utils/url";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { CloudCrusher } from "electron-app/src/lib/cloud";

const TestListNameInput = ({ testName, testId, isEditing, setIsEditing }) => {
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
        if(event.key === "Enter") {
            setIsEditing(false);
            handleSubmit();
        }
    }, []);

    const handleOutsideClick = React.useCallback(() => {
        setIsEditing(false);
        handleSubmit();
    }, []);

    const testInputStyle = React.useMemo(() => testInputCss(isEditing, name), [isEditing, name]);

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
const testInputCss = (isEditing, name) => {
    return css`
        background: transparent;
        padding: 5px 8px;
        padding-left: 0px;
        border: ${isEditing ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent"};
        border-radius: ${isEditing ? "4px" : "0px"};
        width: ${isEditing ? Math.max(7.5*name.length, 120) + "rem" : "100%"};

        font-family: Gilroy;
        font-style: normal;
        font-weight: 500;
        font-size: 13.25px;
        letter-spacing: 0.05em;
        color: #FFFFFF;

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
const TestListItem = ({ test, deleteTest, lock }) => {
    const [isActive, setIsActive] = React.useState(false);
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [showContextMenu, setShowContextMenu] = React.useState({ shouldShow: false, pos: null });
    const containerRef = React.useRef<HTMLLIElement>();

    const itemStyle = React.useMemo(() => itemCss(isActive), [isActive]);
    const navigate = useNavigate();

    const handleRightClick = React.useCallback((event) => {
        lock.acquire();
		const pos = { x: event.clientX, y: event.clientY };
		const constainerRects = containerRef.current.getBoundingClientRect();
        
        const dropdownPos = { x: pos.x - constainerRects.left, y: pos.y - constainerRects.top };
		setShowContextMenu({ shouldShow: true, pos: dropdownPos });
    }, []);

    const handleMouseEnter = React.useCallback(()=> {
        if(!lock.isAcquired()) {
            setIsActive(true);
        }
    }, []);

    const handleMouseLeave = React.useCallback(() => {
        if(!lock.isAcquired()) {
            setIsActive(false);
        }
    }, []);

    const listItemActionsStyle = React.useMemo(() => listItemActionsCss(isActive), [isActive]);

    const handleEdit = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
		performReplayTestUrlAction(test.id);
    }, [test]);

    const handleRunTest = React.useCallback(() => {
        triggerLocalBuild([test.id]);
    }, [test]);

    const closeContextMenu = React.useCallback((shouldShowDropdown) => {
        if(!shouldShowDropdown) {
            setIsActive(false);
            setShowContextMenu({ shouldShow: false, pos: null});
            lock.release();
        }
    }, []);

    const handleRenameTest = React.useCallback(() => {
        setIsEditingName(true);
    }, []);

    const handleDeleteTest = React.useCallback(() => {
        deleteTest(test.id);
    }, [deleteTest, test]);

    const contextMenu = React.useMemo(() => {
        const shouldShowContextMenu = showContextMenu.shouldShow && showContextMenu.pos;
        if(!shouldShowContextMenu) return null;

        const contextMenuDropdownStyle = contextMenuDropdownCss(showContextMenu.pos);
        return (
            <Dropdown
					initialState={true}
					css={contextMenuDropdownStyle}
					component={<ContextMenuItemDropdown deleteTest={handleDeleteTest} renameTest={handleRenameTest} closeDropdown={closeContextMenu.bind(this, false)} test={test}/>}
					callback={closeContextMenu.bind(this)}
					dropdownCSS={contextMenuDropdownBoxCss}
				>
					{" "}
				</Dropdown>
        );
    }, [showContextMenu]);

    return (
        <li ref={containerRef} css={itemStyle} onContextMenu={handleRightClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <TestListNameInput testId={test.id} isEditing={isEditingName} setIsEditing={setIsEditingName} testName={test.testName}/>
            {!test.firstRunCompleted ? (
				<LoadingIconV2 css={loadingIconCss}/>
			) : (
				""
			)}

            {contextMenu}

            <div className={"action-buttons"} css={listItemActionsStyle}>
					<EditIcon css={editIconCss} onClick={handleEdit}/>
					<div onClick={handleRunTest} css={playIconContainerCss}>
						<PlayIcon css={playIconCss}/>
						<span css={runTextCss}>Run</span>
					</div>
			</div>
        </li>
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
	:hover {
		opacity: 0.8;
    }
`;
const playIconCss = css`
    width: 10rem;
	height: 12rem;
`;
const listItemActionsCss = (isActive: boolean) => {
    return css`
            display: ${isActive ? "flex" : "none"};
            color: #9f87ff;
            margin-left: auto;
            align-items: center;
            gap: 18rem;
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
        background: ${isActive ? "rgba(217, 217, 217, 0.04)": "none"};
        color: ${isActive ? "#9f87ff" : "auto"};
    `;
}

const TestList = ({tests, deleteTest}) => {
    const items = React.useMemo(() => {
        if(!tests) return null;
        let isAcquired = false;
        const lockMechanism = { isAcquired: () => isAcquired, acquire: () => { if(!isAcquired) { isAcquired = true; return true; } return false }, release: () =>  { isAcquired = false; return true;} };

        return tests.map((test, index) => {
            return (
                <TestListItem
                    key={test.id}
                    lock={lockMechanism}
                    test={test}
                    deleteTest={deleteTest}
                />
            )
        });
    }, [tests]);

    return (
        <div>
            <div css={testsCountCss}>{items.length} tests</div>
            <ul css={listCss}>
                { items }
            </ul>
        </div>
	);
};

const testsCountCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.67);
    padding: 0px 46px;
`;

const listCss = css`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #ffffff;
    height: 38rem;
    margin-top: 13rem;

    li {
        padding: 6px 46px;
        padding-right: 28px;
        position: relative;
        display: flex;
        align-items: center;
    }
`;

export { TestList };