import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "react-redux";
import { setSelectedProject } from "electron-app/src/store/actions/app";
import { getUserAccountProjects } from "electron-app/src/utils";
import { LoadingScreen } from "../loading";
import { useUser } from "../../api/user/user";

const ProjectsListScreen = () => {
    const { projects, userInfo, error } = useUser();
    const navigate = useNavigate();

	React.useEffect(() => {
		if(projects && !projects.length){
			navigate("/onboarding");
		}
	}, [projects]);
	if(!projects) return (<LoadingScreen />);
    return (
        <CompactAppLayout title={<div css={titleCss}>Select project</div>} footer={<Footer/>}>
            <ProjectList projects={projects} />
        </CompactAppLayout>
    );
}

const titleCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
	margin-left: 36rem;
`;


const ProjectList = ({ projects }) => {
	const navigate = useNavigate();
	const store = useStore();

    const handleProjectItemClick = React.useCallback((projectId) => {
        store.dispatch(setSelectedProject(projectId))
        setTimeout(() => navigate("/"), 50);
    }, []);

    const projectItems = React.useMemo(() => {
        return projects.map((project) => {
            return (
                <li onClick={handleProjectItemClick.bind(this, project.id)}>
                    <span>{project.name}</span>
                </li>
            );
        });
    }, [projects]);

	return (
		<ul css={testItemStyle}>
			{projectItems}
		</ul>
	);
}

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

export { ProjectsListScreen };
