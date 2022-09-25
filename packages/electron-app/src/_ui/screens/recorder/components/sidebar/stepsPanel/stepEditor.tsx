import { EditPencilIcon } from "electron-app/src/_ui/icons";
import React from "react";
import { css } from "@emotion/react";
import { getSavedSteps, getStepInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector, useDispatch } from "react-redux";
import { TextHighlighter } from "./helper";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import { FieldInput } from "electron-app/src/ui/components/sidebar/stepEditor/fields";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";

const SelectorInfo = ({stepId}) => {
    const stepInfo = useSelector(getStepInfo(stepId));

    return (
        <div css={selectorInfoContainerCss}>
            <div className={"flex items-center"}>
                <div>
                    <span>main selector:</span>
                    <span css={mainSelectorCss} className={'font-medium'}>{stepInfo.description}</span>
                </div>

                <EditPencilIcon className={"ml-10"} css={pencilIconCss} />
            </div>
            <div css={selectorExtraCss} className={"mt-12"}>
                .class-name, etc, and 24 other
            </div>
        </div>
    )    
};

const selectorExtraCss = css`
    font-size: 12rem;
`;
const mainSelectorCss = css`
    color: rgba(255, 255, 255, 0.89);
`;
const selectorInfoContainerCss = css`

font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13rem;

color: rgba(255, 255, 255, 0.54);

`;

const pencilIconCss = css`width: 10.5rem; height: 10.5rem; margin-top: -2rem;`;

const StepMetaInfo = ({stepId}) => {
    const steps = useSelector(getSavedSteps);
    const stepInfo = useSelector(getStepInfo(stepId));
    const title = TextHighlighter({text: stepInfo.name}, true);


    const hasSelectors = steps[stepId].type.startsWith("ELEMENT");
    const isUrlType =[ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION].includes(steps[stepId].type);

    return (
        <div css={stepMetaInfoContainerCss} className={"px-20 py-24"}>
            <div css={stepNameCss}>
                { title }
            </div>

            {isUrlType ? (
                <FieldInput
                    className={"mt-28"}
                    label={"URL:"}
                    placeholder={"Enter url"}
                    size={"small"}
                    initialValue={"https://google.com"}
                    inputStyleCSS={bigInputCss}
                />
            ) : ""}

            {hasSelectors ? (
                <div className={'flex mt-35'}>
                   <SelectorInfo stepId={stepId}/>
                   <div css={uniqueCss} className={"ml-auto"}>
                       <span css={css`color: rgba(148, 111, 255, 0.99);`}>90%</span> unique
                   </div>
               </div>
            ): ""}
         

            <div css={metaInfoFooterCss} className={`flex ${hasSelectors || isUrlType ? "mt-52" : "mt-30"}`}>
                <div>took 1.9 sec</div>
                <div className={"ml-auto"}>view logs</div>
            </div>
        </div>
    )
};
const bigInputCss = css`
	max-width: 200rem;
	input {
		padding: 14rem 6rem;
	}
`;
const metaInfoFooterCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.56);

`;

const uniqueCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 13rem;

    color: rgba(215, 223, 225, 0.6);
`;
const stepNameCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 15rem;
`;
const stepMetaInfoContainerCss = css`
    background: rgb(5, 5, 5);
`;

const StepEditor = ({stepId}) => {
    const stepInfo = useSelector(getStepInfo(stepId));
    const dispatch = useDispatch();
    const title = TextHighlighter({text: stepInfo.name}, true);

    const handleDelete = () => {
        dispatch(deleteRecordedSteps([stepId]));
    };

    return (
        <div css={containerCss}>
            <StepMetaInfo stepId={stepId}/>
            <div className={"px-20 py-24"} css={stepMainContentCss}>
                <div className="flex">
                    <div css={elementImageCss}>

                    </div>
                    <div className={"ml-auto"}>
                        <ul css={actionsListCss}>
                            <li>modify url</li>
                        </ul>
                    </div>
                </div>
                <div className={"mt-28 flex justify-end"}>
                    <div onClick={handleDelete} css={deleteCss}>delete</div>
                </div>
            </div>
        </div>
    )
};

const deleteCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;
    color: #DB6E82;
    :hover {
        opacity: 0.8;
    }
`;
const actionsListCss = css`
    ont-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    color: rgba(255, 255, 255, 0.53);

    li {
        :hover {
            text-decoration: underline;
            opacity: 0.8;
        }
    }
`;
const elementImageCss = css`
    width: 255rem;
    height: 172rem;
    background: rgba(128, 128, 128, 0.8);
    border-radius: 17rem;
`;
const stepMainContentCss = css`
    background: rgb(11, 11, 11);
`;

const containerCss = css`
    width: 412rem;
`;

export { StepEditor };