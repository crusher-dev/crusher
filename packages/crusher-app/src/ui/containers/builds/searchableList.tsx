import React, { ChangeEvent, useState, useMemo } from "react";
import { Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { ClockIconSVG, CommentIconSVG, DangerIconSVG, DropdownIconSVG } from "@svg/builds";
import {css} from "@emotion/core";

interface IBuildItemCardProps {
    buildId: string;
    noTests: number;
    // In seconds
    buildTimeTaken: number;
    createdAt: Date;
    status: "Running" | "Review Required" | "Passed" | "Failed" | "Timeout";
    // user name
    triggeredBy: string;
    noComments: number;
    hasPassed: boolean;
    shouldShowProductionWarning: boolean;
};

function BuildItemCard(props: IBuildItemCardProps) {
    const { buildId, status, buildTimeTaken, triggeredBy, noTests, noComments, hasPassed, shouldShowProductionWarning } = props;

    const statusIcon = hasPassed ? (<CompleteStatusIconSVG isCompleted={true} />) : (<CompleteStatusIconSVG isCompleted={false} />);

    return (
        <div css={itemContainerStyle}>
            <div className={"flex flex-row items-center"}>
                <div className={"flex flex-row items-center"}>
                    <span css={itemBuildStyle} className={"font-cera"}>#{buildId}</span>
                    <span className={"ml-18 text-14"}>{noTests} tests</span>
                    <div className={"flex flex-row items-center ml-21"}>
                        <ClockIconSVG />
                        <span className={"ml-9 text-14"}>{buildTimeTaken} mins</span>
                    </div>
                </div>
                <div className={"flex flex-row items-center ml-auto"}>
                    <div className={"flex flex-row items-center"}>
                        <CommentIconSVG />
                        <span css={noCommentsStyle} className={"ml-7 text-14"}>{noComments}</span>
                    </div>
                    <span className={"ml-18"}>
                        {statusIcon}
                    </span>
                </div>
            </div>
            <div className={"mt-14 text-13"}>
                <span className={"text-13"}>opened 3 days ago</span>
                <span className={"text-13 ml-23"}>{status}</span>
                <span className={"text-13 ml-28"}>by - {triggeredBy}</span>
            </div>
            <Conditional showIf={shouldShowProductionWarning}>
                <div className={"flex flex-row items-center mt-17"}>
                    <DangerIconSVG width={17} height={17} />
                    <span className={"pt-1 text-13 ml-13"}>This is ongoing production issues. Please check</span>
                </div>
            </Conditional>
        </div>
    );
}

const itemContainerStyle = css`
    background: rgba(16, 18, 21, 0.5);
    border: 1px solid #171C24;
    border-radius: 8rem;
    padding: 20rem 24rem;
    color: rgba(255, 255, 255, 0.6);

    &:not(:first-child){
        margin-top: 24rem;
    }
`;
const itemBuildStyle = css`
    color: rgba(255, 255, 255, 0.8) !important;
`;
const noCommentsStyle = css`
    color: #D0D0D0;
`;
const DUMMY_BUILDS_LIST = require("./dummyBuilds.json");

function BuildSearchableList() {
    const [buildsList, _] = useState(DUMMY_BUILDS_LIST);
    const [searchQuery, setSearchQuery] = useState(null as null | string);

    const buildItems = useMemo(() => {
        return buildsList.map((dummyBuild: any) => {
            const { buildId, noTests, buildTimeTaken, createdAt, status, triggeredBy, noComments, hasPassed, shouldShowProductionWarning } = dummyBuild;

            return (
                <BuildItemCard
                    buildId={buildId}
                    noTests={noTests}
                    buildTimeTaken={buildTimeTaken}
                    createdAt={new Date(createdAt)}
                    status={status}
                    triggeredBy={triggeredBy}
                    noComments={noComments}
                    hasPassed={hasPassed}
                    shouldShowProductionWarning={shouldShowProductionWarning}
                />
            )
        })
    }, [searchQuery]);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    return (
        <div>
            <div className="flex flex-row items-center" css={filterBarStyle}>
                <div className={"flex-1 mr-26"}>
                    <Input css={inputStyle} placeholder={"Search builds"} onChange={handleInputChange} isError={false} size="large" />
                </div>
                <div className="flex flex-row ml-auto">
                <div className="flex flex-row items-center">
                    <span className="text-14">Status</span>
                    <DropdownIconSVG className={"ml-8"}/>
                </div>
                <div className="flex flex-row items-center ml-26">
                    <span className="text-14">Author</span>
                    <DropdownIconSVG className={"ml-8"}/>
                </div>
                </div>
            </div>
            <div className={"mt-34"}>
                {buildItems}
            </div>
        </div>
    );
}

const inputStyle = css`
    height: 41rem;
    width: 100%;
`;
const filterBarStyle = css`
    color: ##D0D0D0;
`;
export { BuildSearchableList };
