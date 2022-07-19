import React from "react";
import { css } from "@emotion/react";

const TestListNameInput = ({ testName }) => {
    const [name, setName] = React.useState(testName);
    const [isEditing, setIsEditing] = React.useState(false);
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

    const handleKeyDown = React.useCallback((event) => {
        if(event.key === "Enter") {
            setIsEditing(false);
        }
    }, []);

    const testInputStyle = React.useMemo(() => testInputCss(isEditing), [isEditing]);

    return (
    <span onDoubleClick={handleDoubleClick}>
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
    );
};

const testInputCss = (isEditing) => {
    return css`
        background: transparent;
        padding: 6px 8px;
        border: ${isEditing ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent"};
        border-radius: ${isEditing ? "4px" : "0px"};
    `;
};

const TestListItem = ({ test, lock }) => {
    const [isActive, setIsActive] = React.useState(false);
    const itemStyle = React.useMemo(() => itemCss(isActive), [isActive]);

    const handleMouseEnter = React.useCallback(()=> {
        if(lock.acquire()) {
            setIsActive(true);
        }
    }, []);
    const handleMouseLeave = React.useCallback(() => {
        lock.release();
        setIsActive(false);
    }, []);

    return (
        <li css={itemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <TestListNameInput testName={test.testName}/>
        </li>
    )
};
const itemCss = (isActive: boolean) => {
    return css`
        position: relative;
        background: ${isActive ? "rgba(217, 217, 217, 0.04)": "none"};
        color: ${isActive ? "#9f87ff" : "auto"};
    `;
}

const TestList = ({tests}) => {
    const [showTestActionMenu, setShowTestActionMenu] = React.useState(false);

    const deleteTest = React.useCallback(() => {

    }, []);
    const items = React.useMemo(() => {
        if(!tests) return null;
        let isAcquired = false;
        const lockMechanism = { isAcquired: false, acquire: () => { if(!isAcquired) { isAcquired = true; return true; } return false }, release: () =>  { isAcquired = false; return true;} };

        return tests.map((test, index) => {
            return (
                <TestListItem
                    key={test.id}
                    lock={lockMechanism}
                    test={test}
                />
            )
        });
    }, [tests]);

    return (
		<ul css={listCss}>
			{ items }
		</ul>
	);
};

const listCss = css`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #ffffff;
    height: 38rem;

    li {
        padding: 6px 24px;
        padding-right: 28px;
        position: relative;
        display: flex;
        align-items: center;
    }
`;

export { TestList };