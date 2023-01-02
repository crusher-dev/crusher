import React from "react";

import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { CommandBox } from "./CommandBox";


export const UseCrusher = ({ children, color }) => (
  <div className="useCrusher_in_project">

    <div 
    className={`flex justify-between ${commandHeading}`}id="command-heading">
        <div className={css`font-weight: 700; font-size: 16;`}>Install crusher</div>
        <a className="demo-video" href="https://www.youtube.com/watch?v=Nc-TlgeKBSE">play demo</a>
     </div>

    <CommandBox
      text={(
        <React.Fragment>
          <span className="arrow"> ></span> npx <span className="crusherDevLabel">crusher.dev</span>
        </React.Fragment>
      )}
    />

  </div>
);




export const FurtherDocs = ()=>{
  return (
    <React.Fragment>
    <WorkflowList>
      <div className="flex items-center justify-between heading-section">
        <div className="heading">
          Further helpful docs
          <span className="optional">(optional)</span>
        </div>
        <div className="duration">7 mins</div>
      </div>
    </WorkflowList>

    <ItemListBox>
      <Item>
        <ChekSVG className="check" />
        Create test for your website <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        Run crusher test with each commit <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        Monitor production <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        Get alerts on slack/discord <span className="docs">docs</span>
      </Item>
    </ItemListBox>
    </React.Fragment>
  )
}

const Item = styled.div`
  color: #ababab;
  display: flex;
  align-items: center;
  font-size: 14px;
  :hover {
    cursor: pointer;
    color: #ae46ff;
    .docs {
      display: block;
      color: #ae46ff;
    }
  }
  .check {
    margin-right: 12px;
  }

  .docs {
    display: none;
    margin-left: 08px;
    font-size: 12px;
  }
`;

const ItemListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 14px;

  width: 618px;
  max-width: 100%;
  padding: 24px;

  background: rgba(0, 0, 0, 0.15);
  border: 1px solid #1e1f1f;
  border-radius: 0 0 20px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    margin-left: 0px !important;
  }
`;

const WorkflowList = styled.div`
  margin-top: 28px;

  .heading-section {
    width: 588px;
    max-width: 100%;
  }
  .heading {
    font-size: 16px;
    font-weight: 500;

    color: #d7dde1;
    .optional {
      color: #363636;
      margin-left: 8px;
      font-size: 13px;
    }
  }

  .duration {
    font-size: 12px;
    font-weight: 500;

    color: #363636;
  }

  @media (max-width: 600px) {
    .optional {
      display: none;
    }
  }
`;

const commandHeading = css`
  
  width: 612px;
    max-width: 100%;
    font-size: 15px;
    font-weight: 500;
    margin-top: 32px;


`



function ChekSVG(props) {
  return (
    <svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x={0.5}
        y={0.5}
        width={15}
        height={15}
        rx={4.5}
        stroke="#D9D9D9"
        strokeOpacity={0.08}
      />
    </svg>
  );
}
