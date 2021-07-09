import React, { JSXElementConstructor, useEffect, useState } from "react";
import { css } from "@emotion/core";
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
	itemsListComponent: JSXElementConstructor<any>;
	resolvePaginationUrl: any;
}

interface iFilterCapsProps {
	caps: Array<iFilter>;
	disableAllCap?: boolean;
	selectedCap?: number | null;
	resolveCategoryUrl: any;
	onChangeCap: (cap: iFilter) => void;
}

const BuildFilter = (props: iFilterCapsProps) => {
	const { disableAllCap, selectedCap, resolveCategoryUrl, onChangeCap } = props;
	let { caps } = props;

	if (!disableAllCap) {
		caps = [{ title: "All", value: 0 }, ...caps];
	}

	const onFilterCapClickCallback = (cap: iFilter) => {
		onChangeCap(cap);
	};


	return null;
};


interface iFilters {
	category: number;
	currentPage: number;
}

const BuildList = (props: iFilterListPaginationProps) => {
	const {
		currentPage,
		items,
		resolvePaginationUrl,
		totalPages,
		selectedCategory,
		itemsListComponent: ItemsListComponent,
	} = props;

	const [filters] = useState({
		currentPage: parseInt(currentPage as any),
		category: selectedCategory,
	} as iFilters);

	return (
		<div>
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

export { BuildList };
