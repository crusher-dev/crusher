import React from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { getCloudUserInfo } from "../commands/perform";
import { ModelContainerLayout } from "../layouts/modalContainer";
import { LoadingScreen } from "./loading";
import { CommonFooter } from "../layouts/commonFooter";

function ProjectList({ userInfo }) {
	const navigate = useNavigate();

	return (
		<ul css={testItemStyle}>
			{userInfo && userInfo.projects
				? userInfo.projects.map((project) => {
						return (
							<li
								onClick={() => {
									window.localStorage.setItem("projectId", project.id);
									navigate("/?project_id=" + project.id);
								}}
							>
								<span>{project.name}</span>
							</li>
						);
				  })
				: ""}
		</ul>
	);
}

function SelectProjectScreen() {
	const [userInfo, setUserInfo] = React.useState(null);
	const userAccountInfo = useSelector(getUserAccountInfo);

	React.useEffect(() => {
		if (userAccountInfo) {
			getCloudUserInfo().then((userInfo) => {
				setUserInfo(userInfo);
			});
		}
	}, [userAccountInfo]);

	if (!userAccountInfo || !userInfo) {
		return <LoadingScreen />;
	}

	return (
		<ModelContainerLayout title={<div css={titleStyle}>Select project</div>} footer={<CommonFooter />}>
			<ProjectList userInfo={userInfo} />
		</ModelContainerLayout>
	);
}

const titleStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
`;

const testItemStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	letter-spacing: 0.03em;

	color: #ffffff;

	li {
		padding: 14px 24px;
		position: relative;
		.action-buttons {
			display: none;
		}
		:hover {
			background: rgba(217, 217, 217, 0.04);
			color: #9f87ff;
			.action-buttons {
				display: block;
			}
		}
	}
`;

export { SelectProjectScreen };
