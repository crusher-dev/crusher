import { webContents } from "electron";

export enum Commands {
    "app.reloadExtension" = "app.reloadExtension",
}

function handleWebViewMessage(event: any, message: {type: Commands; payload: any}) {

}

export { handleWebViewMessage };