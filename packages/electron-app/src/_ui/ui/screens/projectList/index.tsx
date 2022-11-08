import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { Footer } from "../../layout/Footer";
import { useNavigate } from "react-router-dom";
import { useStore } from "react-redux";
import { setSelectedProject } from "electron-app/src/store/actions/app";
import { LoadingScreen } from "../loading";
import { useUser } from "../../../api/user/user";
import { NormalList } from "../../components/NormalList";
import { BasketBallIcon, ConsoleIconV3 } from "../../../constants/icons";
import { EmojiPicker } from "../../components/emojiPicker";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { remote } from "electron";
import { ClipboardIcon } from "../authOnboarding";
import { LinkBox } from "../../components/LinkBox";
import { sendSnackBarEvent } from "../../containers/components/toast";

const CreateProjectBanner = ({ className, ...props }) => {
	const [showCommand, setShowCommand] = React.useState(false);

	const handleChooseDir = () => {
		remote.dialog.showOpenDialog({
			title: "Select your git repo",
			properties: ['openDirectory']
		}).then((res) => {
			console.log("Res is", res);
		});
	};

	const handleCopyCommand = () => {
		remote.clipboard.write({text: "npx crusher.dev init"}, "clipboard");
		sendSnackBarEvent({ type: "success", message: `Copied to clipboard!` });
	};

	return (
		<div css={createProjectBannerContainerCss} className={String(className)} {...props}>
			<div css={createProjecTitleCss}>
				<span css={createProjectTitleTextCss}>Create new project</span>
				
			</div>
			<div css={createProjectDescriptionCss}>running command in git repo is faster way</div>

			{ showCommand ? (
				<div css={css`position: relative;`}>
					<LinkBox css={linkBoxCss} className={"mt-16"} value="npx crusher.dev init">
					
					</LinkBox>	
					<ClipboardIcon
						onClick={handleCopyCommand}
								css={css`
									width: 13px;
									height: 13px;
									position: absolute;
									right: 13px;
									top: 55%;
									:hover {
										opacity: 0.8;
									}
								`}
							/>
				</div>
				

			) : <>
			<div css={createProjectActionsCss}>
				<div css={[chooseDirButtonCss, hoverButtonCss]} onClick={handleChooseDir}>Choose dir</div>
				<div onClick={setShowCommand.bind(this, true)} css={[runCommandButtonCss, hoverButtonCss]}>
					<ConsoleIconV3 css={consoleIconCss} />
					<span>run command</span>
				</div>
			</div></>}
		
		</div>
	);
};
const linkBoxCss = css`
	font-weight: 500;
	font-size: 16px;
	text-align: center;
	letter-spacing: 0.01em;
	padding: 10rem 18rem;
	width: 250px;
	background: #000;
	color: #a864ff;
	position: relative;
`;

const chooseDirButtonCss = css`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 92px;
	height: 32px;

	font-weight: 600;
	font-size: 14px;
	text-align: center;
	color: #ffffff;

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
	background: #b12af0;

	font-weight: 600;
	font-size: 14px;
	text-align: center;

	color: #ffffff;
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
const createProjectTitleTextCss = css`
	font-weight: 700;
	font-size: 17px;

	color: #ffffff;
	margin-left: 8px;
	margin-bottom: 1px;
`;
const createProjectDescriptionCss = css`
	font-size: 12px;

	letter-spacing: 0.03em;
	color: #c5c5c5;
	margin-top: 13px;
`;

const ProjectsListScreen = () => {
	const { projects } = useUser();
	const navigate = useNavigate();
	React.useEffect(() => {
		if (projects && !projects.length) {
			navigate("/onboarding");
		}
	}, [projects]);
	if (!projects) return <LoadingScreen />;
	return (
		// <Wrapper figmaUrl={"https://www.figma.com/proto/lK8wsCW8hLzssu5Z987lky/Crusher-%7C-Aug-(Copy)?node-id=2201%3A3868&scaling=scale-down-width&page-id=988%3A3439&starting-point-node-id=988%3A3817"}>
		// </Wrapper>
		<CompactAppLayout css={containerCss} title={"Project list"} footer={<Footer />}>
			<ProjectList projects={projects} />
			{projects.length < 3 ? <CreateProjectBanner css={createProjectBannerCss} /> : ""}
		</CompactAppLayout>
	);
};

const createProjectBannerCss = css`
	position: absolute;
	bottom: 0;
`;
const containerCss = css`
	height: 100%;
	background: #080808;
	position: relative;
`;

const ProjectItem = ({ project, defaultEmoji }) => {
	const [emoji, setEmoji] = React.useState(defaultEmoji);

	const handleEmojiSelected = React.useCallback((emoji) => {
		if (emoji) {
			setEmoji(emoji.native);
			CloudCrusher.updateProjectEmoji(project.id, emoji.native);
		}
	}, []);
	return (
		<div
			css={css`
				width: 100%;
				height: 100%;
				padding: 12px 17px;
				padding-right: 40px;
				display: flex;
				align-items: center;
			`}
		>
			<EmojiPicker onEmojiSelected={handleEmojiSelected}>
				<div className={"emoji-block"} css={emojiBlock}>
					{emoji ? (
						<span css={emojiCSS}>{emoji}</span>
					) : (
						<BasketBallIcon
							css={css`
								width: 18px;
								height: 18px;
								:hover {
									opacity: 0.8;
								}
							`}
						/>
					)}
				</div>
			</EmojiPicker>
			<span
				css={css`
					margin-left: 13px;
				`}
			>
				{project.name}
			</span>
		</div>
	);
};

const emojiBlock = css`
	display: flex;
	min-height: 22px;
	min-width: 22px;
	align-items: center;
	justify-content: center;

	border-radius: 6px;
	:hover {
		background: rgba(217, 217, 217, 0.12);
		cursor: pointer;
		path {
			stroke: #fff;
		}
	}
`;
const emojiCSS = css`
	font-family: "EmojiMart";
	display: block;
	font-size: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 2px;
	padding-left: 2px;
	line-height: 13px;
`;
const ProjectList = ({ projects }) => {
	const navigate = useNavigate();
	const store = useStore();

	const handleProjectItemClick = React.useCallback((projectId, event) => {
		const paths = event.nativeEvent.path;
		const isEmojiClicked = paths.some((path) => path.classList?.contains("emoji-block"));
		if (isEmojiClicked) return;

		store.dispatch(setSelectedProject(projectId));
		setTimeout(() => navigate("/"), 50);
	}, []);

	const items: any[] = React.useMemo(() => {
		return projects.map((project) => {
			return {
				id: project.id,
				content: <ProjectItem defaultEmoji={project.emoji} project={project} />,
			};
		});
	}, [projects]);

	return <NormalList hideCheckBoxTop={true} onClick={handleProjectItemClick} css={testItemStyle} items={items} />;
};

const testItemStyle = css`
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
