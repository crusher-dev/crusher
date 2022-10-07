import React from "react";
import { ListBox } from "../../molecules/SelectableList";
import { SelectedTestActions } from "./header";
import { TestListItem } from "./item";

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

    onEdit?: (selectedList: Array<string>) => void;
    onDelete?: (selectedList: Array<string>) => void;
    onRename?: (selectedList: Array<string>) => void;
}

const TestsList = ({ contextMenu, deleteTestsCallback, onEdit, onDelete, onRename, tests }: IProps) => {
    const items = React.useMemo(() => {
        if (!tests) return null;
        return tests.map((test) => {
            return {
                id: test.id,
                content: (isItemSelected: boolean) => (
                    <TestListItem
                        key={test.id}
                        id={test.id}
                        onEdit={onEdit}
                        onRename={onRename}
                        onDelete={onDelete}
                        isItemSelected={isItemSelected}
                        test={test}
                        deleteTestCallback={deleteTestsCallback}
                    />
                ),
            };
        });
    }, [tests]);

    return (
        <ListBox
            contextMenu={contextMenu}
            selectedHeaderActions={SelectedTestActions}
            headerProps={{ onEdit: onEdit, onDelete: onDelete, onRename: onRename }}
            items={items}
        />
    );

};

export { TestsList }; 