import React from "react";
import { LinkButton } from "./button.tsx";
import { css } from "@emotion/css";

export const VercelIntegrationButton = () => {
    return (
        <LinkButton className={buttonCss} blank={true} href={"https://vercel.com/integrations/crusher-dev"}>
            <div className={"flex-1 flex justify-start"}>
                <VercelIcon style={{width: 18, height: 15.58}}/>
                <div className={seperatorCss}></div>
                <div className={textCss}>Integrate</div>
            </div>
        
        </LinkButton>
    )
};


const textCss = css`
    margin-left: 20px;
    font-family: Gilroy;
    font-weight: 600;
    color: #FFF;
`;
const buttonCss = css`
    display: flex;
    background: #1374EF;
    border-radius: 4px;
    position: relative;
    padding: 8px 12px;
    justify-content: flex-start;
`;

const seperatorCss = css`
    width: 2px;
    height: 100%;
    background: #1269D3;
    position: absolute;
    top: 0;
    left: 38px;
`;
const VercelIcon = (props) => (
    <svg
      viewBox={"0 0 1155 1000"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m577.344 0 577.346 1000H0L577.344 0Z" fill="#fff" />
    </svg>
);
  