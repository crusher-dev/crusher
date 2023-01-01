import React, {useState, useContext} from "react";
import { css } from "@emotion/react";
import { BaseDialogToast, BaseDialogTitle, BaseDialogDescription, BaseDialogActions, BaseDialogAction } from "../../../../../../dyson/src/components/sharedComponets/toasts/error";
import { FailedCheckboxIcon } from "../../../../../../dyson/src/components/icons/FailedCheckboxSVG";
import { WhyIcon } from "../../../../../../dyson/src/components/icons/WhyIconSVG";
import { TestErrorContext } from "../../../../../../dyson/src/components/sharedComponets/toasts";
import template, { isTemplateFormat } from "@crusher-shared/utils/templateString";
import { CrusherSdk } from "src/sdk/sdk";

const WaitErrorTypesEnum = {
    TIMEOUT_EXCEEDED: new RegExp(/Timeout (\d+)ms exceeded/im),
    ACTION_SKIP: new RegExp(/page\.waitForURL: Action skipped/im),
};


const trimUrl = (url: string) => {
    // Add ... in middle if length is more than 20
    if (url.length > 20) {
        return url.slice(0, 10) + "..." + url.slice(-10);
    }
    return url;
}

const hasQueryParams = (url: string) => {
    const urlWithoutQueryParams = url.split("?")[0];
    return urlWithoutQueryParams !== url;
};

const removeQueryParams = (url: string) => {
    return url.split("?")[0];
};

const WaitForNavigationErrorDialog = () => {
    const { sdk, stepId, error, resolveError, context } = useContext(TestErrorContext);
    
    const step = sdk.getStep();

    if(!step) return null;
    
    const getErrorMessage = () => {
        const logs: string = error.logs.map((log) => log.message).join(" ");
        const navigationUrl = step.payload.meta.value;
        const usesVariable = isTemplateFormat(navigationUrl);

        const resolvedUrl = isTemplateFormat(navigationUrl) && context ? template(navigationUrl, {ctx: context}) : navigationUrl;

        const shortNavigationURL =  trimUrl(resolvedUrl);

        const expectedError = WaitErrorTypesEnum["TIMEOUT_EXCEEDED"].test(logs) || WaitErrorTypesEnum["ACTION_SKIP"].test(logs);

        if(expectedError && hasQueryParams(navigationUrl)) {
            // Query params might be dynamic
            return {
                type: "TIMEOUT_EXCEEDED",
                heading: "Navigation timed out",
                description: (<div>Possible causes:- Dynamic query params. Adding blob pattern<br/> might fix it</div>),
                retry: true,
                autoFix: () => {
                    sdk.updateStep({
                        ...step,
                        payload: {
                            ...step.payload,
                            meta: {
                                ...step.payload.meta,
                                value: removeQueryParams(navigationUrl) + "*",
                            }
                        }
                    });

                    setTimeout(() => {
                        sdk.retryStep();
                    }, 100);
                    resolveError();
                }
            };
        }
        if(WaitErrorTypesEnum["TIMEOUT_EXCEEDED"].test(logs)) {
            return {
                type: "TIMEOUT_EXCEEDED",
                heading: "Navigation timed out",
                description: (<div>Navigation to <span>{shortNavigationURL}</span> timed out after <span>{step.payload.meta.timeout}</span> ms. Please check the URL and try again.</div>),
            }
        } 

        if(WaitErrorTypesEnum["ACTION_SKIP"].test(logs)) {
            return {
                type: "ACTION_SKIP",
                heading: "Navigation skipped",
                description: (<div>Navigation to <span>{shortNavigationURL}</span> was skipped manually.</div>),
            }
        }

        return {
            type: "UNKNOWN_ERROR",
            heading: "Unexpected error while waiting",
            description: (<div><span>{shortNavigationURL}</span> is not reachable. Please check the URL and try again.</div>),
        }
    }

    const errorMessage = getErrorMessage();
    
    return (
        <BaseDialogToast open={true} duration={100000} setOpen={() => {}}>
            <BaseDialogTitle>
                <div className="flex items-center flex-1">
                    <FailedCheckboxIcon width={18} height={18} />
                    <span className={"ml-12"}>{errorMessage.heading}</span>

                    {/* <WhyIcon css={whyIconCss} className={"ml-auto"} /> */}
                </div>
            </BaseDialogTitle>
            <BaseDialogDescription className={"pl-42"}>
               {errorMessage.description}
            </BaseDialogDescription>
            <BaseDialogActions>
                {errorMessage.retry ? (<BaseDialogAction onClick={sdk.retryStep} type="retry">retry</BaseDialogAction>) : null}
                {errorMessage.autoFix ? <BaseDialogAction  onClick={errorMessage.autoFix} type="auto-fix">Auto-fix</BaseDialogAction> : null }
                {!errorMessage.autoFix ? (
                    <BaseDialogAction onClick={sdk.openStepEditor}>edit</BaseDialogAction>
                ) : null}
                {/* <BaseDialogAction type="link">docs</BaseDialogAction> */}
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

export default WaitForNavigationErrorDialog;