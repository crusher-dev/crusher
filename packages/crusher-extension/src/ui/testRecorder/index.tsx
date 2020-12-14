import { render } from "react-dom";
import App from "./app";
import React from "react";

// Get Active Tab id (i.e, tabId) and check if the recorder is one or not (i.e, isSessionGoingOn).
// Pass both of them to our component App
render(<App />, document.querySelector("#root"));
