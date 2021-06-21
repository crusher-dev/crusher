import React from "react";
import { css } from "@emotion/core";

function RenderItem(props) {
	const { onClick, onDeleteItem, item } = props;
	const { id, name, value } = item;
	return (
		<li
			onClick={() => {
				if (onClick) {
					onClick(id);
				}
			}}
		>
			<div css={styles.mainUrlContent}>
				{name} - {value}
			</div>
			<div css={styles.deleteIconContainer}>
				<img
					onClick={() => {
						if (onDeleteItem) {
							onDeleteItem(id);
						}
					}}
					src={"/svg/cross.svg"}
					style={{ width: "0.78rem", marginRight: "1rem", cursor: "pointer" }}
				/>
			</div>
		</li>
	);
}
function List(props) {
	const {
        onClick,
        onDeleteItem,
        items
    } = props;

	const itemsOut = items.map((item) => {
		return <RenderItem onClick={onClick} onDeleteItem={onDeleteItem} item={item} />;
	});

	return <ul css={styles.container}>{itemsOut}</ul>;
}

const styles = {
	container: css`
        padding: 0;
        list-style: none;
        border-radius: 0.1rem;
        font-family: DM sans;

        li {
            padding: 0.8rem 0.4rem;
            padding-top: 0.7rem;
            color: #424552;
            font-size: 0.825rem;
            border-color: #0505050f;
            border-bottom-style: solid;
            border-bottom-width: 1px;
            background-color: white;
            display: flex;
        }
        li:before {
         content: "\\2605";
         margin-right: 1.1rem;
         font-size: 0.8rem;
         color: #323546;
        },
    `,
	mainUrlContent: css`
		flex: 1;
	`,
	deleteIconContainer: css`
		margin-left: auto;
	`,
};

export default List;
