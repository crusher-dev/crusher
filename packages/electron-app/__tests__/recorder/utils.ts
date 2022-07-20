async function fillInput(inputText = "https://google.com") {
    const inputBar = await recorder.appWindow.waitForSelector(".target-site-input input");
    await inputBar.focus();
    await inputBar.type(inputText);
    return inputBar;
}

export { fillInput };