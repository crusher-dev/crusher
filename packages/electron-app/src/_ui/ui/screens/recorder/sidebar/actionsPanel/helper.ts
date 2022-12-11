import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { getStore } from "electron-app/src/store/configureStore";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import {
	enableJavascriptInDebugger,
	peformTakeElementScreenshot,
	performAssertElementVisibility,
	performClick,
	performHover,
} from "electron-app/src/ipc/perform";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import Fuse from "fuse.js";

const actionsData = require("./actions.json");

const getItemsFromActionsData = (data: { [key: string]: { label: string; keywords: string[] } }) => {
	return Object.keys(data).map((key) => {
		return {
			id: key,
			content: data[key].label,
			meta: data[key],
		};
	});
};

interface IActionItem {
	id?;
	string;
	label: string;
	keywords: string[];
	category: "PAGE" | "ELEMENT" | "CODE";
}

const tranformActionsToList = (): IActionItem[] => {
	let finalItems = [];
	for (const category of Object.keys(actionsData)) {
		const isNotACategory = !!actionsData[category]?.label;
		if (isNotACategory) {
			finalItems.push({
				...actionsData[category],
				category: category,
			});
		} else {
			finalItems.push(
				...Object.keys(actionsData[category]).map((actionId: any) => {
					return { ...actionsData[category][actionId], category: category, id: actionId };
				}),
			);
		}
	}
	return finalItems;
};

const transformResultsToActions = (list) => {
	const finalObj = {};
	list.map(({ item }) => {
		if (!finalObj[item.category]) {
			finalObj[item.category] = {};
		}
		const itemId = item.id;
		const itemCategory = item.category;
		if (itemId) {
			finalObj[itemCategory][itemId] = item;
		} else {
			finalObj[itemCategory] = item;
		}
	});
	return finalObj;
};

const filterActionsItems = (filter: string) => {
	const listItems = tranformActionsToList();
	const fuse = new Fuse(listItems, {
		keys: ["keywords"],
		threshold: 0.3,
		ignoreLocation: true,
		findAllMatches: true,
		ignoreFieldNorm: true,
		isCaseSensitive: false,
	});
	const searchItems = fuse.search(filter);
	console.log("Search items are", searchItems);
	const finalList = transformResultsToActions(searchItems);
	console.log("Search items are", filter, finalList);

	return finalList;
};

const ToastPrettyActionMap = {
	CLICK: "click",
	HOVER: "hover",
	SCREENSHOT: "element screenshot",
	ASSERT_VISIBLE: "assert visible",
};

class ElementsHelper {
	static showToast(id) {
		sendSnackBarEvent({
			type: "step_recorded",
			message: "added a click check",
			meta: { action: ToastPrettyActionMap[id] },
		});
	}

	static async click() {
		const store = getStore();

		const selectedElement = getSelectedElement(store.getState() as any);

		await enableJavascriptInDebugger();
		performClick(selectedElement);
		store.dispatch(setSelectedElement(null));
		ElementsHelper.showToast("CLICK");
	}

	static async hover() {
		const store = getStore();
		const selectedElement = getSelectedElement(store.getState() as any);

		await enableJavascriptInDebugger();
		performHover(selectedElement, store);
		store.dispatch(setSelectedElement(null));
		ElementsHelper.showToast("HOVER");
	}

	static async screenshot() {
		const store = getStore();
		const selectedElement = getSelectedElement(store.getState() as any);

		await enableJavascriptInDebugger();
		peformTakeElementScreenshot(selectedElement, store);
		store.dispatch(setSelectedElement(null));
		ElementsHelper.showToast("SCREENSHOT");
	}

	static showAssertModal() {
		emitShowModal({ type: "SHOW_ASSERT_MODAL" });
	}

	static async assertVisible() {
		const store = getStore();
		const selectedElement = getSelectedElement(store.getState() as any);

		await enableJavascriptInDebugger();
		performAssertElementVisibility(selectedElement, store);
		store.dispatch(setSelectedElement(null));
		ElementsHelper.showToast("ASSERT_VISIBLE");
	}
}

export { getItemsFromActionsData, ElementsHelper, filterActionsItems };
