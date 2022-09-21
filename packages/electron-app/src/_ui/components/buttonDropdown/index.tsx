import React from "react";
import { css } from "@emotion/react";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { ActionButton } from "electron-app/src/ui/components/buttons/action.button";
import { DownIcon } from "electron-app/src/ui/icons";

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
    className?: any;
    id?: any;
    hideDropdown?: boolean;
    dropdownCss?: any;
};

const ButtonDropdown = ({options, id, hideDropdown, primaryOption, className, callback, ...props}: IProps) => {
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
        dropdownCSS={[props.dropdownCss, dropdownCss]}
    >
		<ActionButton id={id} className={className} title={primaryOptionsObject.content} onClick={handleCallback.bind(this, primaryOptionsObject.id)} css={saveButtonStyle} />

        {!hideDropdown ? (
            <div className={"dropdown-icon"} css={downIconContainerCss}>
            <DownIcon fill={"#fff"} css={downIconCss} />
            </div>
        ): ""}
     
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
    background: #8e58ff;
    border-radius: 6rem !important;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 14rem;
    line-height: 17rem;
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
    padding: 0rem 9rem;
    border-top-right-radius: 6rem;
    border-bottom-right-radius: 6rem;

    :hover {
        opacity: 0.8;
    }
`;
const downIconCss = css`
    width: 9rem;
`;

export { ButtonDropdown };
