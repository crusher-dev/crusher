import React, {useEffect} from "react";
import {LiveLogs} from "@interfaces/LiveLogs";
import {LogActionCard} from "@ui/components/list/testActionCard";
import {css} from "@emotion/core";

import {ACTION_DESCRIPTIONS} from "../../../../../crusher-shared/constants/actionDescriptions";

interface LiveLogsActionsProps {
    actions: Array<any>;
    logs: Array<LiveLogs>;
};

interface ActionsWithStatus{
    event_type:string;
    desc: string;
    selector: string;
    timeTaken: string;
    isCompleted: boolean;
}

function getLogsWithStatus(actions: Array<{event_type: string, [key: string]: string}>, logs: Array<LiveLogs>) : Array<ActionsWithStatus>{
    let actionsIndex = 0;

    const out = [];

    for(let i = 0; i < logs.length; i++){
        const action = actions[actionsIndex];
        if(actions[actionsIndex++].event_type === logs[i].actionType){
            //@ts-ignore
            out.push({event_type: logs[i].actionType, selector: action.selectors[0].value, desc: ACTION_DESCRIPTIONS[action.event_type]({selector: (action.selectors[0] as any).value, value: action.value}), timeTaken: logs[i].meta.timeTaken, isCompleted: true})
        } else {
            break;
        }
    }

    for(let i = actionsIndex; i < actions.length; i++){
        const action = actions[i];
        //@ts-ignore
        out.push({event_type: action.event_type, selector: action.selectors[0].value, desc: ACTION_DESCRIPTIONS[action.event_type]({selector: (action.selectors[0] as any).value, value: action.value}), timeTaken: null, isCompleted: false});
    }

    return out;
}

function LiveLogsActions(props: LiveLogsActionsProps){
    const {actions, logs} = props;
    const logsWithStatus = getLogsWithStatus(actions, logs);
    const divRef = React.createRef();
    let lastDone = React.createRef();
    const out = logsWithStatus.map((action, index) => {
        const out =  <LogActionCard key={index} isLast={index===actions.length - 1} forwardRef={action.isCompleted && (index === actions.length - 1 || (actions[index+1] && actions[index+1].isCompleted)) ? lastDone : null} index={index+1} action={action} timeTaken={action.timeTaken} isFinished={action.isCompleted} />;
        return out;
    });

    useEffect( () => {
            // const scrollDiv: any = divRef.current;
            // const newScrollTop = scrollDiv.scrollHeight - scrollDiv.clientHeight;
            // if(newScrollTop !== 0) {
            //     scrollDiv.scrollTop = newScrollTop;
            // }
        if(lastDone.current) {
            (lastDone.current as any).scrollIntoView();
        }
    }, [logs]);

    return (
        <div css={styles.container} ref={divRef as any}>
            {out}
        </div>
    );
}

const styles = {
    container: css`
        overflow: scroll;
        height: 14rem;
        scroll-behavior: smooth;
    `
}

export {LiveLogsActions}
