import React, { ReactElement, useEffect, useState } from "react";
import { css } from "@emotion/core";

interface iFilter {
	title: string;
	value: number;
}

interface iFilterListPaginationProps {
	categories: Array<iFilter>;
	endpoint: string;
	itemsPerPage: number;
	itemComponent: ReactElement;
}

interface iFilterCapsProps {
	caps: Array<iFilter>;
	disableAllCap?: boolean;
	selectedCap?: number | null;
	onChangeCap: (cap: iFilter) => void;
}

const FilterCaps = (props: iFilterCapsProps) => {
	const { disableAllCap, selectedCap, onChangeCap } = props;
	let { caps } = props;

	if (!disableAllCap) {
		caps = [{ title: "All", value: 0 }, ...caps];
	}

	const onFilterCapClickCallback = (cap: iFilter) => {
		onChangeCap(cap);
	};

	const out = caps.map((cap, index) => {
		return (
			<li
				className={
					selectedCap === cap.value
						? "active"
						: !selectedCap && index === 0
						? "active"
						: ""
				}
				key={cap.value}
				onClick={() => {
					onFilterCapClickCallback(cap);
				}}
			>
				{cap.title}
			</li>
		);
	});

	return <ul css={filterCapsContainerCss}>{out}</ul>;
};

const filterCapsContainerCss = css`
	display: flex;
	li {
		margin-right: 3rem;
		padding: 0.2rem 1rem;
		min-width: 7.5rem;
		text-align: center;
		color: #3c4454;
		font-size: 1.25rem;
		font-family: Cera Pro;
		font-weight: normal;
		font-style: normal;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: 0.125rem;
		&.active {
			border-color: #f2f2f2;
			background: #fbfbfb;
		}
	}
`;

interface iFilters {
	category: number;
	currentPage: number;
}

const FilterListPagination = (props: iFilterListPaginationProps) => {
	const { categories } = props;
	const [filters, setFilters] = useState({ currentPage: 1 } as iFilters);

	const onChangeFilter = (newCap: iFilter) => {
		setFilters({
			...filters,
			category: newCap.value,
		});
	};

	useEffect(() => {
		console.log("Something changed!");
	}, [filters]);

	return (
		<div>
			<FilterCaps
				onChangeCap={onChangeFilter}
				selectedCap={filters.category}
				caps={categories}
			/>
			<div>{filters.currentPage}</div>
		</div>
	);
};

export { FilterListPagination };
