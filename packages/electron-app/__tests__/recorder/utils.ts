async function fillInput(inputText = "https://google.com") {
    const inputBar = await recorder.appWindow.locator(".url-input input");
    await inputBar.focus();
    await inputBar.fill("");
    await inputBar.type(inputText);
    return inputBar;
}

async function getInput() {
    return await recorder.appWindow.locator(".url-input input");
}
export { fillInput, getInput };