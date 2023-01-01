import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import { createHashHistory } from "history";
import React from "react";
import { HashRouterProps, Router } from "react-router-dom";
import { performTrackEvent } from "../../ipc/perform";
import { clearAllToasts } from "../ui/components/toasts";
const historyInstance = createHashHistory();

export function CustomRouter({ basename, children }: HashRouterProps) {
	let historyRef = React.useRef<any>();
	if (historyRef.current == null) {
		historyRef.current = historyInstance;
	}

	let history = historyRef.current;
	let [state, setState] = React.useState({
		action: history.action,
		location: history.location,
	});

	React.useLayoutEffect(() => history.listen(setState), [history]);

	React.useEffect(() => {
		clearAllToasts();
	}, [state.location]);


	React.useEffect(() => {
		performTrackEvent(DesktopAppEventsEnum.PAGE_OPEN, { page: state?.location?.pathname });
	}, [state.location]);
	return <Router basename={basename} children={children} location={state.location} navigationType={state.action} navigator={history} />;
}

export default historyInstance;
