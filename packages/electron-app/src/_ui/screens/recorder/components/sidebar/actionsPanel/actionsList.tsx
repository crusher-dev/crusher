import React from "react";
import { css } from "@emotion/react";
import { ActionHeadingIcon, PlayIconV3 } from "electron-app/src/ui/icons";
import { getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";

interface IProps {
    title: string;
    description?: string;
    items?: Array<{id: string; content: any}>;
    icon?: any;
    className?: string;
    callback?: any;

    defaultExpanded?: boolean;
}

const ActionsList = ({className, ...props}: IProps) => {
    const { title, description, defaultExpanded, callback, icon, items } = props;

    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    const store = useStore();
    
    const handleClick = React.useCallback((id: any) => {
        const recorderState = getRecorderState(store.getState());
        if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) {
			sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });
			return;
		} 

        callback(id);
    }, [callback]);

    const itemsContent = React.useMemo(() => {
        if (!items) {
            return null;
        }
        return items.map((item) => (
            <div onClick={handleClick.bind(this, item.id)} css={actionItemCss}>
                {item.content}
            </div>
        ));
    }, [items]);

    return (
        <div css={[containerCss, bottomSeperatorCss]} className={`${className}`} {...props}>
            <div onClick={setIsExpanded.bind(this, !isExpanded)} css={[headingCss, bottomSeperatorCss]}>
                {icon ? (
                    <div css={headingIconCss}>
                        {icon}
                    </div>
                ) : ""}
                <div css={headingContentCss}>
                    <div css={headingTitleCss}>{title}</div>
                    {description ? (
                        <div css={headingDescriptionCss}>{description}</div>
                    ) : ""}
                </div>
                {itemsContent ? (<PlayIconV3 css={playIconCss} />) : ""};
            </div>
            {isExpanded && itemsContent ? (
                <div css={contentCss}>
                    {itemsContent}
                </div>
            ) : ""}
        </div>
    );
};

const bottomSeperatorCss = css`
    border-bottom-width: 0.5px;
    border-bottom-style: solid;
    border-bottom-color: #1B1B1B;
`;
const containerCss = css`
`;

const headingCss = css`
    padding: 7rem 15rem;
    display: flex;
    :hover {
        background: rgba(85, 85, 85, 0.1);
    }
`;
const headingIconCss = css`
    margin-top: 1rem;
    margin-left: -0.5rem;
`;
const headingContentCss = css`
    margin-left: 8.5rem;
    display: flex;
    flex: 1;
    flex-direction: column;
`;
const headingTitleCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 500;
    font-size: 14rem;
    color: #FFFFFF;
`;
const headingDescriptionCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 10rem;

    color: #A6A6A6;
    margin-top: 2.25rem;  
`;
const playIconCss = css`
	width: 6rem;
	height: 8rem;
	margin-left: auto;
	margin-right: 5rem;
	margin-top: 3rem;
	:hover {
		opacity: 0.8;
	}
`;
const contentCss = css`
    margin: 8rem 0rem;
    display: grid;
    grid-template-columns: auto auto;
    padding: 5rem 35rem;
    row-gap: 13rem;
`;

const actionItemCss = css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;
    color: #7C7C7C;
    cursor: default;

    :hover {
        color: #fff;
    }
`;

export { ActionsList };