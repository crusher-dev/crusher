import React from "react";
import { css } from "@emotion/react";
import { NetworkViewer } from "network-viewer";

export const TestNetwork = ({ testInstanceData, testId }) => {
    
    const harUrl = testInstanceData.har;
    return (
     <div css={containerCss}>
           <NetworkViewer file={harUrl}/>
      </div>
    )
};

const containerCss = css`
    width: 93%;
    height: 100%;
    max-height: 760rem;
    overflow: scroll;
    background: #f7f7f7;
    color: #000;
    margin-top: 42rem;
    margin-left: 54rem;
    padding: 20rem 24rem;
    position: relative;
    overflow: scroll;
    border-radius: 4rem;
    resize: vertical;
    * {
        font-size: 12rem !important;
    }
`;