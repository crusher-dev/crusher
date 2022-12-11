import { useProjectTests } from "electron-app/src/_ui/hooks/tests";
import { TestList } from "../testsList";

const SavedTestsList = () => {
    const { tests, deleteTests } = useProjectTests();

    return (
        <TestList deleteTest={deleteTests} tests={tests} />
    ); 
};


export { SavedTestsList }