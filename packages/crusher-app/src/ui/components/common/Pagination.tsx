import { css } from "@emotion/core";
import Link from "next/link";

function renderPageItem(number, currentPage, resolvePaginationUrl) {
	const url = resolvePaginationUrl(number);
	return (
		<Link href={url}>
			<a href={url} style={{ marginRight: 8 }}>
				<div
					style={{
						color: parseInt(number) === parseInt(currentPage) ? "#232425" : "#7f8ca5",
					}}
					css={styles.paginationItem}
				>
					{number}
				</div>
			</a>
		</Link>
	);
}

function renderDots() {
	return <span style={{ marginRight: 8 }}>...</span>;
}

export const Pagination = (props) => {
    let { totalPages, currentPage, resolvePaginationUrl, style } = props;
    let itemsToShow = 6;
    if (!currentPage || currentPage < 1)
        currentPage = 1;

    const out = [];
    out.push(renderPageItem(1, currentPage, resolvePaginationUrl));
    itemsToShow--;
    if (currentPage - 2 > 3) {
		out.push(renderDots());
	}
    for (let page = currentPage - 3 > 1 ? currentPage - 3 : 2, count = 0; page < currentPage && count < 3 && page <= totalPages; page++, count++) {
		itemsToShow--;
		out.push(renderPageItem(page, currentPage, resolvePaginationUrl));
	}
    if (itemsToShow && currentPage !== 1 && currentPage <= totalPages) {
		out.push(renderPageItem(currentPage, currentPage, resolvePaginationUrl));
	}
    let countOnRight = 0;
    for (let page = currentPage + 1; page <= totalPages && countOnRight <= itemsToShow; page++, countOnRight++) {
		out.push(renderPageItem(page, currentPage, resolvePaginationUrl));
	}
    if (currentPage + countOnRight < totalPages - 1) {
		out.push(renderDots());
	}
    if (totalPages > 1 && currentPage + countOnRight < totalPages) {
		out.push(renderPageItem(totalPages, currentPage, resolvePaginationUrl));
	}

    return (
		<div style={style} css={styles.paginationContainer}>
			{out}
		</div>
	);
};

const styles = {
	paginationContainer: css`
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 1.5rem;
	`,
	paginationItem: css`
		padding: 7px 18px;
		text-align: center;
		background: white;
		border-style: solid;
		border-width: 1px;
		border-color: #dadfe9;
		color: #4f5052;
		font-weight: 400;
		border-radius: 4px;
	`,
};
