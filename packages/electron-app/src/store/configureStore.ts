import { applyMiddleware, createStore, compose, Store, StoreEnhancer } from "redux";
import thunkMiddleware from "redux-thunk";

import { iReduxState, rootReducer } from "./reducers";
import loggerMiddleware from "redux-logger";
import { forwardToMain, forwardToRenderer, triggerAlias, replayActionMain, replayActionRenderer } from "electron-redux";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hotModule = module.hot;

const composeEnhancers =
	typeof window === "object" && (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]
		? (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]({})
		: compose;

export default function configureStore(intialState: any, scope = "main"): Store<unknown> {
	let middlewares: Array<any> = [];

	// if (!isProduction()) {
	// middlewares.push(loggerMiddleware);
	// }

	if (scope === "renderer") {
		middlewares = [forwardToMain, ...middlewares];
	}

	if (scope === "main") {
		middlewares = [triggerAlias, ...middlewares, forwardToRenderer];
	}

	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers: StoreEnhancer<unknown, any> = composeEnhancers(...enhancers);

	const store = createStore(rootReducer, intialState, composedEnhancers);

	if (hotModule) {
		hotModule.accept("./reducers", () => store?.replaceReducer(rootReducer));
	}

	if (scope === "main") {
		replayActionMain(store);
	} else {
		replayActionRenderer(store);
	}

	return store;
}
