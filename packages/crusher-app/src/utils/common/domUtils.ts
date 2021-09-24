export function openPopup(url: string) {
	const newwindow = window.open(url, "name", "height=600,width=1080");
	if (window.focus) {
		newwindow.focus();
	}
	return newwindow;
}


