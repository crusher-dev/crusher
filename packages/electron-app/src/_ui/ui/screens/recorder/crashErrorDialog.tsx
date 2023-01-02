import { Button } from "@dyson/components/atoms";
import DialogModal from "@dyson/components/sharedComponets/CrashDialog";
import { css } from "@emotion/react";
import { ActionStatusEnum } from "@shared/types/action";
import { deleteRecordedSteps, updateRecorderCrashState } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { continueRemainingSteps } from "electron-app/src/ipc/perform";
import { FailedStepIcon } from "electron-app/src/_ui/constants/icons";
import { crashAtom } from "electron-app/src/_ui/store/jotai/crashAtom";
import { stepHoverAtom } from "electron-app/src/_ui/store/jotai/steps";
import { useAtom } from "jotai";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

export enum CrashTypeEnum {
    NAVIGATION = "NAVIGATION",
    RENDERER = "RENDERER",
}

const CrashErrorDialog = () => {
    const [crash, setCrash] = useAtom(crashAtom);
    const [_,setStepHoverId] = useAtom(stepHoverAtom);
    const recordedSteps = useSelector(getSavedSteps);
    const dispatch = useDispatch();
    if(!crash) return null;

    const handleClose = () => {
        setCrash(null);
        dispatch(updateRecorderCrashState(null));
    };

    const handleRetry = () => {
        const stepId = recordedSteps.length - 1;
		const step = recordedSteps[stepId];
		dispatch(deleteRecordedSteps([stepId]));

        console.log("Retrying", step, stepId, recordedSteps);
		continueRemainingSteps([
			{
				...step,
				status: ActionStatusEnum.STARTED,
			},
		]);

        handleClose();
    };
    const handleEditStep = () => {
		setStepHoverId(recordedSteps.length - 1);
        handleClose();
    };
    return (
        <DialogModal heading={(<div className={"flex justify-center items-center"} css={css`gap: 8rem; width: 100%;`}>
            <FailedStepIcon css={css`width: 18rem; height: 18rem;`}/>
            <span>Error # 404</span></div>
        )}>
<Button css={css`width: 112rem; border-radius: 8rem;`} bgColor="tertiary-dark" className="mr-12" onClick={handleEditStep}>
                            edit step
                        </Button>
                        <Button css={css`width: 112rem; border-radius: 8rem;`} bgColor="primary-high" onClick={handleRetry}>
                            retry
                        </Button>
        </DialogModal>
    )
};

export { CrashErrorDialog };