import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTable, useBlockLayout } from "react-table";


function HomeSection() {

	return (
		<div
			className={"mt-20"}
			css={container}
		>

		</div>
	);
}


const container = css`

				width: 100%;
				background: #0a0a0a;
				min-height: 100vh;
				display: flex;
				border-top-color: rgba(255, 255, 255, 0.04);
				border-top-width: 0.5rem;
				border-top-style: solid;

`







export default Home Section;
