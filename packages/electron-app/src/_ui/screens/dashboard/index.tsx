import React from "react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { useSelector } from "react-redux";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { useNavigate } from "react-router-dom";
import { CreateFirstTest } from "./createFirstTest";
import { getSelectedProjectTests } from "electron-app/src/utils";
import { TestList } from "./testsList";
import { DashboardFooter } from "./footer";

const DashboardScreen = () => {
    const selectedProject = useSelector(getCurrentSelectedProjct);
    const [tests, setTests] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!selectedProject)
            navigate("/select-project");

        getSelectedProjectTests().then((res) => {
            setTests(res.list);
        });
    }, [selectedProject]);

    return (
        <CompactAppLayout footer={<DashboardFooter tests={tests || []}/>}>
               {tests ? (<TestList tests={tests}/>) : (<CreateFirstTest />)}
        </CompactAppLayout>
    );
};

export { DashboardScreen };