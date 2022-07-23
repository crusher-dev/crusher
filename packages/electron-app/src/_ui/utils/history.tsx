import { createHashHistory } from 'history';
import React from 'react';
import { HashRouterProps, Router } from 'react-router-dom';
const historyInstance = createHashHistory();

export function CustomRouter({ basename, children, window }: HashRouterProps) {
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
  
    return (
      <Router
        basename={basename}
        children={children}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      />
    );
  }

  export default historyInstance;
