import { webContents } from "electron";

export enum Commands {
    "recorder.init" = "recorder.init",
    "recorder.turnOnInspectMode" = "recorder.turnOnInspectMode",
    "recorder.turnOffInspectMode" = "recorder.turnOffInspectMode",
    "recorder.setUserAgent" = "recorder.setUserAgent",
    "recorder.executeCustomCode" = "recorder.executeCustomCode",
    "recorder.runAfterThisTest" = "recorder.runAfterThisTest",
    "recorder.onStepsUpdated" = "recorder.onStepsUpdated",
    "recorder.navigatePage" = "recorder.navigatePage",
    "recorder.runAction" = "recorder.runAction",

    "app.setCustomBackendDomain" = "app.setCustomBackendDomain",
    "app.reloadExtension" = "app.reloadExtension",
    "app.getAppPath" = "app.getAppPath",
    "app.restartApp" = "app.restartApp",
    "app.getNode" = "app.getNode",
    "app.isTestVerified" = "app.isTestVerified",
    "app.verifyTest" = "app.verifyTest",
    "app.continueRemainingTest" = "app.continueRemainingTest",
}

function handleRendererMessage(event: any, message: {type: Commands; payload: any}) {

}

export { handleRendererMessage };