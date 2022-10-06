import React, {useState, useEffect} from "react";
import { css } from "@emotion/react";
import { OnOutsideClick } from "../../components/layouts/onOutsideClick/onOutsideClick";
import { RightClickMenu } from "../../components/molecules/RightClick/RightClick";
import Checkbox from "../../components/atoms/checkbox/checkbox";
import pull from "lodash/pull";

const useSelectableList = () => {
	const [keyPressed, setKeyPressed] = useState<any>(null);
	const [selectedList, setSelectedList] = useState([]);

	const isItemSelected = React.useCallback((index) => selectedList.includes(index), [selectedList]);

	const toggleSelectAll = (items) => {
		if (selectedList.length === items.length) {
			setSelectedList([]);
			return;
		}
		setSelectedList(items.slice());
	};

	const toggleSelectItem = React.useCallback(
		(index) => {
			const isControlKey = keyPressed === 17 || keyPressed === 91;
			const isElementAlreadySelected = selectedList.includes(index);
			if (isControlKey) {
				if (isElementAlreadySelected) {
					const newList = pull(selectedList, index);
					setSelectedList(newList);
				} else {
					setSelectedList([...selectedList, index]);
				}
			} else {
				//If no key
				setSelectedList([index]);
			}
		},
		[keyPressed, selectedList],
	);

	const selectItem = React.useCallback(
		(index) => {
			const isElementAlreadySelected = selectedList.includes(index);
			if (!isElementAlreadySelected) {
				setSelectedList([...selectedList, index]);
			}
		},
		[keyPressed, selectedList],
	);

	useEffect(() => {
		const keyDownCallback = function (event) {
			setKeyPressed(event.keyCode);
		};

		const keyUpCallback = function () {
			setKeyPressed(null);
		};

		window.addEventListener("keydown", keyDownCallback, false);
		window.addEventListener("keyup", keyUpCallback, false);

		return () => {
			window.removeEventListener("keydown", keyDownCallback, false);
			window.removeEventListener("keyup", keyUpCallback, false);
		};
	}, []);

	const resetSelected = React.useCallback(() => {
		setSelectedList([]);
	}, []);

	return {
		selectedList,
		isItemSelected,
		toggleSelectAll,
		toggleSelectItem,
		resetSelected,
		selectItem,
	};
};
export enum ContextMenuTypeEnum {
	SINGLE = "single",
	MULTI = "multi",
}
interface IProps {
	className?: string;
	selectedHeaderActions: any;
	items?: { content: any; id: any }[];
	contextMenu?: { [type: string]: { callback?: any; menuItems?: any } };
}
const ListBox = ({ className, contextMenu, selectedHeaderActions: SelectedHeaderActions, items, ...props }: IProps) => {
	const { selectedList, selectItem, isItemSelected, resetSelected, toggleSelectAll, toggleSelectItem } = useSelectableList();
	const listItems = React.useMemo(() => {
		if (!items) return null;
		return items.map((item) => {
			return (
				<ListItem
					key={item.id}
					onContextMenu={selectItem.bind(this, item.id)}
					onClick={toggleSelectItem.bind(this, item.id)}
					isActive={isItemSelected(item.id)}
				>
					{item.content(isItemSelected(item.id))}
				</ListItem>
			);
		});
	}, [selectedList, isItemSelected, toggleSelectItem, selectItem, items]);

	const handleOutSideClick = React.useCallback(() => {
		// @Note: setTimeOut is here as an hack, to
		// allow selectedList to be sent to contextMenu onClick
		setTimeout(() => {
			resetSelected();
		}, 100);
	}, [resetSelected]);

	const useSingularContextMenu = selectedList.length <= 1;

	const menuItemsComponent = React.useMemo(() => {
		if (!contextMenu) return null;
		const { menuItems, callback } = contextMenu[useSingularContextMenu ? ContextMenuTypeEnum.SINGLE : ContextMenuTypeEnum.MULTI];

		return menuItems.map((item) => {
			return {
				type: "menuItem",
				value: item.label,
				rightItem: item.shortcut,
				onClick: callback.bind(this, item.id, selectedList),
			};
		});
	}, [selectedList, useSingularContextMenu]);

	const allSelected = selectedList.length === items.length;

	return (
		<OnOutsideClick onOutsideClick={handleOutSideClick}>
			<div css={headerCss}>
				<Checkbox
					css={checkboxCss}
					callback={toggleSelectAll.bind(
						this,
						items.map((a) => a.id),
					)}
					isSelectAllType={false}
					isSelected={allSelected}
				/>
				<div css={testsCountCss}>{items.length} tests</div>
				{SelectedHeaderActions ? <SelectedHeaderActions toggleSelectAll={toggleSelectAll} items={items} selectedList={selectedList} /> : ""}
			</div>
			<RightClickMenu menuItems={menuItemsComponent}>
				<ul className={String(className)} css={listCss} {...props}>
					{listItems}
				</ul>
			</RightClickMenu>
		</OnOutsideClick>
	);
};

const checkboxCss = css`
	.checkbox-container {
		border-radius: 6rem;
	}
`;

const headerCss = css`
	display: flex;
	align-items: center;
	padding-right: 16px;
	padding-left: 18px;
	border-bottom: 0.5rem solid rgba(153, 153, 153, 0.09);
	padding-bottom: 12rem;
	height: 30px;
`;
const testsCountCss = css`
	font-weight: 400;
	font-size: 12rem;

	color: rgba(255, 255, 255, 0.67);
	padding: 0px 13px;
`;
const listCss = css`
	user-select: none;
	height: 100%;

	font-size: 14px;
	letter-spacing: 0.03em;

	color: #ffffff;
	height: 38rem;

	li {
		position: relative;
		display: flex;
		align-items: center;
	}
`;
const ListItem = ({ isActive, children, onClick, ...props }) => {
	const itemStyle = React.useMemo(() => itemCss(isActive), [isActive]);
	const handleOnClick = React.useCallback(
		(e) => {
			onClick(e);
		},
		[onClick],
	);
	return (
		<li css={itemStyle} onClick={handleOnClick} {...props}>
			{children}
		</li>
	);
};

const itemCss = (isActive) => css`
	position: relative;
	background: ${isActive ? "rgba(199, 81, 255, 0.14)" : "none"};
	color: ${isActive ? "#fff" : "#A6A6A6"};
	border-bottom: 0.5rem solid rgba(153, 153, 153, 0.09);

	:hover {
		background: ${isActive ? `rgba(199, 81, 255, 0.14)` : `rgba(255, 255, 255, 0.02)`} !important;
	}
`;
export { ListBox };
