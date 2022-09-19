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
import { ListBox } from "../../components/selectableList";
import { NormalList } from "../../components/NormalList";
import Wrapper from "figma-design-scaler/dist/dist/main";

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
		// <Wrapper figmaUrl={"https://www.figma.com/proto/MsJZCnY5NvrDF4kL1oczZq/Crusher-%7C-Aug?node-id=1638%3A5550&scaling=min-zoom&page-id=988%3A3439&starting-point-node-id=988%3A3817"}>
			<CompactAppLayout css={containerCss} title={<div css={titleCss}>Select project</div>} footer={<Footer/>}>
				<ProjectList projects={projects} />
			</CompactAppLayout>
		// </Wrapper>
    );
}
const containerCss = css`
background: #080809;
padding-top: 8px;
`;

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
	    
    const items: Array<any> = React.useMemo(() => {
        return projects.map((project, index) => {
            return {
                id: project.id,
                content: (
							<div css={css`width: 100%; height: 100%; padding: 14px 46px; padding-right: 40px;`}>{project.name}</div>
                )
            };
        });
    }, [projects]);

	return (
		<NormalList onClick={handleProjectItemClick} css={testItemStyle} items={items} />
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
