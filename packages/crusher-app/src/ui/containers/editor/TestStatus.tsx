import React from "react";
import {css} from "@emotion/core";
import {ProgressBar} from "@ui/components/app/ProgressBar";
import {LogActionCard} from "@ui/components/list/testActionCard";
import {LiveLogs} from "@interfaces/LiveLogs";
import {LiveLogsActions} from "@ui/components/editor/LiveLogsActions";

interface TestStatusProps{
    logs: Array<LiveLogs>;
    actions: Array<any>;
};


function TestStatus(props: TestStatusProps) {
    const {logs, actions} = props;

    const actionsCount = actions.length;

    return (
        <div css={styles.container}>
            <div css={styles.infoHeading}>We're verifying your test in background</div>
            <ProgressBar progress={(logs.length/actionsCount)*100} style={{width: "100%", height: "0.38rem", marginTop: "0.9rem"}}/>
            <div css={styles.statusDescContainer}>
                <span css={styles.statusDesc}>You can go ahead and save test.</span>
                <span css={styles.stepsStatus}>{logs.length}/{actionsCount} Steps</span>
            </div>
            <div css={styles.liveLogsContainer}>
                <LiveLogsActions actions={actions} logs={logs}/>
            </div>
        </div>
    );
}

const styles = {
    container: css`
        margin-top: 3.9rem;
        width: 90%;
        position: relative;
        left: 50%;
        transform: translateX(-50%)
    `,
    infoHeading: css`
        font-family: Cera Pro;
        font-style: normal;
        font-weight: bold;
        font-size: 1rem;
    `,
    statusDescContainer: css`
        margin-top: 0.9rem;
        font-family: Gilroy;
        font-weight: 500;
        font-style: normal;
        font-size: 0.75rem;
        color: #2D3958;
    `,
    statusDesc: css`
      
    `,
    stepsStatus: css`
        float: right;
        font-weight: bold;
    `,
    liveLogsContainer: css`
        margin-top: 2.25rem;
    `
}

export {TestStatus};
