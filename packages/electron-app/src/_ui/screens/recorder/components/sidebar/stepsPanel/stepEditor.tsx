import { EditPencilIcon } from "electron-app/src/_ui/icons";
import React from "react";
import { css } from "@emotion/react";
const SelectorInfo = () => {
    return (
        <div>
            <div>
                <span>main selector:</span>
                <span>first-element</span>
                <EditPencilIcon className={"w-10.5 h-10.5"}/>
            </div>
            <div>
                .class-name, etc, and 24 other
            </div>
        </div>
    )    
};

const StepMetaInfo = () => {
    return (
        <div css={stepMetaInfoContainerCss} className={"px-20 py-24"}>
            <div>
                <span>Click</span>
                on
                <span>signup</span>
                element
            </div>

            <div>
                <SelectorInfo/>
                <div>
                    <span>90%</span> unique
                </div>
            </div>

            <div>
                <div>took 1.9 sec</div>
                <div>view logs</div>
            </div>
        </div>
    )
};

const stepMetaInfoContainerCss = css`
    background: rgb(5, 5, 5);
`;

const StepEditor = () => {
    return (
        <div>
            <StepMetaInfo/>
            <div className={"px-20 py-24"} css={stepMainContentCss}>
                <div>
                    <div></div>
                    <div>
                        <ul>
                            <li>modify url</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div>delete</div>
                </div>
            </div>
        </div>
    )
};
const stepMainContentCss = css`
    background: rgb(11, 11, 11);
`;

const containerCss = css``;

export { StepEditor };