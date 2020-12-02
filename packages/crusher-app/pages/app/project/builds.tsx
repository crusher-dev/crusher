import React, { useState } from "react";
import { css } from "@emotion/core";
import WithSession from "@hoc/withSession";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import { FilterListPagination } from "@ui/containers/FilterListPagination";

const AVAILABLE_FILTERS = [
	{ title: "Monitoring", value: 1 },
	{ title: "Manual", value: 2 },
];

const JobBuilds = (props: any) => {
	return (
		<div css={containerCSS}>
			<div css={headingCSS}>Previous Builds</div>

			<div css={filterContainerCss}>
				<FilterListPagination categories={AVAILABLE_FILTERS} itemsPerPage={10} />
			</div>
		</div>
	);
};

JobBuilds.getInitialProps = async (ctx: any) => {
	return {};
};

const containerCSS = css`
	padding: 2.5rem 4.25rem;
	padding-bottom: 0;
`;

const headingCSS = css`
	color: #454551;
	font-family: Cera Pro;
	font-weight: bold;
	font-size: 1.5rem;
`;

const filterContainerCss = css`
	margin-top: 2.75rem;
`;

export default WithSession(WithSidebarLayout(JobBuilds));
