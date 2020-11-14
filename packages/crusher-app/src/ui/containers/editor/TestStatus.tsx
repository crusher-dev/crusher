import React from "react";
import {css} from "@emotion/core";
import {ProgressBar} from "@ui/components/ProgressBar";
import {LogActionCard} from "@ui/components/testActionCard";
import {LiveLogs} from "@interfaces/LiveLogs";

interface TestStatusProps{
    logs: Array<LiveLogs>;
};


function TestStatus(props: any) {
    const {logs} = props;

    const liveLogs = logs.map((log: LiveLogs) => {
            const action = { event_type: log.actionType, desc: log.body.message };
            return <LogActionCard action={action} timeTaken={log.meta ? log.meta.timeTaken : null} isFinished={true} />;
    });

    return (
        <div css={styles.container}>
            <div css={styles.infoHeading}>We're verifying your test in background</div>
            <ProgressBar progress={2} style={{width: "100%", height: "0.38rem", marginTop: "0.9rem"}}/>
            <div css={styles.statusDescContainer}>
                <span css={styles.statusDesc}>You can go ahead and save test.</span>
                <span css={styles.stepsStatus}>20/30 Steps</span>
            </div>
            <div css={styles.liveLogsContainer}>

            </div>
        </div>
    );
}

const styles = {
    container: css`
        
    `,
    infoHeading: css`
        
    `,
    statusDescContainer: css`
        margin-top: 0.75rem;
        font-family: Gilroy;
        font-weight: 500;
        font-style: normal;
        font-size: 0.75rem;
        color: #2D3958;
    `,
    statusDesc: css`
      
    `,
    stepsStatus: css`
        margin-left: auto;
        font-weight: bold;
    `,
    liveLogsContainer: css`
        margin-top: 2.25rem;
    `
}
