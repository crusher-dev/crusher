import React from "react";
import { css } from "@emotion/react";
import { CrusherIcon, LoadingIconV2 } from "../icons";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { CommonFooter } from "../layouts/commonFooter";

function LoadingScreen() {
    React.useEffect(() => {
        document.querySelector("html").style.fontSize = "1px";
    }, []);
    return (
        <ModelContainerLayout title={null} header={null} footer={<CommonFooter/>}>
    <div css={containerStyle}>
            <div css={css`flex: 1; display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;`}>
                <CrusherIcon css={css`width: 128px;`}/>
                <div css={statusTextStyle}>
                    <div css={css`position: relative; top: 1rem;`}>Setting up crusher for you...</div>
                    {/* <LoadingIconV2 css={css`width: 24rem; height: 24rem;`}/> */}
                </div>
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