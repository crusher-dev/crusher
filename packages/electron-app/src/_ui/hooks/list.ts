import React, { useState, useEffect } from "react";
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

export { useSelectableList };
