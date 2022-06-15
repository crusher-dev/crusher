import React from "react"
import { css } from "@emotion/react";

import { useSelector } from "react-redux";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { getCloudUserInfo } from "../commands/perform";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { LoadingScreen } from "./loading";
import { CommonFooter } from "../layouts/commonFooter";
import { DocsGoBackActionBar } from "../components/create-first-test";
import { useNavigate } from "react-router-dom";

function InsufficientPermissionScreen() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/select-project");
    };

    return (
        <ModelContainerLayout title={<div css={titleStyle}>Home</div>} >
            <div css={containerStyle}>
                <div css={contentHeadingStyle}>Insufficient permission</div>
                <div css={contentDescriptionStyle}>Not part of the team. Request access from admin of this project.</div>
                <DocsGoBackActionBar buttonTitle={"Go back"} buttonCallback={handleGoBack} />
           </div>
        </ModelContainerLayout>
    );
}

const containerStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-bottom: 120rem;
`;

const titleStyle = css`
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 500;
    font-size: 13.4px;
    color: #FFFFFF;

`;

const contentHeadingStyle = css`
    margin-top: 28rem;
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 900;
    font-size: 18rem;
    text-align: center;
    letter-spacing: .1px;
    color: #FFFFFF;
`;
const contentDescriptionStyle = css`
    margin-top: 10rem;

    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 14rem;
    text-align: center;
    letter-spacing: .2px;
    color: rgba(255, 255, 255, 0.64);
`;

const testItemStyle = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #FFFFFF;

    li {
        padding: 14px 24px;
        position: relative;
        .action-buttons {
            display: none;
        }
        :hover {
            background: rgba(217, 217, 217, 0.04);
            color: #9F87FF;
            .action-buttons {
                display: block;
            }
        }
    }
`;

export default React.memo(InsufficientPermissionScreen);