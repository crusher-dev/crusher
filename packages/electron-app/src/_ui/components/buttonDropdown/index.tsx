import React from "react";
import { css } from "@emotion/react";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { ActionButton } from "electron-app/src/ui/components/buttons/action.button";
import { DownIcon } from "electron-app/src/ui/icons";
import { performRunTests } from "electron-app/src/ui/commands/perform";

const ActionButtonDropdown = ({options, callback}) => {
    const handleClick = React.useCallback((optionId: string) => {
        callback(optionId);
    }, [callback]);
    
    const menuItems = React.useMemo(() => {
        return options.map((option) => {
             return (
                <div css={menuItemCss} onClick={handleClick.bind(this, option.id)}>
				    {option.content}
			    </div>
             );
        });
    }, [options]);

	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				{menuItems}
			</div>
		</div>
	);
}

const menuItemCss = css`
    padding: 6rem 13rem;
	:hover {
		background: #687ef2 !important;
	}
`;
interface IProps {
    options: Array<{id: string, content: any}>;
    primaryOption: string;
    callback?: any;
};

const ButtonDropdown = ({options, primaryOption, callback}: IProps) => {
    const [showActionDropdown, setShowActionDropdown] = React.useState(false);

    const handleCallback = React.useCallback((id: string) => {
        callback(id);
        setShowActionDropdown(false);
    }, [callback]);

    const primaryOptionsObject = React.useMemo(() => {
        return options.find((option) => option.id === primaryOption);
    }, [options, primaryOption]);
    const dropdownOptions = React.useMemo(() => {
        return options.filter((option) => option.id !== primaryOption);
    }, [options, primaryOption]);

    return (
    <Dropdown
        initialState={showActionDropdown}
        component={<ActionButtonDropdown options={dropdownOptions} callback={handleCallback} />}
        callback={setShowActionDropdown.bind(this)}
        dropdownCSS={dropdownCss}
    >
		<ActionButton title={primaryOptionsObject.content} onClick={handleCallback.bind(this, primaryOptionsObject.id)} css={saveButtonStyle} />

        <div css={downIconContainerCss}>
            <DownIcon fill={"#fff"} css={downIconCss} />
        </div>
    </Dropdown>
    );
};

const dropdownCss = css`
    left: 0rem;
    width: 150rem;
    top: unset;
    bottom: calc(100% + 4rem);
`;
const saveButtonStyle = css`
    width: 92rem;
    height: 30rem;
    background: linear-gradient(0deg, #9462ff, #9462ff);
    border-radius: 6rem;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 14rem;
    line-height: 17rem;
    border: 0.5px solid transparent;
    border-right-width: 0rem;
    border-top-right-radius: 0rem;
    border-bottom-right-radius: 0rem;
    color: #ffffff;
    :hover {
        border: 0.5px solid #8860de;
        border-right-width: 0rem;
        border-top-right-radius: 0rem;
        border-bottom-right-radius: 0rem;
    }
`;
const downIconContainerCss = css`
    background: #9461ff;
    display: flex;
    align-items: center;
    padding: 0rem 9rem;
    border-top-right-radius: 6rem;
    border-bottom-right-radius: 6rem;
    border-left-color: #00000036;
    border-left-width: 2.5rem;
    border-left-style: solid;
    :hover {
        opacity: 0.8;
    }
`;
const downIconCss = css`
    width: 9rem;
`;

export { ButtonDropdown };
