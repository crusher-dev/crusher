import React from "react";
import { useUser } from "electron-app/src/_ui/hooks/user";
import { SavedTestsList } from "./saved";
import { DraftsList } from "./drafts";
import { css } from "@emotion/react";
import { useProjectTests } from "electron-app/src/_ui/hooks/tests";
import { ClipboardIcon } from "electron-app/src/_ui/constants/icons";
import { CreateFirstTest } from "../containers/createFirstTest";

export enum IListTypeEnum {
    DRAFTS = "drafts",
    SAVED = "saved",
};

const DashboardTestsList = () => {
    const [activeSection, setActiveSection] = React.useState(IListTypeEnum.SAVED);
    const { userInfo, projects } = useUser();
    const { tests, draftTests } = useProjectTests();

    const getContent = () => {
        if(activeSection === IListTypeEnum.DRAFTS) {
            return <DraftsList />;
        }
        return <SavedTestsList />;
    }
    
    const listHeading = (
        <div className={"flex items-center"} css={css`color: #fff; font-size: 14rem; position: absolute; left: 48rem;`}>
            <div css={[headingCss, hoverTab, activeSection === IListTypeEnum.DRAFTS ? notSelectedTextCss : undefined]} onClick={setActiveSection.bind(this, IListTypeEnum.SAVED)}>
                {tests?.length} tests
            </div>
            {draftTests?.length ? (
                <div css={[hoverTab]} className={"flex items-center ml-16"} onClick={setActiveSection.bind(this, IListTypeEnum.DRAFTS)}>
                    <ClipboardIcon css={[css`path { fill: #4A4A4A}`, activeSection === IListTypeEnum.DRAFTS ? css`path { fill: rgba(255, 255, 255, 0.83) }` : undefined]} />
                    <span className={"ml-8"} css={[draftHeadingCss, activeSection === IListTypeEnum.SAVED ? notSelectedTextCss : undefined]}>{draftTests?.length} drafts</span>
                </div>
            ) : null}
        </div>
    );

    return (
        <div>
            {listHeading}
            {!tests.length && activeSection === IListTypeEnum.SAVED ? (
                <div css={createFirstTestContainerCss}>
                    <CreateFirstTest/>
                </div>
            ): getContent()}
        </div>
    );
};

const createFirstTestContainerCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 50%;
    transform: translateY(50%);
`;

const hoverTab = css`
	&:hover {
		opacity: 0.8;
	}
`;
const headingCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 14rem;
letter-spacing: 0.03em;
color: rgba(255, 255, 255, 0.83);
`;
const draftHeadingCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	letter-spacing: 0.03em;
	color: rgba(255, 255, 255, 0.83);
`;

const notSelectedTextCss = css`
color: #A6A6A6;
`;
export { DashboardTestsList };