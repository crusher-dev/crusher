import React from "react";
import { useUser } from "electron-app/src/_ui/hooks/user";
import { SavedTestsList } from "./saved";
import { DraftsList } from "./drafts";

export enum IListTypeEnum {
    DRAFTS = "drafts",
    SAVED = "saved",
};

const DashboardTestsList = () => {
    const [activeSection, setActiveSection] = React.useState(IListTypeEnum.SAVED);
    const { userInfo, projects } = useUser();

    const getContent = () => {
        if(activeSection === IListTypeEnum.DRAFTS) {
            return <DraftsList />;
        }
        return <SavedTestsList />;
    }
    
    return (
        <div>
            {getContent()}
        </div>
    );
};

export { DashboardTestsList };