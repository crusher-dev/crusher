import React from "react";
import { css } from "@emotion/react";
import { CreateIcon } from "../../icons";
import { Link } from "../../layouts/modalContainer";
import {Button} from "@dyson/components/atoms/button/Button";
import { shell } from "electron";
import { callbackify } from "util";
import { useNavigate } from "react-router-dom";
import { goFullScreen } from "../../commands/perform";
const CreateButton = ({title, className, onClick}) => {
    return ( <Button
        id={"verify-save-test"}
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        }}
        className={`${className}`}
        bgColor="tertiary-outline"
        css={saveButtonStyle}
    >
        <span>Create</span>
    </Button>);
};

const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: #A966FF;;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
	}
`;

export const CreateFirstTest = ({}) => {
    const navigate = useNavigate();
    const openDocs = React.useCallback( () => {
        shell.openExternal("https://docs.crusher.dev");
    }, []);

    const handleCreateTest = React.useCallback(()=> {
        navigate("/recorder");
        goFullScreen();
    }, []);
    return (
        <div css={containerStyle}>
            <div css={contentContainerStyle}>
                <CreateIcon css={createIconStyle}/>
                <div css={contentHeadingStyle}>Create your first test</div>
                <div css={contentDescriptionStyle}>Start with low-code browser to create a test</div>
            </div>
            <div css={actionsContainerStyle}>
                <Link onClick={openDocs}>Docs</Link>
                <CreateButton onClick={handleCreateTest} css={createButtonStyle}/>
            </div>
        </div>
    );
}

const createButtonStyle = css`
    margin-left: 20rem;
`;

const containerStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-bottom: 48rem;
`;
const actionsContainerStyle = css`
    display: flex;
    margin-top:  24rem;
    justify-content: center;
    align-items:center;
`;

const contentContainerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const createIconStyle = css`width: 28rem; height: 28rem;`;
const contentHeadingStyle = css`
    margin-top: 24rem;
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 900;
    font-size: 18rem;
    text-align: center;

    color: #FFFFFF;
`;
const contentDescriptionStyle = css`
    margin-top: 8rem;

    font-family: Gilroy;
    font-style: normal;
    font-weight: 400;
    font-size: 14rem;
    text-align: center;

    color: rgba(255, 255, 255, 0.64);
`;