import CrashDialog from "@dyson/components/sharedComponets/CrashDialog";
import { css } from "@emotion/react";
import { FailedStepIcon } from "electron-app/src/_ui/constants/icons";
import { crashAtom } from "electron-app/src/_ui/store/jotai/crashAtom";
import { useAtom } from "jotai";
import React from "react";

export enum CrashTypeEnum {
    NAVIGATION = "NAVIGATION",
    RENDERER = "RENDERER",
}

const CrashErrorDialog = () => {
    const [crash, _] = useAtom(crashAtom);
    if(!crash) return null;

    return (
        <CrashDialog heading={(<div className={"flex justify-center items-center"} css={css`gap: 8rem; width: 100%;`}>
            <FailedStepIcon css={css`width: 18rem; height: 18rem;`}/>
            <span>Error # 404</span></div>
        )} action={"click"}>

        </CrashDialog>
    )
};

export { CrashErrorDialog };