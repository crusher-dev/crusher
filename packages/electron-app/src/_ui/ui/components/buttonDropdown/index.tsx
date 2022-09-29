import React from "react";
import { css } from "@emotion/react";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { ActionButton } from "electron-app/src/_ui/containers/components/buttons/action.button";
import { SaveButtonDownIcon } from "../../icons";

const ActionButtonDropdown = ({ options, callback }) => {
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
		background: #B341F9 !important;
	}
`;
interface IProps {
    options: Array<{ id: string, content: any }>;
    primaryOption: string;
    callback?: any;
    className?: any;
    id?: any;
    hideDropdown?: boolean;
    dropdownCss?: any;
};

const ButtonDropdown = ({ options, id, hideDropdown, primaryOption, wrapperCss, className, callback, ...props }: IProps) => {
    const [showActionDropdown, setShowActionDropdown] = React.useState(false);
    const buttonRef = React.useRef(null);

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
            css={wrapperCss}
            initialState={showActionDropdown}
            component={<ActionButtonDropdown options={dropdownOptions} callback={handleCallback} />}
            callback={setShowActionDropdown.bind(this)}
            dropdownCSS={[props.dropdownCss, dropdownCss(buttonRef.current)]}
        >
            <div ref={buttonRef} css={css`position: absolute; width: 100%; height: 100%; pointer-events: none; visibility: hidden;`}> </div>
            <ActionButton id={id} className={className} title={primaryOptionsObject.content} onClick={handleCallback.bind(this, primaryOptionsObject.id)} css={saveButtonStyle} />

            {!hideDropdown ? (
                <div className={"dropdown-icon"} css={downIconContainerCss}>
                    <SaveButtonDownIcon css={downIconCss} />
                </div>
            ) : ""}



        </Dropdown>
    );
};

const dropdownCss = (button) => css`
    left: 0rem !important;
    width: ${button ? button.clientWidth : 0}px !important;
    top: unset;
    bottom: calc(100% + 4rem);
`;
const saveButtonStyle = css`
    width: 92rem;
    height: 30rem;
    background: #8e58ff;
    border-radius: 6rem !important;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 14rem;
    line-height: 17rem;
    padding-top: 1px;
    border: none !important;
    color: #ffffff;
    :hover {
        background: #6749de;
        color: #fff;
        border: .5px solid #6749de;
    }
`;
const downIconContainerCss = css`
    background: #7146CC;
    display: flex;
    align-items: center;
    padding: 0rem 7rem;
    border-top-right-radius: 6rem;
    border-bottom-right-radius: 6rem;

    :hover {
        opacity: 0.8;
    }
`;
const downIconCss = css`
    width: 13rem;
    height: 7rem;
`;

export { ButtonDropdown };
