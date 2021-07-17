import React, { ChangeEvent, useState, useMemo } from "react";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { css } from "@emotion/core";
import { SearchFilterBar } from "../common/searchFilterBar";
import { getTime } from "@utils/helpers";

interface IBuildItemCardProps {
    testName: string;
    isPassing: number;
    // In seconds
    createdAt: Date;
};

function BuildItemCard(props: IBuildItemCardProps) {
    const { testName, isPassing, createdAt } = props;

    const statusIcon = isPassing ? (<CompleteStatusIconSVG isCompleted={true} />) : (<CompleteStatusIconSVG isCompleted={false} />);

    return (
        <div css={itemContainerStyle}>
            <img css={itemImageStyle} />
            <div css={itemMainContainerStyle}>
                <div className={"flex flex-row items-center"}>
                    <div css={testNameStyle} className={"font-cera"}>{testName}</div>
                    <div className={"ml-auto"}>{statusIcon}</div>
                </div>
                <div css={createdAtStyle} className={"mt-24 text-13"}>{getTime(createdAt)}</div>
            </div>
        </div>
    );
}

const createdAtStyle = css`
    color: rgba(255, 255, 255, 0.6);
`;

const testNameStyle = css`
    color: rgba(255, 255, 255, 0.8);
    font-size: 15.5rem;
    font-weight: bold;
`;

const itemMainContainerStyle = css`
    background: rgba(16, 18, 21, 0.5);
    padding: 20rem 24rem;
`;
const itemContainerStyle = css`
    background: rgba(16, 18, 21, 0.5);
    border: 1px solid #171C24;
    border-radius: 8rem;
    color: rgba(255, 255, 255, 0.6);
    width: 265rem;
`;
const itemImageStyle = css`
    height: 183rem;
`;
const DUMMY_TESTS_LIST = require("./dummyTests.json");

function TestSearchableList() {
    const [testsList, _] = useState(DUMMY_TESTS_LIST);
    const [searchQuery, setSearchQuery] = useState(null as null | string);

    const testsItems = useMemo(() => {
        return testsList.map((dummyTest: any) => {
            const { testName, isPassing, createdAt } = dummyTest;

            return (
                <BuildItemCard
                    testName={testName}
                    isPassing={isPassing}
                    createdAt={new Date(createdAt)}
                />
            )
        })
    }, [searchQuery]);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    return (
        <div>
            <SearchFilterBar placeholder={"Search tests"} handleInputChange={handleInputChange} value={searchQuery!} />
            <div css={testItemsGridContainerStyle} className={"mt-34"}>
                {testsItems}
            </div>
        </div>
    );
}

const testItemsGridContainerStyle = css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: auto;
    grid-row-gap: 42rem;
`;
export { TestSearchableList };
