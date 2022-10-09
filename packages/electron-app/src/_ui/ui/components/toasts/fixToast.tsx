import { TextBlock } from "@dyson/components/atoms";
import { css } from "@emotion/react";
import { CloseIcon, EditIconV4 } from "electron-app/src/_ui/constants/icons";
import { FailedCheckboxIcon } from "electron-app/src/_ui/constants/old_icons";
import React from "react";
import { HoverButton } from "../hoverButton";
import { ActionToast } from "./variants/actionToast";

const FixToast = ({message, actionCallback}) => {
    const [open, setOpen] = React.useState(true);

    return (
        <ActionToast
            duration={1000 * 60 * 60 * 60}
            open={open}
            setOpen={setOpen}
            actions={<FixToastActions actionCallback={actionCallback} setOpen={setOpen} />}
            message={<FixToastMessage message={message} />}
        />
    )
};

const FixToastMessage = ({message}) => {
    return (
        <div className={"flex items-center"}>
            <FailedCheckboxIcon css={correctIconCss} />
            <span className={"ml-10"}>{message}</span>
        </div>
    );
};

const FixToastActions = ({ setOpen, actionCallback }) => {
    const handleFixStep = () => {
        actionCallback && actionCallback();
        setOpen(false);
    };

    return (
        <div className={"flex items-center"} css={actionsContainerCss}>
            <div className={"flex items-center"} onClick={handleFixStep} css={actionCss}>
                <div className="px-12 flex items-center">
                    <EditIconV4 css={editIcoNCss} />
                    <TextBlock css={actionTextCss} fontSize={14} color={"#CC5FFF"} className={"ml-6"}>fix step</TextBlock>
                </div>
            </div>

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

export { FixToast };