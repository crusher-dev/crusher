import { css } from "@emotion/react";
import dynamic from "next/dynamic";

import React, { useState } from "react";


import { Button } from "dyson/src/components/atoms";

import { CommentIcon, } from "@svg/dashboard";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";

const ReviewButtonContent = dynamic(() => import("./reviewBuild"));

export function ReviewSection() {
	const [open, setOpen] = useState(true);

	return (
		<Dropdown component={<ReviewButtonContent closeModal={setOpen.bind(this, false)} />} callback={setOpen} initialState={open} dropdownCSS={reviewCss}>


			<Button size="medium" title="leave a comment/review" bgColor={"tertiary"} onClick={setOpen.bind(this, true)} css={reviewButtonCSS}>
				<div className={"flex items-center"}>
					<CommentIcon className={"mr-6"} />
					<span className="mt-1">review</span>
				</div>
			</Button>
		</Dropdown>
	);
}



const reviewButtonCSS = css`
	padding: 0 10rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #0d0d0d;
	border: 0.5px solid rgba(219, 222, 255, 0.16);
	border-radius: 8px;

	:hover {
		background: #313131;
		filter: brighntess(0.8);
	}
`;
const reviewCss = css`
	padding: 0;
	height: fit-content;
	width: 380rem;
	top: calc(100% + 9rem) !important;
	right: 0px !important;
	z-index: 110;
	left: unset !important;

	border-radius: 12rem !important;
	background: #0D0E0E;
    border: 1px solid #1C1C1C;
`;
