import React from "react";
import { css } from "@emotion/react";
import { SettingsModal, SettingsModalContent } from "../components/toolbar/settingsModal";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { Navigate, useNavigate } from "react-router-dom";


function SettingsScreen() {
    const navigate = useNavigate();
    React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
    }, []);
    
    const handleClose = React.useCallback(() => {
        return navigate("/");
    }, []);
    return (
        <ModelContainerLayout
        // contentStyleCss={css`display: flex; flex-direction: column: flex: 1;`}
        css={css`display: flex; flex: 1; flex-direction: column;`}
        title={(<></>)}
        titleContainerCss={css`margin-left: 38rem;`}
        // footer={userTests && <DashboardFooter projectId={selectedProject} userTests={userTests} />}
    >
        <div css={css`display: flex; flex: 1; flex-direction: column;`}> 
            <SettingsModalContent css={css`display: flex; flex: 1; flex-direction: column; .submit-action-button { margin-top: auto }`} isOpen={true} handleClose={handleClose}/>
        </div>
    </ModelContainerLayout>
    );
}

export default React.memo(SettingsScreen);