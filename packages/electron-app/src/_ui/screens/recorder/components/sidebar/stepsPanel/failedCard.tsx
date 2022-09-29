import React from "react";
import { css } from "@emotion/react";
import {FailedStepIcon} from "electron-app/src/_ui/icons";
import { NormalButton } from "electron-app/src/_ui/components/buttons/NormalButton";
import { continueRemainingSteps } from "electron-app/src/ui/commands/perform";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import {getSavedSteps} from "electron-app/src/store/selectors/recorder";
import { ActionStatusEnum } from "@shared/types/action";
import { useStore } from "react-redux";

const FailedStepCard = ({ stepId }) => {
    const store = useStore();

    const handleRetry = () => {
        const savedSteps = getSavedSteps(store.getState());
        const step = savedSteps[stepId];
        store.dispatch(deleteRecordedSteps([stepId]));

        continueRemainingSteps([
            {
                ...step,
                status: ActionStatusEnum.STARTED,
            },
        ]);
    };

    const handleEdit = () => {
        console.log("edit");
    };
    const handleDeleteAndContinue = () => {
        store.dispatch(deleteRecordedSteps([stepId]));
        continueRemainingSteps();
    }


    return (
        <div css={containerCss} className={"px-12 py-16"}>
            <div css={notifyCardCss} className="flex px-16 py-11">
                <div css={cardTextCss}>
                    <div css={titleCss}>last step failed</div>
                    <div css={descriptionCss} className={"mt-5"}>element info couldn't be found</div>
                </div>
                <div className={"ml-auto"}>
                    <FailedStepIcon css={failedIconCss} />
                </div>
            </div>

            <div className={"flex mt-18 items-center"}>
                <NormalButton CSS={editButtonCss} className={""} onClick={handleEdit}>edit step</NormalButton>
                <NormalButton CSS={retryButtonCss} className={"ml-8"} onClick={handleRetry}>retry</NormalButton>
                {/* <div className={"ml-auto"} onClick={handleMore}><OptionsIcon css={optionsIconCss} /></div> */}
            </div>
            <div className={"flex mt-10"}>
                <div className={"ml-2"} onClick={handleDeleteAndContinue} css={linkCss}>delete & continue</div>
            </div>
        </div>
    )
};

const editButtonCss = css`
    width: 78rem !important;
    height: 26rem !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 6rem !important;
    border: none !important;

    font-family: 'Gilroy' !important;
    font-style: normal !important; 
    font-weight: 600 !important;
    font-size: 13rem !important;
    color: #FFFFFF !important;

    :hover {
        background: rgba(255, 255, 255, 0.1);
        border: none;
    }
`;

const retryButtonCss = css`
    width: 52rem !important;
    height: 26rem !important;
    background: rgba(168, 67, 246, 1) !important;
    border-radius: 6rem;

    font-family: 'Gilroy' !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 13rem !important;
    color: #FFFFFF !important;

`;
const containerCss = css`
    background: rgba(217, 217, 217, 0.03);
`;
const notifyCardCss = css`
    background: rgb(25, 16, 20);
    border: 0.5px solid #E0307A;
    border-radius: 12rem;
`;
const cardTextCss = css`flex:1`;
const failedIconCss = css`width: 18rem; height: 18rem`;
const titleCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 14rem;
    color: #FFFFFF;
`;
const descriptionCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.52);
`;

const linkCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;
    text-decoration-line: underline;

    color: rgba(94, 94, 94, 0.87);
    :hover { opacity: 0.8; }
`;
export { FailedStepCard };