import React from "react";
import { css } from "@emotion/react";
import { Link, ModelContainerLayout } from "../layouts/modalContainer";
import { LinkBox } from "./login";
import { performCreateCloudProject } from "../commands/perform";
import { useNavigate } from "react-router-dom";
import { useStore } from "react-redux";
import { setSelectedProject } from "electron-app/src/store/actions/app";
import { getUserAccountProjects } from "electron-app/src/utils";

const Footer = () => {
	return (
		<div css={footerContainerCss}>
			<div css={footerContentCss}>
				<Link css={footerLinkCss}>Docs</Link>
				<Link css={footerLinkCss}>FAQs</Link>
			</div>
		</div>
	);
};

const footerContainerCss = css`
	display: flex;
	justify-content: center;
	width: 100%;
	padding-bottom: 12px;
`;
const footerContentCss = css`
	display: flex;
	gap: 60rem;
`;
const footerLinkCss = css`
	font-weight: 500;
	font-size: 14.5px;
	line-height: 16px;
	letter-spacing: 0.03em;

	color: #ffffff;
`;

const YesNoButtons = ({ className, selected, callback, ...props }: { className?: any; selected: any; callback: any }) => {
	const handleSelect = React.useCallback((value) => {
		callback(value);
	}, []);

	return (
		<div css={yesNoButtonContainerCss} className={String(className)} {...props}>
			<div css={[yesNoButtonCss, selected === "YES" ? selectedButtonCss : undefined]} onClick={handleSelect.bind(this, "YES")}>
				{selected === "YES" ? <SelectedIcon css={selectedIconCss} /> : ""}
				<span>Yes</span>
			</div>
			<div css={[yesNoButtonCss, selected === "NO" ? selectedButtonCss : undefined]} onClick={handleSelect.bind(this, "NO")}>
				{selected === "NO" ? <SelectedIcon css={selectedIconCss} /> : ""}
				<span>No</span>
			</div>
		</div>
	);
};

const selectedIconCss = css`
	width: 12px;
	height: 12px;
	position: relative;
	top: 1.4px;
`;

const SelectedIcon = (props) => (
	<svg viewBox={"0 0 12 12"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6Zm8.224-1.624a.6.6 0 0 1 0 .848l-2.21 2.21a.87.87 0 0 1-1.229 0l-1.01-1.01a.6.6 0 1 1 .85-.848l.775.775 1.976-1.975a.6.6 0 0 1 .848 0Z"
			fill="#fff"
		/>
	</svg>
);

const selectedButtonCss = css`
	background: linear-gradient(0deg, #9651ef, #9651ef), linear-gradient(0deg, #8c45e8, #8c45e8), #bc66ff;
	border: 1px solid rgba(169, 84, 255, 0.4);
	gap: 8px;
	:hover {
		opacity: 1;
	}
`;
const yesNoButtonContainerCss = css`
	display: flex;
	gap: 12px;
`;

const yesNoButtonCss = css`
	border: 0.5px solid #212121;
	border-radius: 23423px;

	font-weight: 600;
	font-size: 14px;
	text-align: center;

	color: #ffffff;
	padding: 6px 4px;
	width: 116px;
	display: flex;
	justify-content: center;

	:hover {
		opacity: 0.8;
	}
`;

const ProjectInput = () => {
	const mainRef = React.useRef(null);
	const inputRef: React.Ref<HTMLInputElement> = React.useRef(null);
	const navigate = useNavigate();
	const store = useStore();

	React.useEffect(() => {
		setTimeout(() => {
			mainRef.current.style.height = "200px";
		}, 0);
	}, []);

	const handleCreate = React.useCallback(() => {
		const projectName = inputRef.current.value;
		performCreateCloudProject(projectName).then((res) => {
			if (res) {
				const projectId = res.id;
				store.dispatch(setSelectedProject(projectId));
				navigate("/");
			}
		});
	}, []);

	return (
		<div ref={mainRef} css={[contentCss]}>
			<div css={headingCss}>Create a project</div>
			<div css={inputFormContainerCss}>
				<input ref={inputRef} placeholder="pied piper?" css={inputCss} />
				<div css={createButtonCss} onClick={handleCreate}>
					Create
				</div>
			</div>
			<div css={noteCss}>later developer can to integrate with workflow</div>
		</div>
	);
};

const DeveloperInput = () => {
	const mainRef = React.useRef(null);
	const navigate = useNavigate();
	const store = useStore();

	React.useEffect(() => {
		const pollInterval = setInterval(() => {
			getUserAccountProjects().then((res) => {
				if (res?.projects?.length) {
					// Select the first project
					store.dispatch(setSelectedProject(res.projects[0].id));
					navigate("/");
				}
			});
		}, 5000);
		setTimeout(() => {
			mainRef.current.style.height = "200px";
		}, 0);

		return () => {
			clearInterval(pollInterval);
		};
	}, []);

	return (
		<div ref={mainRef} css={[contentCss]}>
			<div css={headingCss}>Add crusher to your project</div>
			<div css={inputFormContainerCss}>
				<LinkBox css={linkBoxCss} value="npx crusher-cli init">
					<ClipboardIcon
						css={css`
							width: 13px;
							height: 13px;
							position: absolute;
							right: 13px;
							top: 13px;
							:hover {
								opacity: 0.8;
							}
						`}
					/>
				</LinkBox>
			</div>
			<div
				css={[
					noteCss,
					css`
						font-size: 14px;
						padding-left: 2px;
						margin-top: 10px;
					`,
				]}
			>
				Run in git repo
			</div>
		</div>
	);
};

const ClipboardIcon = (props) => (
	<svg css={css`0 0 13 13`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M12.037 0H4.851a.93.93 0 0 0-.928.929v2.18h4.226c.98 0 1.776.797 1.776 1.776v4.159h2.112a.93.93 0 0 0 .929-.93V.93A.93.93 0 0 0 12.037 0Z"
			fill="#fff"
		/>
		<path d="M8.149 3.957H.963a.93.93 0 0 0-.929.928v7.186a.93.93 0 0 0 .929.93h7.186a.93.93 0 0 0 .929-.93V4.885a.93.93 0 0 0-.93-.928Z" fill="#fff" />
	</svg>
);

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

const createButtonCss = css`
	padding: 10px 24px;

	font-weight: 600;
	font-size: 14px;
	text-align: center;

	color: #ffffff;
	background: linear-gradient(0deg, #151516, #151516), linear-gradient(0deg, #933eff, #933eff), #4d4d4d;
	border: 0.5px solid rgba(114, 114, 114, 0.4);
	border-radius: 8px;
	:hover {
		opacity: 0.8;
	}
`;
const inputCss = css`
	width: 100%;
	padding: 8px 20px;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(0deg, #151516, #151516), #4d4d4d;
	border: 0.5px solid rgba(255, 255, 255, 0.4);
	box-shadow: 0px 0px 1px 2px rgba(184, 94, 255, 0.03);
	border-radius: 8px;

	caret-color: #bd6fe2;
	font-size: 15px;
	/* or 93% */

	color: rgba(255, 255, 255, 0.71);
`;
const inputFormContainerCss = css`
	display: flex;
	gap: 10px;
	margin-top: 16px;
	width: 100%;
`;

const noteCss = css`
	font-size: 12px;
	letter-spacing: 0.03em;
	margin-top: 20px;
	color: rgba(255, 255, 255, 0.35);
`;

const AuthOnboardingScreen = () => {
	const [selected, setSelected] = React.useState("YES");

	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);
	return (
		<ModelContainerLayout footer={<Footer />} footerCss={footerCss}>
			<div css={containerCss}>
				<div
					css={[
						developerQuestionCss,
						selected
							? css`
									transform: translate(0, -140px);
							  `
							: undefined,
					]}
				>
					<div css={headingCss}>Are you a developer?</div>
					<YesNoButtons selected={selected} callback={setSelected.bind(this)} css={developerActionButtonsCss} />
				</div>

				{selected === "NO" ? <ProjectInput /> : ""}
				{selected === "YES" ? <DeveloperInput /> : ""}
			</div>
		</ModelContainerLayout>
	);
};

const developerActionButtonsCss = css`
	margin-top: 20px;
`;
const containerCss = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 90%;
`;
const developerQuestionCss = css`
	border-bottom-color: rgba(255, 255, 255, 0.04);
	border-bottom-style: solid;
	border-bottom-width: 1px;
	padding-top: 20px;
	padding-bottom: 22px;
	width: 350px;
	transition: transform 0.3s;
`;

const headingCss = css`
	font-family: "Cera Pro";

	font-weight: 900;
	font-size: 18px;
	/* identical to box height */

	letter-spacing: -0.02em;

	color: #ffffff;
`;
const footerCss = css`
	border-top: none !important;
`;
const contentCss = css`
	margin-top: 20px;
	width: 350px;
	padding-top: 28px;
	height: 0px;
	transition: height 0.3s;
	overflow: hidden;
	position: absolute;
`;

export { AuthOnboardingScreen };
