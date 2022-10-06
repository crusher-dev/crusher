import React from "react";
import { atom } from "jotai";

interface IContextNenuItem{ 
    id: string;
    label: string;
    shortcut: any;
}

interface IProps {
    deleteTestsCallback: (testIds: string[]) => void;
    contextMenu?: {[type: any] : {callback: any, menuItems: IContextNenuItem[]}};
    contextMenuCallback: (testIds: string[], selectedTests: any[]) => void;
    tests: Array<{
        id: string;
        emoji?: string;
        testName: string;
        firstRunCompleted: boolean;   
    }>;
}

export const editInputAtom = atom<any | null>(null);

const TestsList = ({ contextMenu, deleteTestsCallback, tests }: IProps) => {
    const items = React.useMemo(() => {
        if (!tests) return null;
        return tests.map((test) => {
            return {
                id: test.id,
                content: (isItemSelected: boolean) => (
                    <TestListItem
                        key={test.id}
                        id={test.id}
                        isItemSelected={isItemSelected}
                        test={test}
                        deleteTestCallback={deleteTestsCallback}
                    />
                ),
            };
        });
    }, [tests]);

    return (
        <List
    )
};

const SelectedTestActions = () => {
    return null;
};

const TestListItem = ({id, isItemSelected, test, deleteTestCallback}) => {
    return null;  
}
