import React from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { getCloudUserInfo } from "../commands/perform";
import { ModelContainerLayout } from "../layouts/modalContainer";

function ProjectList({userInfo}) {
    const navigate = useNavigate();


    return (
        <ul css={testItemStyle}>
            {userInfo && userInfo.projects ? userInfo.projects.map((project) => {
                return (<li onClick={() => { navigate("/?project_id=" + project.id); }}>
                    <span>{project.name}</span>
                        </li>);
            }) : ""}
        </ul>
    )
}

function SelectProjectScreen() {
    const [userInfo, setUserInfo] = React.useState({});
    const userAccountInfo = useSelector(getUserAccountInfo);

    React.useEffect(() => {
        if(userAccountInfo) {
            getCloudUserInfo().then((userInfo) => {
                setUserInfo(userInfo);
            });
        }
    }, [userAccountInfo]);

    return (
        <ModelContainerLayout title={<div css={titleStyle}>Select your project</div>} footer={null}>
            <ProjectList userInfo={userInfo}/>
        </ModelContainerLayout>
    );
}

const titleStyle = css`
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
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

export { SelectProjectScreen };