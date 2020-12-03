import React, { ReactElement, useEffect, useState } from "react";
import { css } from "@emotion/core";
import { getPaginationEndpoint } from "@services/job";
import { Pagination } from "@ui/components/common/Pagination";

interface iFilter {
	title: string;
	value: number;
}

interface iFilterListPaginationProps {
	categories: Array<iFilter>;
	items: any;
	currentPage: number;
	resolveCategoryUrl: any;
	totalPages: number;
	itemsPerPage: number;
	selectedCategory: number;
	itemsListComponent: ReactElement;
	resolvePaginationUrl: any;
}

interface iFilterCapsProps {
	caps: Array<iFilter>;
	disableAllCap?: boolean;
	selectedCap?: number | null;
	resolveCategoryUrl: any;
	onChangeCap: (cap: iFilter) => void;
}

const FilterCaps = (props: iFilterCapsProps) => {
	const { disableAllCap, selectedCap, resolveCategoryUrl, onChangeCap } = props;
	let { caps } = props;

	if (!disableAllCap) {
		caps = [{ title: "All", value: 0 }, ...caps];
	}

	const onFilterCapClickCallback = (cap: iFilter) => {
		onChangeCap(cap);
	};

	const out = caps.map((cap, index) => {
		return (
			<a href={resolveCategoryUrl(cap.value)}>
				<li
					className={
						parseInt(selectedCap as any) === cap.value
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
			</a>
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
	const {
		categories,
		currentPage,
		items,
		resolvePaginationUrl,
		totalPages,
		selectedCategory,
		resolveCategoryUrl,
		itemsListComponent,
	} = props;

	const ItemsListComponent: any = itemsListComponent;
	const [filters, setFilters] = useState({
		currentPage: parseInt(currentPage),
		category: selectedCategory,
	} as iFilters);

	const onChangeFilter = (newCap: iFilter) => {
		setFilters({
			...filters,
			category: newCap.value,
		});
	};

	useEffect(() => {
		// getPaginationEndpoint("/ge");
	}, [filters]);

	return (
		<div>
			<FilterCaps
				onChangeCap={onChangeFilter}
				selectedCap={filters.category}
				resolveCategoryUrl={resolveCategoryUrl}
				caps={categories}
			/>
			<ItemsListComponent items={items} />

			<Pagination
				style={{ marginTop: "2.75rem" }}
				totalPages={totalPages ? totalPages : 1}
				currentPage={filters.currentPage}
				resolvePaginationUrl={resolvePaginationUrl}
			/>
		</div>
	);
};

export { FilterListPagination };
