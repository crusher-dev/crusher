import { useProjectTests } from "electron-app/src/_ui/hooks/tests";
import { TestList } from "../testsList";

const DraftsList = () => {
    const { draftTests, deleteDraftTests } = useProjectTests();

    return (
        <TestList deleteTest={deleteDraftTests} tests={draftTests} />
    ); 
};


export { DraftsList }