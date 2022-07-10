import React from "react";
import {css } from "@emotion/react";
import { useAtom } from "jotai";
import { userAtom } from "@store/atoms/global/user";
import { projectsAtom } from "@store/atoms/global/project";
import { updateMeta } from "@store/mutators/metaData";
import { USER_META_KEYS } from "@constants/USER";
import { useRouter } from "next/router";
import { appStateItemMutator } from "@store/atoms/global/appState";

const ProjectList = ({className, projects, ...props}) => {
	const [, updateOnboarding] = useAtom(updateMeta);
	const [, setAppStateItem] = useAtom(appStateItemMutator);
  const router = useRouter();
  
  const handleProjectItemClick = React.useCallback((projectId)=>{
      updateOnboarding({
        type: "user",
        key: USER_META_KEYS.SELECTED_PROJECT_ID,
        value: projectId,
      });
      updateOnboarding({
        type: "user",
        key: USER_META_KEYS.INITIAL_ONBOARDING,
        value: true,
      });
      setAppStateItem({ key: "selectedProjectId", value: projectId });
      router.push("/app/dashboard");
  }, []);

  const projectItems = React.useMemo(() => {
        return projects.map((project, index)  => {
            return (
                <li key={index} css={listItemCss} onClick={handleProjectItemClick.bind(this, project.id)}>
                    <div css={itemHeadingCss}>{project.name}</div>
                    <div css={itemDescriptionCss}>with recorder you can create and run test</div>
                </li>
            )
        });
    }, [projects]);

    return (
        <ul css={ulListCss} className={`${className}`}>
            {projectItems}
        </ul>
    );
}

const itemHeadingCss = css`
font-family: 'Cera Pro';
font-style: normal;
font-weight: 500;
font-size: 17rem;

color: #FFFFFF;
`;

const itemDescriptionCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 12rem;
letter-spacing: 0.03em;

color: rgba(255, 255, 255, 0.35);
margin-top: 4rem;
`;
const ulListCss = css`
  background: rgba(217, 217, 217, 0.03);
  border-radius: 12px;

  li:not(:first-child) {
    border-top-color: rgba(217, 217, 217, 0.1);
    border-top-style: solid;
    border-top-width: 0.5px;
  }
`;

const listItemCss = css`
  padding: 14rem 24rem;
  :hover {
    opacity: 0.8;
  }
`;

const SAMPLE_PROJECTS = [{
    id: 1,
    name: "crusher"
}, {
    id: 2,
    name: "docs"
}];

const SelectProjectContainer = () => {
    const mainRef = React.useRef(null);
	const [projects, setProjectsAtom] = useAtom(projectsAtom);

    const projectsArr = React.useMemo(() => {
        return projects.map((project) => ({
            id: project.id,
            name: project.name,
        }))
    }, [projects]);

    return (
        <div className="flex mt-60 flex-col">

        <div ref={mainRef} css={[contentCss]}>

            <div css={mainContainerCss}>
                    <div css={titleContainerCss}>
                            <div css={headingCss}>Select project</div>
                            <div css={titleTaglineCss}>We found some existing projects</div>
                    </div>

                        <div css={downloadButtonContainerCss}>
                                <div css={downloadButtonCss}>
                                    new
                                    <AddIcon css={addIconCss}/>
                                </div>
                        </div>
            </div>

            <div css={listCss}>
                <div css={projectHeadingTextCss}>Projects (01/10)</div>
                <ProjectList css={projectListContainerCss} projects={projectsArr}/>
            </div>
        </div>
        </div>
    );
}

const listCss = css`
  margin-top: 48rem;
`;

const projectHeadingTextCss = css`
  font-family: 'Gilroy';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  color: rgba(255, 255, 255, 0.54);
`;

const projectListContainerCss = css`margin-top: 22rem;`;

const AddIcon = (props) => (
    <svg
      viewBox={"0 0 13 13"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.15 4.55a.65.65 0 0 0-1.3 0v1.3h-1.3a.65.65 0 1 0 0 1.3h1.3v1.3a.65.65 0 1 0 1.3 0v-1.3h1.3a.65.65 0 1 0 0-1.3h-1.3v-1.3ZM3.413.252C4.257.064 5.28 0 6.5 0c1.22 0 2.243.064 3.087.252.852.19 1.56.512 2.104 1.057.545.544.868 1.252 1.057 2.104.188.844.252 1.868.252 3.087 0 1.22-.065 2.243-.252 3.087-.19.852-.512 1.56-1.057 2.104-.544.545-1.252.868-2.104 1.057C8.743 12.936 7.72 13 6.5 13c-1.22 0-2.243-.065-3.087-.252-.852-.19-1.56-.512-2.104-1.057C.764 11.147.44 10.44.252 9.587.064 8.743 0 7.72 0 6.5c0-1.22.064-2.243.252-3.087.19-.852.512-1.56 1.057-2.104C1.853.764 2.56.44 3.413.252Z"
        fill="#fff"
      />
    </svg>
  )

const addIconCss = css`
    width: 13rem;
`;

const downloadButtonCss = css`
    background: linear-gradient(0deg, #9651EF, #9651EF), linear-gradient(0deg, #8C45E8, #8C45E8), #BC66FF;
    border: 0.5px solid rgba(169, 84, 255, 0.4);
    border-radius: 8px;
    font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 14rem;
text-align: center;

color: #FFFFFF;
display: flex;
gap: 10rem;
padding: 8rem 10rem;
:hover { opacity: 0.8; }
`;
const DownloadIcon = (props) => (
    <svg
      width={15}
      height={14}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.564.186C3.172.046 3.896 0 4.734 0h1.212C6.7 0 7.401.39 7.818 1.039l.61.948c.139.216.373.346.623.346h3.791c1.198 0 2.17.981 2.158 2.244-.014 1.505-.002 3.01-.002 4.514 0 .868-.044 1.619-.18 2.25-.136.639-.377 1.2-.801 1.641-.425.44-.967.69-1.584.832-.607.14-1.331.186-2.169.186h-5.53c-.838 0-1.562-.046-2.17-.186-.616-.142-1.158-.391-1.583-.832-.425-.44-.665-1.002-.802-1.642C.044 10.71 0 9.96 0 9.09V4.91c0-.869.044-1.62.179-2.25.137-.64.377-1.202.802-1.642.425-.44.967-.69 1.583-.832ZM8.25 6.222a.764.764 0 0 0-.75-.778.764.764 0 0 0-.75.778v2.4l-.595-.616a.731.731 0 0 0-1.06 0 .798.798 0 0 0 0 1.1L6.922 11a.94.94 0 0 0 .024.025.736.736 0 0 0 .553.252.736.736 0 0 0 .552-.252.94.94 0 0 0 .025-.025l1.828-1.895a.798.798 0 0 0 0-1.1.731.731 0 0 0-1.06 0l-.595.616v-2.4Z"
        fill="#fff"
      />
    </svg>
  )

const mainContainerCss = css`display: flex; align-items: center;`;
const downloadButtonContainerCss = css`margin-left: auto`;
const titleContainerCss = css`
    display: flex;
    flex-direction: column;
`;

const titleTaglineCss = css`
    margin-top: 6rem;
    font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 12rem;
letter-spacing: 0.03em;

color: rgba(255, 255, 255, 0.35);

`;



const clockIconCss = css`
  width: 16rem;
`;
const waitinContainerCss = css`
  display: flex;
  align-items: center;
  margin-top: 100rem;
  
  font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 14rem;
letter-spacing: 0.01em;

color: rgba(255, 255, 255, 0.62);


`;
const waitingLeftContainerCss = css`
  display: flex;
  align-items: center;
  gap: 8rem;
`;
const howToDoItTextCss = css`
  margin-left: auto;
`;
const ClockIcon = (props: any) => (
  <svg
    viewBox={"0 0 16 16"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.8 4a.8.8 0 1 0-1.6 0v4a.8.8 0 1 0 1.6 0V4ZM14.195.195a.667.667 0 0 0 0 .943l.667.667a.667.667 0 1 0 .943-.943l-.667-.667a.667.667 0 0 0-.943 0Z"
      fill="#D0D0D0"
    />
  </svg>
)



const headingCss = css`
font-family: 'Cera Pro';
font-style: normal;
font-weight: 500;
font-size: 18rem;
/* identical to box height */
color: #FFFFFF;
`;
const contentCss = css`
    margin-top: 20px;
    width: 500rem;
    padding-top: 34px;
    transition: height 0.3s;
    overflow: hidden;
`;

export { SelectProjectContainer };
