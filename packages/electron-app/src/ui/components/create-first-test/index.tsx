import React from "react";
import { css } from "@emotion/react";
import { CreateIcon } from "../../icons";
import { Link } from "../../layouts/modalContainer";
import {Button} from "@dyson/components/atoms/button/Button";
import { shell } from "electron";
import { useNavigate } from "react-router-dom";
import { goFullScreen } from "../../commands/perform";


function Play(props) {
    return (
      <svg
        width={18}
        height={18}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width={18} height={18} rx={9} fill="#A966FF" />
        <rect
          x={0.125}
          y={0.125}
          width={17.75}
          height={17.75}
          rx={8.875}
          stroke="#000"
          strokeOpacity={0.53}
          strokeWidth={0.25}
        />
        <path
          d="M7.963 12.123a.58.58 0 01-.291-.08.67.67 0 01-.324-.582V6.539a.67.67 0 01.324-.582.576.576 0 01.595.007l4.126 2.518a.607.607 0 01.281.518.62.62 0 01-.28.517l-4.128 2.519a.584.584 0 01-.303.087z"
          fill="#fff"
        />
      </svg>
    );
  }

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

            <div css={watch}>
               <Play/> Watch video
            </div>
        </div>
    );
}

const watch = css`
font-size: 14rem;
display: flex;
align-items: center;

column-gap: 8rem;
align-self: center !important;
justify-self: end;

margin-top: 100rem;

:hover{
    color: #a966ff;
text-decoration: underline;
cursor: pointer;
}
`

const createButtonStyle = css`
    margin-left: 12rem;
`;

const containerStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    margin-top: -2rem;

`;
const actionsContainerStyle = css`
    display: flex;
    margin-top:  20rem;
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