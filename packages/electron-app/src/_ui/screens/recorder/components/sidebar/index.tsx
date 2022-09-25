import React from "react";
import { getIsCustomCodeOn, getIsInRecordingSession, getRecorderInfo, getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import { ActionsPanel } from "./actionsPanel";
import { CustomCodeBanner } from "./customCodeBanner";
import { StepsPanel } from "./stepsPanel/index";
import { ModalManager } from "electron-app/src/ui/components/modals";
import { TemplatesModal } from "electron-app/src/ui/components/sidebar/steps/templatesModal";
import { useLocalBuild } from "electron-app/src/_ui/hooks/tests";
import { ReplaySidebarHeader } from "./replay/header";

interface ISidebarProps {
    className?: string;
};

const ReplayingTopBar = () => {
    return 
};
const Sidebar = ({ className, ...props}: ISidebarProps) => {
    const { currentBuild } = useLocalBuild();
    const isInRecordingSession = useSelector(getIsInRecordingSession);
    const isCustomCodeOn = useSelector(getIsCustomCodeOn);

    const topPanel = React.useMemo(() => {
        if(currentBuild) {
            return <ReplaySidebarHeader/>
        } else {
            return !isCustomCodeOn ? <ActionsPanel/> : <CustomCodeBanner/>;
        }
    }, [currentBuild]);

    return (
        <div css={containerCss} className={`${className}`}>
            { isInRecordingSession ? (
                <>
                    { topPanel }
                    <StepsPanel css={[currentBuild ? `height: 100%` : undefined]}/>
                </> 
            ) : "" }
            <ModalManager />
			<TemplatesModal isOpen={false} handleClose={() => {}} />
        </div>
    )
};

const containerCss = css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 1000;
    background-color: #09090A;
`;

export { Sidebar };