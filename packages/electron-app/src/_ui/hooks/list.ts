import React, { useState, useEffect } from "react";
import pull from "lodash/pull";

const useSelectableList = () => {
  const [keyPressed, setKeyPressed] = useState<any>(null);
  const [selectedList, setSelectedList] = useState([]);

  const isItemSelected = React.useCallback((index) => selectedList.includes(index), [selectedList]);

  const toggleSelectAll = (items) => {
    if (selectedList.length === items) {
      setSelectedList([])
    }
    setSelectedList([...items])
  }

  const toggleSelectItem = React.useCallback((index, items) => {
    const isControlKey = keyPressed == 17 || keyPressed === 91;
    const isShiftKey = keyPressed == 17;
    const isElementAlreadySelected = selectedList.includes(index);
    if (isControlKey) {
      if (isElementAlreadySelected) {
        const newList = pull(selectedList, index);
        setSelectedList(newList)
      }
      else {
        setSelectedList([...selectedList, index])
      }
    } else {
      //If no key
      setSelectedList([index]);
    }
  }, [keyPressed, selectedList]);


  useEffect(() => {
    const keyDownCallback = function (event) {
      setKeyPressed(event.keyCode);
    };

    const keyUpCallback = function (event) {
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
  }
}

export { useSelectableList };