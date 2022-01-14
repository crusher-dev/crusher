import React from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getRecorderInfo } from "../../../store/selectors/recorder";
import { Conditional } from "@dyson/components/layouts";
import { ActionsPanel } from "./actionsPanel";
import { StepsPanel } from "./steps";
import { TemplatesModal } from "./steps/templatesModal";

const Sidebar = ({className, ...props}: any) => {
    const recorderInfo = useSelector(getRecorderInfo);

    return (
        <div css={containerStyle} className={`${className}`}>
            <Conditional showIf={!!recorderInfo.device}>
                <ActionsPanel />
                <StepsPanel />
            </Conditional>
            <TemplatesModal isOpen={false} handleClose={() => {}} />
        </div>
    )
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
`;

export { Sidebar }