import React from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { getCloudUserInfo } from "../commands/perform";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { LoadingScreen } from "./loading";
import { CommonFooter } from "../layouts/commonFooter";
import { CustomCodeModal } from "../components/modals/page/customCodeModal";

function UnDockCodeScreen() {

    return (
      (
        <div css={ css`    height: 100vh;`}>
          <CustomCodeModal isOpen={true} handleClose={() => { } }/>
        </div>
      )
    );
}

const titleStyle = css`
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 500;
    font-size: 13.4px;
    color: #FFFFFF;

`;

const testItemStyle = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.03em;

    color: #FFFFFF;

    li {
        padding: 14px 46px;
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

export { UnDockCodeScreen };
export default React.memo(UnDockCodeScreen);