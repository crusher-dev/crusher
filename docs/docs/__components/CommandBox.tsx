import React, { useState } from "react";

import styled from "@emotion/styled";
import { css } from "@emotion/css";
import {CopyToClipboard} from "./util/CopyToClipboard";


export const CommandBox = ({text})=>{

    const [hover,setHover] = useState(false) 
    return (
      <CommandInput>
      <div className="whole_box">
      <div className="top_box flex items-center">
        <div className="tab flex items-center"><TerminalIcon className="mr-4"/> <span className={css`margin-left:8px; font-size: 13; letter-spacing: .4px;`}>run in terminal</span></div>
      </div>
        <div id="command"
        onMouseOver={setHover.bind(this,true)}
        onMouseOut={setHover.bind(this,false)}
        className="flex items-center justify-between">
          <div>
           {text}
          </div>


          <CopyToClipboard />
        </div>
      </div>
    </CommandInput>
    )
  }
  


const CommandInput = styled.div`

#download {
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.03em;

  color: #626262;
}

.whole_box{
  margin: 16px 0;
  width: 618px;
  max-width: 100%;
}
#command {
    position: relative;

  padding: 12px 16px 12px 24px;
  gap: 8px;

  .arrow{
      font-size: 12px;
      color: grey;
  }

  color: #dfdfdf;

  height: 50px;
  font-size: 15px;
  letter-spacing: .4px;

  #copy-icon:hover {
    cursor: pointer;
    path {
      fill: white;
    }
  }



  background: #030303;
  border: 1px solid #1e1f1f;
  border-radius: 0 0 12px 12px;
  font-weight: 500;

  .crusherDevLabel {
    color: #BD3FF9;
  }
}

.top_box{
    border: 1px solid #1e1f1f;
    border-radius: 12px 12px 0 0;
     background: #030303;

    overflow: hidden;
    
    border-bottom: 0;

    .tab{

      padding: 8px 12px 6px 0;

      padding-left: 20px;
      background: #030303;
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



function TerminalIcon(props) {
    return (
        <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.313 3.5a1.75 1.75 0 011.75-1.75h7.874a1.75 1.75 0 011.75 1.75v7a1.75 1.75 0 01-1.75 1.75H3.064a1.75 1.75 0 01-1.75-1.75v-7zm2.315.566a.438.438 0 01.619 0l1.312 1.312a.437.437 0 010 .619L4.247 7.309a.438.438 0 01-.619-.618l1.004-1.003-1.004-1.004a.438.438 0 010-.618zm2.497 2.497a.437.437 0 100 .875h1.75a.437.437 0 100-.875h-1.75z"
                fill="#555"
            />
        </svg>
    );
  }



