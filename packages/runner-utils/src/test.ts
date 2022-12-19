const fs = require("fs");
const path = require("path");

const actionTypes = ["page", "element", "browser", "customCode"];
const actions = {};

actionTypes.forEach((type) => {
    if(type === "customCode") return;
    const actionDir = path.join(__dirname, "actions/", type + "");
    fs.readdirSync(actionDir).forEach((file) => {
        const out = {};
        const action = require(path.join(actionDir, file, "index.ts"));
        const {name : type} = action as any;
        out["core"] = action;
        out["ui"] = { recorder: null };
        const recorderUIPath = path.join(actionDir, file, "ui/recorder.tsx");
        if(fs.existsSync(recorderUIPath)) {
            out["ui"]["recorder"] = require(recorderUIPath);
        }

        actions[type] = out;
    });
});

{
    const out = {};
    const customCodeAction = require(path.join(__dirname, "actions/customCode/index.ts"));
    out["core"] = customCodeAction;
    out["ui"] = { recorder: null };

    const {name: type} = customCodeAction as any;
    const customCodeUiPath = path.join(__dirname, "actions/customCode/ui/recorder.tsx");
    if(fs.existsSync(customCodeUiPath)) {
        customCodeAction["ui"]["recorder"] = require(customCodeUiPath);
    }
    actions[type] = out;
}



console.log("Actions are", actions);