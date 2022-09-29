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
import { BasketBallIcon, ConsoleIconV3, RocketIcon } from "../../icons";
import { EmojiPicker } from "../../components/emojiPicker";
import Checkbox from "@dyson/components/atoms/checkbox/checkbox";
import { CloudCrusher } from "electron-app/src/lib/cloud";

const CreateProjectBanner = ({ className, ...props }) => {
	return (
		<div css={createProjectBannerContainerCss} className={`${className}`} {...props}>
			<div css={createProjecTitleCss}>
				<RocketIcon css={rocketIconCss} />
				<span css={createProjectTitleTextCss}>Create new project</span>
			</div>
			<div css={createProjectDescriptionCss}>running command in git repo is faster way</div>
			<div css={createProjectActionsCss}>
				<div css={[chooseDirButtonCss, hoverButtonCss]}>Choose dir</div>
				<div css={[runCommandButtonCss, hoverButtonCss]}>
					<ConsoleIconV3 css={consoleIconCss} />
					<span>run command</span>
				</div>
			</div>
		</div>
	);
}

const chooseDirButtonCss = css`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 92px;
	height: 32px;
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	text-align: center;
	color: #FFFFFF;

	background: rgba(53, 53, 53, 0.5);
	border: 0.5px solid rgba(219, 222, 255, 0.16);
	border-radius: 8px;
`;

const runCommandButtonCss = css`
	height: 32px;
	width: 140px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	background: #B12AF0;

	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	text-align: center;

	color: #FFFFFF;
	border-radius: 8px;
`;

const hoverButtonCss = css`
	:hover { 
		opacity: 0.8;
	}
`;
const createProjectActionsCss = css`
	display: flex;
	gap: 8px;
	margin-top: 24px;
	padding-bottom: 36px;
`;
const consoleIconCss = css`
	width: 17px;
	height: 16px;
`;
const createProjectBannerContainerCss = css`
	position: relative;
	z-index: 999;
	background: rgba(12, 12, 12, 1);
	border: 0.5px solid #151515;
	border-radius: 12px;
	width: 100%;
	height: 100%;
	height: 197px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;
const createProjecTitleCss = css`
	display: flex;
	align-items: center;
	margin-right: 12px;
`;
const rocketIconCss = css`width: 20px; height:20px;`;
const createProjectTitleTextCss = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 700;
	font-size: 17px;

	color: #FFFFFF;
	margin-left: 8px;
	margin-bottom: 1px;
`;
const createProjectDescriptionCss = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 400;
	font-size: 12px;

	letter-spacing: 0.03em;
	color: #C5C5C5;
	margin-top: 13px;
`;

const ProjectsListScreen = () => {
	const { projects, userInfo, error } = useUser();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (projects && !projects.length) {
			navigate("/onboarding");
		}
	}, [projects]);
	if (!projects) return (<LoadingScreen />);
	return (
		// <Wrapper figmaUrl={"https://www.figma.com/proto/lK8wsCW8hLzssu5Z987lky/Crusher-%7C-Aug-(Copy)?node-id=2201%3A3868&scaling=scale-down-width&page-id=988%3A3439&starting-point-node-id=988%3A3817"}>
		<CompactAppLayout css={containerCss} title={<div css={titleCss}>Select project</div>} footer={<Footer />}>
			<ProjectList projects={projects} />
			{projects.length < 3 ? (<CreateProjectBanner css={createProjectBannerCss} />) : ""}
		</CompactAppLayout>
		// </Wrapper>
	);
}

const createProjectBannerCss = css`
	position: absolute;
	bottom: 0;
`;
const containerCss = css`
height: 100%;
background: #080809;
padding-top: 8px;
position: relative;
`;

const titleCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
	margin-left: 36rem;
`;


const ProjectItem = ({ project, defaultEmoji }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [emoji, setEmoji] = React.useState(defaultEmoji);

	const handleEmojiSelected = React.useCallback((emoji) => {
		if (emoji) {
			setEmoji(emoji.native);
			CloudCrusher.updateProjectEmoji(project.id, emoji.native);
		}
	}, []);
	return (
		<div css={css`width: 100%; height: 100%; padding: 12px 17px; padding-right: 40px; display: flex; align-items: center;`}>
			<EmojiPicker onEmojiSelected={handleEmojiSelected}>
				<div className={"emoji-block"} css={emojiBlock}>
					{emoji ? (
						<span css={emojiCSS}>{emoji}</span>
					) : (<BasketBallIcon css={css`width: 18px; height: 18px; :hover { opacity: 0.8; }`} />)}
				</div>
			</EmojiPicker>
			<span css={css`margin-left: 13px;`}>{project.name}</span>
		</div>
	);
};

const emojiBlock = css`
display: flex;
min-height: 22px;
min-width: 22px;
align-items: center;
justify-content:center;


border-radius: 6px;
:hover{
	background: rgba(217, 217, 217, 0.12);
	cursor: pointer;
	path{
		stroke: #fff;
	}
}
`
const emojiCSS = css`
font-family: 'EmojiMart';
    display: block;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
	padding-left: 2px;
    line-height: 13px;
`
const ProjectList = ({ projects }) => {
	const navigate = useNavigate();
	const store = useStore();

	const handleProjectItemClick = React.useCallback((projectId, event) => {
		const paths = event.nativeEvent.path;
		const isEmojiClicked = paths.some((path) => path.classList && path.classList.contains("emoji-block"));
		if (isEmojiClicked) return;

		store.dispatch(setSelectedProject(projectId))
		setTimeout(() => navigate("/"), 50);
	}, []);

	const items: Array<any> = React.useMemo(() => {
		return projects.map((project, index) => {
			return {
				id: project.id,
				content: <ProjectItem defaultEmoji={project.emoji} project={project} />
			};
		});
	}, [projects]);

	return (
		<NormalList hideCheckBoxTop={true} onClick={handleProjectItemClick} css={testItemStyle} items={items} />
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
