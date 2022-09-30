import { applyMiddleware, createStore, compose, Store, StoreEnhancer } from "redux";

import { rootReducer } from "./reducers";
import { forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer } from "electron-redux";
import { isProduction } from "../utils";
import loggerMiddleware from 'redux-logger'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hotModule = module.hot;

const composeEnhancers =
	typeof window === "object" && (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]
		? (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]({})
		: compose;

let _store = undefined;

export function getStore(): Store<unknown> {
	if (_store) return _store;
	throw new Error("Store not initialized yet!");
}

export default function configureStore(intialState: any, scope = "main", isTemporary = false): Store<unknown> {
	let middlewares: any[] = [];

	if (!isTemporary) {
		// if (!isProduction()) {
		// 	middlewares.push(loggerMiddleware);
		// }

		if (scope === "renderer") {
			middlewares = [forwardToMain, ...middlewares];
		}

		if (scope === "main") {
			middlewares = [...middlewares, forwardToRenderer];
		}
	}
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers: StoreEnhancer<unknown, any> = composeEnhancers(...enhancers);

	const store = createStore(rootReducer, intialState, composedEnhancers);

	if (hotModule) {
		hotModule.accept("./reducers", () => store?.replaceReducer(rootReducer));
	}

	if (!isTemporary) {
		if (scope === "main") {
			replayActionMain(store);
		} else {
			replayActionRenderer(store);
		}
	}

	_store = store;
	return store;
}
