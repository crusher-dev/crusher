import React, {useState, useContext} from "react";
import { css } from "@emotion/react";
import { BaseDialogToast, BaseDialogTitle, BaseDialogDescription, BaseDialogActions, BaseDialogAction } from "../../../../../../dyson/src/components/sharedComponets/toasts/error";
import { FailedCheckboxIcon } from "../../../../../../dyson/src/components/icons/FailedCheckboxSVG";
import { WhyIcon } from "../../../../../../dyson/src/components/icons/WhyIconSVG";
import { TestErrorContext } from "../../../../../../dyson/src/components/sharedComponets/toasts";

enum NavigationErrorTypesEnum {
    NAME_NOT_RESOLVED = "net::ERR_NAME_NOT_RESOLVED",
    NAME_RESOLUTION_FAILED = "net::ERR_NAME_RESOLUTION_FAILED",
    SSL_PROTOCOL_ERROR = "net::ERR_SSL_PROTOCOL_ERROR",
    UNKNOWN_ERROR = "net::ERR_UNKNOW_ERROR",
};

const ERROR_MESSAGE = {
    [NavigationErrorTypesEnum.NAME_NOT_RESOLVED]: "We couldn't find the website you were trying to visit. Please check the URL and try again.",
    [NavigationErrorTypesEnum.NAME_RESOLUTION_FAILED]: "We couldn't find the website you were trying to visit. Please check the URL and try again.",
    [NavigationErrorTypesEnum.SSL_PROTOCOL_ERROR]: "The website you were trying to visit is not secure. Please check the URL and try again.",
    [NavigationErrorTypesEnum.UNKNOWN_ERROR]: "We couldn't find the website you were trying to visit. Please check the URL and try again.",
};

const ErrorDialog = () => {
    const { sdk, stepId, error, resolveError } = useContext(TestErrorContext);
    
    const getErrorType = () => {
        const logs: string = error.logs.map((log) => log.message).join(" ");

        console.log("logs", logs);
        if (logs.includes(NavigationErrorTypesEnum.NAME_NOT_RESOLVED)) {
            return NavigationErrorTypesEnum.NAME_NOT_RESOLVED;
        }
        if (logs.includes(NavigationErrorTypesEnum.NAME_RESOLUTION_FAILED)) {
            return NavigationErrorTypesEnum.NAME_RESOLUTION_FAILED;
        }
        if (logs.includes(NavigationErrorTypesEnum.SSL_PROTOCOL_ERROR)) {
            return NavigationErrorTypesEnum.SSL_PROTOCOL_ERROR;
        }

        return NavigationErrorTypesEnum.UNKNOWN_ERROR;
    }

    const handleAutoFix = async () => {
        const step = await sdk.getStep();
        await sdk.updateStep({
            ...step,
            payload: {
                ...step.payload,
                meta: {
                    ...step.payload.meta,
                    value: "https://www.google.com",
                }
            }
        });

        sdk.retryStep();
        resolveError();
    }

    const errorType = getErrorType();

    return (
        <BaseDialogToast open={true} duration={100000} setOpen={() => {}}>
            <BaseDialogTitle>
                <div className="flex items-center flex-1">
                    <FailedCheckboxIcon width={18} height={18} />
                    <span className={"ml-12"}>{errorType}</span>

                    <WhyIcon css={whyIconCss} className={"ml-auto"} />
                </div>
            </BaseDialogTitle>
            <BaseDialogDescription className={"pl-42"}>
               {ERROR_MESSAGE[errorType]}
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