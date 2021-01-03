import {
	applyMiddleware,
	compose,
	createStore,
	Store,
	StoreEnhancer,
} from "redux";
import thunkMiddleware from "redux-thunk";

import { iReduxState, rootReducer } from "./reducers";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hotModule = module.hot;

let store: Store<iReduxState> | null = null;

export function getStore(): Store<iReduxState> {
	if (!store) throw new Error("Redux store not initialized");
	return store;
}

export default function configureStore(): Store<unknown> {
	if (store) return getStore();

	const middlewares = [thunkMiddleware];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer];
	const composedEnhancers: StoreEnhancer<unknown, any> = compose(...enhancers);

	store = createStore(rootReducer, composedEnhancers);

	if (process.env.NODE_ENV !== "production" && hotModule) {
		hotModule.accept("./reducers", () => store?.replaceReducer(rootReducer));
	}

	return store;
}
