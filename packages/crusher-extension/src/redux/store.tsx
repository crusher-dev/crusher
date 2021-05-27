import {
	applyMiddleware,
	createStore,
	compose,
	Store,
	StoreEnhancer,
} from "redux";
import thunkMiddleware from "redux-thunk";

import { iReduxState, rootReducer } from "./reducers";
import loggerMiddleware from "redux-logger";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hotModule = module.hot;

let store: Store<iReduxState> | null = null;

export function getStore(): Store<iReduxState> {
	if (!store) throw new Error("Redux store not initialized");
	return store;
}

const composeEnhancers =
	typeof window === "object" &&
	(window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]
		? (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]({})
		: compose;

export default function configureStore(): Store<unknown> {
	if (store) return getStore();

	const middlewares: Array<any> = [thunkMiddleware];

	if ((process as any).env.NODE_ENV.toUpperCase() === "DEVELOPMENT") {
		middlewares.push(loggerMiddleware);
	}
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers: StoreEnhancer<unknown, any> = composeEnhancers(
		...enhancers,
	);

	store = createStore(rootReducer, composedEnhancers);

	if (hotModule) {
		hotModule.accept("./reducers", () => store?.replaceReducer(rootReducer));
	}

	return store;
}
