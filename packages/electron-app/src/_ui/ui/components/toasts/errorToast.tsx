import { TextBlock } from "@dyson/components/atoms";
import { css } from "@emotion/react";
import { CloseIcon, EditIconV4 } from "electron-app/src/_ui/constants/icons";
import { FailedCheckboxIcon } from "electron-app/src/_ui/constants/old_icons";
import React from "react";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";
import { HoverButton } from "../hoverButton";
import { ActionToast } from "./variants/errorToast";
import { useStore } from "react-redux";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { getStore } from "electron-app/src/store/configureStore";
import { FieldSelectorPicker } from "../../containers/components/sidebar/stepEditor/fields";
import { retryStep } from "../../screens/recorder/sidebar/stepsPanel/failedCard";

const checkIfElementFailure = (stepId, errorType) => {
    const store = getStore();
    const savedSteps = getSavedSteps(store.getState() as any);
    const step = savedSteps[stepId];

    const isElementFailure = step.type.startsWith("ELEMENT_") && [StepErrorTypeEnum.ELEMENT_NOT_FOUND, StepErrorTypeEnum.ELEMENT_NOT_STABLE, StepErrorTypeEnum.ELEMENT_NOT_VISIBLE, StepErrorTypeEnum.TIMEOUT].includes(errorType);

    return isElementFailure;
}

const FixToast = ({ message, setOpen, meta }) => {
    const handleOpen = (open) => {
        alert("Open " + open); 
        setOpen(open);
    }

    return (
        <ActionToast
            duration={1000 * 60 * 60 * 60}
            open={true}
            setOpen={() => {}}
            actions={<FixToastActions meta={meta} setOpen={setOpen} />}
            message={<FixToastMessage message={message} />}
        />
    )
};

const FixToastMessage = ({ message }) => {
    return (
        <div className={"flex items-center"}>
            <FailedCheckboxIcon css={correctIconCss} />
            <span className={"ml-12"}>{message}</span>
        </div>
    );
};

interface IProps {
    setOpen: any;
    meta?: {
        stepId: any;
        errorType: StepErrorTypeEnum;
        callback: () => void;
    }
};

const FixToastActions = ({ setOpen, meta }: IProps) => {
    const { callback: actionCallback } = meta;
    const store = useStore();
    const { errorType, stepId } = meta;
    const isElementFailure = checkIfElementFailure(stepId, errorType);

    const handleFixStep = () => {
        actionCallback && actionCallback();
        setOpen(false);
    };

    const actionText = React.useMemo(() => {
        return isElementFailure ? "re-select" : "fix step";
    }, [isElementFailure]);

    const handleOnSelectorsPicked = () => {
        actionCallback && actionCallback();
        retryStep(stepId);
        setOpen(false);
    };

    return (
        <div className={"flex items-center"} css={actionsContainerCss}>
            {isElementFailure ? (
                <FieldSelectorPicker stepId={stepId} onSelectorsPicked={handleOnSelectorsPicked}>
                    <div className={"flex items-center"} css={actionCss}>
                        <div className="px-12 flex items-center">
                            <EditIconV4 css={editIcoNCss} />
                            <TextBlock css={actionTextCss} fontSize={14} color={"#CC5FFF"} className={"ml-6"}>{actionText}</TextBlock>
                        </div>
                    </div>
                </FieldSelectorPicker>

            ) : (
                <div className={"flex items-center"} onClick={handleFixStep} css={actionCss}>
                    <div className="px-12 flex items-center">
                        <EditIconV4 css={editIcoNCss} />
                        <TextBlock css={actionTextCss} fontSize={14} color={"#CC5FFF"} className={"ml-6"}>{actionText}</TextBlock>
                    </div>
                </div>
            )}


            <div className={"px-12 pl-10"}>
                <HoverButton onClick={setOpen.bind(this, false)}>
                    <CloseIcon css={css`width: 8rem; height: 8rem;`} />
                </HoverButton>
            </div>
        </div>
    )
};


const actionsContainerCss = css`
    height: 100%;   
`;
const actionCss = css`height: 100%;border-width: 0px 0.5px;
border-style: solid;
border-color: rgba(255, 255, 255, 0.05);
border-radius: 0px;
:hover {
  background: rgba(255, 255, 255, 0.01);
}
`;
const actionTextCss = css`
  margin-top: 2rem;
`;
const editIcoNCss = css`
  width: 14rem;
  height: 14rem;
`;
const correctIconCss = css`
  width: 14rem;
  height: 14rem;
`;

export { FixToast };