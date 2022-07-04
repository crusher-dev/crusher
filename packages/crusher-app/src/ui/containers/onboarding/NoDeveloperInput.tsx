import React from "react";
import {css } from "@emotion/react";
import { LinkBox } from "@components/common/LinkBox";
import { NewTabSVG } from "@svg/dashboard";

const NoDeveloperInput = () => {
    const mainRef = React.useRef(null);

    return (
        <div ref={mainRef} css={[contentCss]}>

        <div css={mainContainerCss}>
                <div css={titleContainerCss}>
                        <div css={headingCss}>download recorder</div>
                        <div css={titleTaglineCss}>with recorder you can create and run test</div>
                </div>

                    <div css={downloadButtonContainerCss}>
                            <div css={downloadButtonCss}>
                                download
                                <DownloadIcon/>
                            </div>
                    </div>
        </div>


        <div css={waitinContainerCss}>
            <div css={waitingLeftContainerCss}>
                   <ClockIcon css={clockIconCss}/>
                   <div>Waiting for a test to be created.</div>
            </div>
       
            <div css={howToDoItTextCss}>How to do it?</div>
          </div>
        </div>
    );
}

const downloadButtonCss = css`
    background: linear-gradient(0deg, #9651EF, #9651EF), linear-gradient(0deg, #8C45E8, #8C45E8), #BC66FF;
    border: 0.5px solid rgba(169, 84, 255, 0.4);
    border-radius: 8px;
    font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 14rem;
text-align: center;

color: #FFFFFF;
display: flex;
gap: 10rem;
padding: 8rem 10rem;
`;
const DownloadIcon = (props) => (
    <svg
      width={15}
      height={14}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.564.186C3.172.046 3.896 0 4.734 0h1.212C6.7 0 7.401.39 7.818 1.039l.61.948c.139.216.373.346.623.346h3.791c1.198 0 2.17.981 2.158 2.244-.014 1.505-.002 3.01-.002 4.514 0 .868-.044 1.619-.18 2.25-.136.639-.377 1.2-.801 1.641-.425.44-.967.69-1.584.832-.607.14-1.331.186-2.169.186h-5.53c-.838 0-1.562-.046-2.17-.186-.616-.142-1.158-.391-1.583-.832-.425-.44-.665-1.002-.802-1.642C.044 10.71 0 9.96 0 9.09V4.91c0-.869.044-1.62.179-2.25.137-.64.377-1.202.802-1.642.425-.44.967-.69 1.583-.832ZM8.25 6.222a.764.764 0 0 0-.75-.778.764.764 0 0 0-.75.778v2.4l-.595-.616a.731.731 0 0 0-1.06 0 .798.798 0 0 0 0 1.1L6.922 11a.94.94 0 0 0 .024.025.736.736 0 0 0 .553.252.736.736 0 0 0 .552-.252.94.94 0 0 0 .025-.025l1.828-1.895a.798.798 0 0 0 0-1.1.731.731 0 0 0-1.06 0l-.595.616v-2.4Z"
        fill="#fff"
      />
    </svg>
  )

  
const downloadIconCss = css`

`;
const mainContainerCss = css`display: flex; align-items: center;`;
const downloadButtonContainerCss = css`margin-left: auto`;
const titleContainerCss = css`
    display: flex;
    flex-direction: column;
`;

const titleTaglineCss = css`
    margin-top: 6rem;
    font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 12rem;
letter-spacing: 0.03em;

color: rgba(255, 255, 255, 0.35);

`;



const clockIconCss = css`
  width: 16rem;
`;
const waitinContainerCss = css`
  display: flex;
  align-items: center;
  margin-top: 100rem;
  
  font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 14rem;
letter-spacing: 0.01em;

color: rgba(255, 255, 255, 0.62);


`;
const waitingLeftContainerCss = css`
  display: flex;
  align-items: center;
  gap: 8rem;
`;
const howToDoItTextCss = css`
  margin-left: auto;
`;
const ClockIcon = (props: any) => (
  <svg
    viewBox={"0 0 16 16"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.8 4a.8.8 0 1 0-1.6 0v4a.8.8 0 1 0 1.6 0V4ZM14.195.195a.667.667 0 0 0 0 .943l.667.667a.667.667 0 1 0 .943-.943l-.667-.667a.667.667 0 0 0-.943 0Z"
      fill="#D0D0D0"
    />
  </svg>
)


const headerCss = css`
    display: flex;
    align-items: center;
    width: 100%;
`;
const docsLinkCss =css`
  margin-left: auto;
  display: flex;
  align-items: center;
  font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13rem;
text-align: right;
letter-spacing: 0.03em;

color: #88868B;
:hover {
  opacity: 0.8;
}
`;
const linkBoxCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 500;
font-size: 16px;
text-align: center;
letter-spacing: 0.01em;
padding: 10rem 18rem;
width: 250px;
background: #000;
color: #A864FF;
position: relative;

border: 0.5px solid rgba(255, 255, 255, 0.21);
border-radius: 11px;
`;


const headingCss = css`
font-family: 'Cera Pro';
font-style: normal;
font-weight: 500;
font-size: 18rem;
/* identical to box height */
color: #FFFFFF;
`;
const contentCss = css`
    margin-top: 20px;
    width: 500rem;
    padding-top: 34px;
    transition: height 0.3s;
    overflow: hidden;
`;
const inputFormContainerCss = css`
    display: flex;
    gap: 10px;
    margin-top: 16px;
    width: 100%;
`;
const inputCss = css`
width: 100%; padding: 8px 20px;
background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(0deg, #151516, #151516), #4D4D4D;
border: 0.5px solid rgba(255, 255, 255, 0.4);
box-shadow: 0px 0px 1px 2px rgba(184, 94, 255, 0.03);
border-radius: 8px;
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
caret-color: #BD6FE2;
font-size: 15px;
/* or 93% */


color: rgba(255, 255, 255, 0.71);

`;
const noteCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.03em;
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.35);
`;
const createButtonCss = css`
    padding: 10px 24px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    text-align: center;

    color: #FFFFFF;
    background: linear-gradient(0deg, #151516, #151516), linear-gradient(0deg, #933EFF, #933EFF), #4D4D4D;
    border: 0.5px solid rgba(114, 114, 114, 0.4);
    border-radius: 8px;
    :hover {
        opacity: 0.8;
    }
`;



const ClipboardIcon = (props) => (
    <svg
      css={css`0 0 13 13`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.037 0H4.851a.93.93 0 0 0-.928.929v2.18h4.226c.98 0 1.776.797 1.776 1.776v4.159h2.112a.93.93 0 0 0 .929-.93V.93A.93.93 0 0 0 12.037 0Z"
        fill="#fff"
      />
      <path
        d="M8.149 3.957H.963a.93.93 0 0 0-.929.928v7.186a.93.93 0 0 0 .929.93h7.186a.93.93 0 0 0 .929-.93V4.885a.93.93 0 0 0-.93-.928Z"
        fill="#fff"
      />
    </svg>
  )

export { NoDeveloperInput };
