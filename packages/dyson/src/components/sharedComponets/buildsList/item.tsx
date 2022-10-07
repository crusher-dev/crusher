import React, { useState } from "react";
import { css } from "@emotion/react";
import { FailedCheckboxIcon, GreenCheckboxIcon, PlayIcon } from "../svg/list";
import { UserIcon } from "../../atoms/userimage/UserImage";
const intervals = [
	{ label: "year", seconds: 31536000 },
	{ label: "month", seconds: 2592000 },
	{ label: "day", seconds: 60 * 60 * 24 },
	{ label: "hour", seconds: 60 * 60 },
	{ label: "min", seconds: 60 },
	{ label: "sec", seconds: 1 },
];

function getStringFromDuration(durationInSec: number) {
	const interval = intervals.find((i) => i.seconds < durationInSec);
	const count = Math.ceil(durationInSec / interval?.seconds) || 1;
	const plural = String(count !== 1 ? "s" : "");

	return `${count} ${interval?.label || "sec"}${plural}`;
}

function timeSince(date: Date): string {
	const durationInSec = Math.ceil((Date.now() - date.getTime()) / 1000);
	const durationString = getStringFromDuration(durationInSec);

	return `${durationString} ago`;
}

const BuildListItem = ({isItemSelected, viewTestCallback, build}) => {
    return (
        <div className={"flex flex-col flex-1 px-24 py-20 pb-16"} css={testItem(isItemSelected)}>
            <div className={"flex items-center"} css={css`width: 100%`}>
                <div className={"flex items-center flex-1"}>
					{build.status === "PASSED" ? ( <GreenCheckboxIcon css={passedIconCss}/> ) : ""}
					{build.status === "FAILED" ? ( <FailedCheckboxIcon css={passedIconCss}/> ) : ""}
                    <div className={"ml-12"} css={buildIdCss}>
                        #{build.id}
                    </div>
                    {build.name ? (<div className={"ml-6"} css={commitMessageCss}>
                        | {build.name}
                    </div>) : ""}
                </div>
                <div className={"action-buttons ml-auto"} css={listItemActionsCss}>
                            <div onClick={viewTestCallback.bind(this, build.id)} css={runTestsCSS} title="run this test">
                                <PlayIcon css={playIconCss} />
                                <span css={runTextCss}>view</span>
                            </div>
                </div>
            </div>
            <div className={"flex items-center mt-16"}>
				<div css={metaInfoCss} className={"flex-1 flex"}>
					<div>{build.host ? (new URL(build.host)).host : "~"}</div>
					{/* <div className={"ml-20"}>ft-branch-new  33814</div> */}
				</div>
				<div className={"flex items-center ml-auto"}>
					<UserIcon initial={build.triggeredBy.name[0]} />
					<span css={authorCss} className={"text-13 ml-12"}>{timeSince(new Date(build.createdAt))} by {build.triggeredBy.name.toLowerCase()}</span>
				</div>
            </div>
        </div>
    );  
}

const authorCss = css`
font-size: 12rem;
letter-spacing: 0.03em;

color: rgba(255, 255, 255, 0.35);
`;

const metaInfoCss =css`
	font-weight: 400;
	font-size: 13rem;

	letter-spacing: 0.03em;
	color: rgba(255, 255, 255, 0.35);
`;
const buildIdCss = css`
	font-size: 16rem;
	font-weight: 600;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.78);
`;
const commitMessageCss = css`
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.83);
	font-size: 13rem;
`;
const passedIconCss = css`
    width: 16rem;
    height: 16rem;
`;
const listItemActionsCss = css`
		display: none;
		color: #9f87ff;
		margin-left: auto;
		align-items: center;
		gap: 4rem;
		height: 16rem;
`;
const testItem = (isItemSelected: boolean) => css`
	#checkbox {
		visibility: ${isItemSelected ? "visible" : "hidden"};
	}
	:hover {
		#checkbox {
			visibility: visible;
		}
	}
	:hover {
		& .action-buttons {
			display: flex !important;
		}
	}
`;

const runTextCss = css`
	font-weight: 500;
	font-size: 12rem;

	letter-spacing: 0.03em;
	position: relative;
	top: 1rem;

	color: #b061ff;
`;

const runTestsCSS = css`
	display: flex;
	align-items: center;
	gap: 4rem;
	position: relative;

	font-size: 13rem;

	padding: 6px 6px;
	:hover {
		color: #fff;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #131314;
		border-radius: 6px;
	}
`;
const playIconCss = css`
	width: 10.25rem;
	height: 12rem;
`;

export { BuildListItem };