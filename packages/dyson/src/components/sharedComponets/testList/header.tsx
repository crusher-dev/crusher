import { css } from "@emotion/react";
import React from "react";
import { GarbageIcon, PlayIcon } from "../svg/list";

const SelectedTestActions = ({ items, onEdit, onDelete, onRename, toggleSelectAll, selectedList }) => {
    const handleRun = React.useCallback(() => {
        // triggerLocalBuild(selectedList);
    }, [items, selectedList]);

    const handleDelete = React.useCallback(() => {
        onDelete(selectedList);
    }, [items, selectedList]);

    React.useEffect(() => {
        const keyPressListener = function (e: Event) {
            if (e.key === "Delete") {
                // deleteTest(selectedList);
            } else if (e.key === "a" && e.ctrlKey) {
                // toggleSelectAll(items.map((item) => item.id));
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
            ]}
        >
            <div onClick={handleDelete} css={deleteContainerCss}>
                <GarbageIcon css={deleteIconCss} />
                <span css={deleteTextCss} className="mt-2">
                    delete
                </span>
            </div>
            <div onClick={handleRun} css={runTestsCSS}>
                <PlayIcon css={playIconCss} />
                <span css={runTextCss}>run</span>
            </div>
        </div>
    );
};

const listItemActionsCss = css`
		display: flex;
		color: #9f87ff;
		margin-left: auto;
		align-items: center;
		gap: 4rem;
`;
const playIconCss = css`
	width: 10.25rem;
	height: 12rem;
`;
const runTextCss = css`
	font-weight: 500;
	font-size: 12rem;

	letter-spacing: 0.03em;
	position: relative;
	top: 1rem;

	color: #b061ff;
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
const deleteTextCss = css`
	font-weight: 500;
	font-size: 12rem;
	letter-spacing: 0.03em;
	margin-left: 4px;
	color: #bdbdbd;
`;
const deleteIconCss = css`
	width: 13rem;
	height: 13rem;
	:hover {
		opacity: 0.8;
	}
`;
const deleteContainerCss = css`
	display: flex;
	align-items: center;

	padding: 6px 6px;
	:hover {
		color: #fff;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #131314;
		border-radius: 6px;
	}
`;
export  { SelectedTestActions };