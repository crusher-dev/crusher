import React from "react";
import { css } from "@emotion/react";
import { ActionHeadingIcon, PlayIconV3 } from "electron-app/src/ui/icons";
import { getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";

interface IProps {
    title: string;
    description: string;
    items: Array<{id: string; content: any}>;
    className?: string;
    callback?: any;
}

const ActionsList = ({className, ...props}: IProps) => {
    const { title, description, callback, items } = props;
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
        return items.map((item) => (
            <div onClick={handleClick.bind(this, item.id)} css={actionItemCss}>
                {item.content}
            </div>
        ));
    }, [items]);

    return (
        <div css={containerCss} className={`${className}`} {...props}>
            <div css={headingCss}>
                <ActionHeadingIcon css={headingIconCss} />
                <div css={headingContentCss}>
                    <div css={headingTitleCss}>{title}</div>
                    <div css={headingDescriptionCss}>{description}</div>
                </div>
                <PlayIconV3 css={playIconCss} />
            </div>
            <div css={contentCss}>
                {itemsContent}
            </div>
        </div>
    );
};

const containerCss = css`
    padding: 10rem 0rem;
`;

const headingCss = css`
    background: linear-gradient(0deg, rgba(48, 60, 102, 0.42), rgba(48, 60, 102, 0.42)), #09090A;
    padding: 7rem 15rem;
    display: flex;
`;
const headingIconCss = css`
    width: 12rem;
    height: 12rem;
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