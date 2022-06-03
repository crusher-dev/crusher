import React from "react";
import { css } from "@emotion/react";
import { CrusherIcon, LoadingIconV2 } from "../icons";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { CommonFooter } from "../layouts/commonFooter";
import { useInView } from "react-intersection-observer";
function LoadingProgressBar() {
    const {ref, inView } = useInView();

    return (
        <div ref={ref} css={loadingProgressBarContainerStyle}>
            <div css={progressBarStyle}>
                <div css={[progressPilStyle, inView ? css`width: 100%` : undefined]}></div>
            </div>
            <div css={loadingTextStyle}>loading crusher..</div>
        </div>
    )
};

const loadingTextStyle = css`
font-family: Gilroy;
font-style: normal;
font-weight: 700;
font-size: 16px;
margin-top: 16rem;

text-align: center;

color: #FFFFFF;
`;
const loadingProgressBarContainerStyle = css`
    display: flex;
    flex-direction: column;

`;
const progressBarStyle = css`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 0;
    width: 168px;
    height: 6px;
`;
const progressPilStyle = css`
    background: linear-gradient(180deg, rgba(230, 199, 255, 0) 0%, rgba(43, 37, 48, 0.03) 75.52%, rgba(0, 0, 0, 0.34) 100%), #C96AF5;
    border-radius: 4px;
    width: 1%;
    transition-timing-function: ease;
    height: 100%;
    transition: width .85s;
`;

function LoadingScreen() {
    React.useEffect(() => {
        document.querySelector("html").style.fontSize = "1px";
    }, []);
    return (
        <ModelContainerLayout isLoadingScreen={true} title={null} header={null} footer={<CommonFooter/>}>
    <div css={containerStyle}>
            <div css={css`flex: 1; display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;`}>
               <LoadingProgressBar/>
            </div>
        </div>
        </ModelContainerLayout>

    )
}

const navBarStyle = css`
display: flex;
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 16px;

color: #FFFFFF;
z-index: 99;
width: 100%;
.navItem {
    :hover {
        opacity: 0.8;
    }
}
`;

const footerStyle = css`
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 28px;
`;

const containerStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #161617;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
`;

const statusTextStyle = css`
    margin-top: 20px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 16rem;

    position: relative;
    left: 8rem;
`;

export { LoadingScreen };