import React from "react";

export const isAPP = () => !!window["__NEXT_DATA__"];

export const TestListContext = React.createContext({
    type: "app",
    runTest: () => { },
});

