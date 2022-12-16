import { css } from "@emotion/react";
import { CloseIcon } from "electron-app/src/_ui/constants/icons";
import { GreenCheckboxIcon, LoadingIconV2 } from "electron-app/src/_ui/constants/old_icons";
import React from "react";
import { HoverButton } from "../hoverButton";
import { ActionToast } from "./variants/actionToast";

const LoadingToast = ({ meta, setOpen, message, duration = 7000 }) => {
    const handleOpen = (open) => {
        if(!open) {
            setOpen(open);
        }
    }
    return (
        <ActionToast
            duration={duration}
            open={true}
            setOpen={setOpen}
            message={<FixToastMessage message={message} />}
            actions={<NormalToastActions setOpen={handleOpen} meta={meta} />}
        />
    )
};

const FixToastMessage = ({ message }) => {
    return (
        <div className={"flex items-center"}>
            <LoadingIconV2 css={loadingIconCss}/>
            <span className={"ml-10"}>{message}</span>
        </div>
    );
};


const NormalToastActions = ({ setOpen, meta }: any) => {

    return (
        <div className={"flex items-center"} css={actionsContainerCss}>
            <div className={"px-12 pl-10"}>
                <HoverButton onClick={setOpen.bind(this, false)}>
                    <CloseIcon css={css`width: 8rem; height: 8rem;`} />
                </HoverButton>
            </div>
        </div>
    )
};


const actionsContainerCss = css`
    height: 100%;   
`;
const loadingIconCss = css`
width: 14rem;
height: 14rem;
`;
export { LoadingToast };