import React from "react";
import { useContext } from "react";
import { ICrusherRecorderContext } from "src/error.types";

import { BaseDialogToast, BaseDialogStatus, BaseDialogTitle, BaseDialogDescription, BaseDialogActions, BaseDialogAction } from "@dyson/recorder";

const ErrorDialog = ({context}) => {
    const recorderContext: ICrusherRecorderContext = useContext(context);

    return (
        <BaseDialogToast>
            <BaseDialogStatus>error</BaseDialogStatus>
            <BaseDialogTitle>Invalid Target URL</BaseDialogTitle>
            <BaseDialogDescription>
                We were unable to navigate to the URL you provided. Please check the URL and try again.
                This could be due to a network issue or a DNS error.
            </BaseDialogDescription>
            <BaseDialogActions>
                <BaseDialogAction type="retry">retry</BaseDialogAction>
                <BaseDialogAction>ignore</BaseDialogAction>
                <BaseDialogAction>docs</BaseDialogAction>
                <BaseDialogAction>advanced</BaseDialogAction>
            </BaseDialogActions>
        </BaseDialogToast>
    );
};

export {
    ErrorDialog,
};