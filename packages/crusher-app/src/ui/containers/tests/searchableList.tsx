import React, { ChangeEvent, useState, useMemo } from "react";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { css } from "@emotion/core";
import { SearchFilterBar } from "../common/searchFilterBar";
import { getTime } from "@utils/helpers";
import useSWR from 'swr';
import { TEST_LIST_API } from '@constants/api';

interface IBuildItemCardProps {
    testName: string;
    isPassing: number;
    // In seconds
    createdAt: Date;
};

function TestCard(props: IBuildItemCardProps) {
    const { testName, isPassing, createdAt,imageURL } = props;

    const statusIcon = isPassing ? (<CompleteStatusIconSVG isCompleted={true} />) : (<CompleteStatusIconSVG isCompleted={false} />);

    return (
        <div css={itemContainerStyle}>
            <img css={itemImageStyle} src={imageURL} />
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
    padding: 20rem 16rem;
`;
const itemContainerStyle = css`
    background: rgba(16, 18, 21, 0.5);
    border: 1px solid #171C24;
    border-radius: 8rem;
    color: rgba(255, 255, 255, 0.6);
    width: 252rem;
    margin-bottom: 40px;
    overflow: hidden;
    margin-right: 32px;
:hover{        background: rgba(16, 18, 21,1);
}
`;
const itemImageStyle = css`
    height: 183rem;
    width: 100%;
`;

function TestSearchableList() {
    const [searchQuery, setSearchQuery] = useState(null as null | string);
    const {data} = useSWR(TEST_LIST_API,  { suspense: true })


    const testsItems = useMemo(() => {
        return data.map((test: any) => {
            const { testName, isPassing, createdAt,imageURL } = test;

            return (
                <TestCard
                  imageURL={imageURL}
                    testName={testName}
                    isPassing={isPassing}
                    createdAt={createdAt}
                />
            )
        })
    }, [data]);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    return (
        <div>
            <SearchFilterBar placeholder={"Search tests"} handleInputChange={handleInputChange} value={searchQuery!} />
            <div css={testItemsGridContainerStyle} className={"flex mt-44"}>
                {testsItems}
            </div>
        </div>
    );
}

const testItemsGridContainerStyle = css`
    flex-wrap: wrap;
    
`;
export { TestSearchableList };
