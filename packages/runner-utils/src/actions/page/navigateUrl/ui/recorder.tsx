import React, {useState, useContext} from "react";
import { css } from "@emotion/react";
import { BaseDialogToast, BaseDialogTitle, BaseDialogDescription, BaseDialogActions, BaseDialogAction } from "../../../../../../dyson/src/components/sharedComponets/toasts/error";
import { FailedCheckboxIcon } from "../../../../../../dyson/src/components/icons/FailedCheckboxSVG";
import { WhyIcon } from "../../../../../../dyson/src/components/icons/WhyIconSVG";
import { TestErrorContext } from "../../../../../../dyson/src/components/sharedComponets/toasts";
import template, { isTemplateFormat } from "@crusher-shared/utils/templateString";
import { CrusherSdk } from "src/sdk/sdk";

enum NavigationErrorTypesEnum {
    NAME_ERROR = "net::ERR_NAME_",
    DNS_ERROR = "net::ERR_DNS_",

    SSL_ERROR = "net::ERR_SSL_",
    ERR_CERT = "net::ERR_CERT_",

    UNKNOWN_ERROR = "net::ERR_UNKNOW_ERROR",
};


const trimUrl = (url: string) => {
    // Add ... in middle if length is more than 20
    if (url.length > 20) {
        return url.slice(0, 10) + "..." + url.slice(-10);
    }
    return url;
}
const ErrorDialog = () => {
    const { sdk, stepId, error, resolveError, context } = useContext(TestErrorContext);
    
    const step = sdk.getStep();

    if(!step) return null;
    
    const getErrorMessage = () => {
        const logs: string = error.logs.map((log) => log.message).join(" ");
        const navigationUrl = step.payload.meta.value;
        const usesVariable = isTemplateFormat(navigationUrl);

        const resolvedUrl = isTemplateFormat(navigationUrl) && context ? template(navigationUrl, {ctx: context}) : navigationUrl;

        const shortNavigationURL =  trimUrl(resolvedUrl);

        if (logs.includes(NavigationErrorTypesEnum.NAME_ERROR) || logs.includes(NavigationErrorTypesEnum.DNS_ERROR)) {
            const errorType = logs.includes(NavigationErrorTypesEnum.NAME_ERROR) ? NavigationErrorTypesEnum.NAME_ERROR : NavigationErrorTypesEnum.DNS_ERROR;

            return {
                type: errorType,
                heading: "URL not reachable",
                description: (<div><span css={highlightCss} title={resolvedUrl}>{shortNavigationURL}</span> is either unreachable or not valid.<br/> Please check the URL and try again.</div>),

                edit: () => {
                    sdk.openStepEditor();
                }
            }
        }
        if (logs.includes(NavigationErrorTypesEnum.SSL_ERROR) || logs.includes(NavigationErrorTypesEnum.ERR_CERT)) {
            const errorType = logs.includes(NavigationErrorTypesEnum.SSL_ERROR) ? NavigationErrorTypesEnum.SSL_ERROR : NavigationErrorTypesEnum.ERR_CERT;
            return {
                type: errorType,
                heading: "SSL Verification Failed",
                description: (<div><span css={highlightCss} title={resolvedUrl}>{shortNavigationURL}</span> does not support HTTPS.<br/> Please check the URL or try using HTTP.</div>),
                autoFix: !usesVariable ? () => {
                    const url = new URL(navigationUrl);
                    url.protocol = "http";
                    const step = sdk.getStep();
                    sdk.updateStep({
                        ...step,
                        payload: {
                            ...step.payload,
                            meta: {
                                ...step.payload.meta,
                                value: url.toString(),
                            }
                        }
                    });

                    setTimeout(() => {
                        sdk.retryStep();
                    }, 100);
                    resolveError();
                } : undefined,
            }
        }

        return {
            type: NavigationErrorTypesEnum.UNKNOWN_ERROR,
            heading: "URL not reachable",
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
                {errorMessage.retry ? (<BaseDialogAction type="retry">retry</BaseDialogAction>) : null}
                {errorMessage.autoFix ? <BaseDialogAction onClick={errorMessage.autoFix} css={css`flex: 1`} type="auto-fix">Auto-fix</BaseDialogAction> : null }
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

export default ErrorDialog;