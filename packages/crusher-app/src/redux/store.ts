import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./reducers/rootReducer";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createFilter, {
	createBlacklistFilter,
} from "redux-persist-transform-filter";

const logger = createLogger({
	// ...options
});

const saveSubsetFilter = createFilter("projects", [
	"selectedProject",
	"allProjects",
]);

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["projects"],
	transforms: [saveSubsetFilter],
};

const composeEnhancers =
	typeof window === "object" && window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]
		? window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]({})
		: compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

export let store = null;

const makeConfiguredStore = (reducer) => createStore(reducer, enhancer);

// create a makeStore function
const makeStore = (context) => {
	const isServer = typeof window === "undefined";
	if (isServer) {
		store = makeConfiguredStore(rootReducer);
	} else {
		store = makeConfiguredStore(
			persistReducer(persistConfig, rootReducer),
			// @ts-ignore
			enhancer,
		);

		store.__persistor = persistStore(store);
	}
	return store;
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore);
