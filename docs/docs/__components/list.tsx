import React from "react";

import styled from "@emotion/styled";
export const UseCrusher = ({ children, color }) => (
  <div className="useCrusher_in_project">
    <CommandInput>
      <div className="flex justify-between" id="command-heading">
        <div>create new test</div>
        <div className="demo-video">play demo</div>
      </div>

      <div id="command" className="flex items-center justify-between">
        <div>
          <span className="arrow">  ></span> npx <span className="crusherDevLabel">crusher.dev</span>
        </div>
        <CopyIcon
          height={20}
          width={20}
          onClick={() => {
            copy("npx crusher.dev");
            alert("copied command to clipboard");
          }}
        />{" "}
      </div>

      {/* <div id="download">or download binary </div> */}
    </CommandInput>

    <WorkflowList>
      <div className="flex items-center justify-between heading-section">
        <div className="heading">
          & integrate in workflow
          <span className="optional">(optional)</span>
        </div>
        <div className="duration">7 mins</div>
      </div>
    </WorkflowList>

    <ItemListBox>
      <Item>
        <ChekSVG className="check" />
        create some test <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        run crusher test with each commit <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        monitor production <span className="docs">docs</span>
      </Item>
      <Item>
        <ChekSVG className="check" />
        get alerts on slack/discord <span className="docs">docs</span>
      </Item>
    </ItemListBox>

  </div>
);

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

  margin-left: -24px;
  width: 618px;
  max-width: 100%;
  padding: 24px;

  background: rgba(0, 0, 0, 0.15);
  border: 1px solid #1e1f1f;
  border-radius: 20px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    margin-left: 0px !important;
  }
`;

const WorkflowList = styled.div`
  margin-top: 56px;

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

const CommandInput = styled.div`
  margin-top: 44px;
  #command-heading {
    width: 588px;
    max-width: 100%;
    font-size: 15px;
    font-weight: 500;
    margin-top: 32px;
  }

  #download {
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.03em;

    color: #626262;
  }
  #command {
    margin-left: -24px;
    width: 618px;
    max-width: 100%;
    padding: 12px 16px 12px 24px;
    gap: 8px;

    .arrow{
        font-size: 12px;
        color: grey;
    }

    color: #dfdfdf;

    height: 46px;
    font-size: 15px;
    letter-spacing: .4px;

    #copy-icon:hover {
      cursor: pointer;
      path {
        fill: white;
      }
    }

    background: #0c0c0c;
    border: 1px solid #1e1f1f;
    border-radius: 12px;
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 06px;

    .crusherDevLabel {
      color: #ABFF56;
    }
  }

  .demo-video {
    letter-spacing: 0.04em;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    :hover {
      color: #ae46ff;
    }

    color: #7a7a7a;
  }

  @media (max-width: 600px) {
    #command {
      margin-left: 0px;
    }
  }
`;

function CopyIcon(props) {
  return (
    <svg
      id="copy-icon"
      width={24}
      height={24}
      viewBox={"0 0 24 24"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a49.147 49.147 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
        fill="#B3B3B3"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 110 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 110 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 110 1.5H9a.75.75 0 01-.75-.75z"
        fill="#B3B3B3"
      />
    </svg>
  );
}

function copy(text) {
  var input = document.createElement("input");
  input.setAttribute("value", text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}

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
