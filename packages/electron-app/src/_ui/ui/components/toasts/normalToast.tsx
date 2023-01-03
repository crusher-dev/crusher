import { css } from "@emotion/react";
import { CloseIcon } from "electron-app/src/_ui/constants/icons";
import { GreenCheckboxIcon } from "electron-app/src/_ui/constants/old_icons";
import React from "react";
import { HoverButton } from "../hoverButton";
import { ActionToast } from "./variants/actionToast";

const NormalToast = ({ meta, setOpen, message, duration = 7000 }) => {
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
            <GreenCheckboxIcon css={correctIconCss} />
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
const actionCss = css`height: 100%;border-width: 0px 0.5px;
border-style: solid;
border-color: rgba(255, 255, 255, 0.05);
border-radius: 0px;
:hover {
  background: rgba(255, 255, 255, 0.01);
}
`;
const actionTextCss = css`
  margin-top: 2rem;
`;
const editIcoNCss = css`
  width: 14rem;
  height: 14rem;
`;

const correctIconCss = css`
  width: 14rem;
  height: 14rem;
`;

export { NormalToast };