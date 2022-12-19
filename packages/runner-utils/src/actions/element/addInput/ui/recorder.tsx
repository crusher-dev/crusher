import React, {useState} from "react";
import { css } from "@emotion/react";
import { BaseDialogToast, BaseDialogTitle, BaseDialogDescription, BaseDialogActions, BaseDialogAction } from "../../../../../../dyson/src/components/sharedComponets/toasts/error";
import { FailedCheckboxIcon } from "../../../../../../dyson/src/components/icons/FailedCheckboxSVG";
import { WhyIcon } from "../../../../../../dyson/src/components/icons/WhyIconSVG";

const ErrorDialog = ({sdk, id, resolveCallback}) => {
    
    const handleAutoFix = () => {
        const step = sdk.getStep(id);
        sdk.updateStep(id, {
            ...step,
            payload: {
                ...step.payload,
                meta: {
                    ...step.payload.meta,
                    value: "https://www.google.com",
                }
            }
        });

        setTimeout(() => {
            sdk.retryStep(id);
            resolveCallback(true);
        }, 100);
    }

    return (
        <BaseDialogToast open={true} duration={100000} setOpen={() => {}}>
            <BaseDialogTitle>
                <div className="flex items-center flex-1">
                    <FailedCheckboxIcon width={18} height={18} />
                    <span className={"ml-12"}>Invalid Target URL</span>

                    <WhyIcon css={whyIconCss} className={"ml-auto"} />
                </div>
            </BaseDialogTitle>
            <BaseDialogDescription className={"pl-42"}>
                We found new value. you might need to update it<br />
                This can be because of <span css={highlightCss}>DNS</span> error
            </BaseDialogDescription>
            <BaseDialogActions>
                <BaseDialogAction type="retry">retry</BaseDialogAction>
                <BaseDialogAction onClick={handleAutoFix} type="auto-fix">Auto-fix</BaseDialogAction>
                <BaseDialogAction type="link">docs</BaseDialogAction>
                <BaseDialogAction type="options">:</BaseDialogAction>
            </BaseDialogActions>
        </BaseDialogToast>
    )
};

const highlightCss = css`
    color: rgba(210, 65, 117, 1);
`;
const containerCss = css`
    background: green;
    position: fixed;
    bottom: 20rem;
    left: 60%;
    transform: translateX(-50%);
    z-index: 10000;
    padding: 6rem;
    border-radius: 8rem;
    color: #fff;
    font-family: Gilroy;
    padding-left: 20rem;
    padding-right: 20rem;
    font-weight: bold;
    font-size: 16rem;
`;

const whyIconCss = css`
  width: 18rem;
  height: 18rem;
`;

export default ErrorDialog;