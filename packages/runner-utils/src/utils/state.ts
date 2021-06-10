let pageUrl: string | null = null;

function setPageUrl(url: string) {
	pageUrl = url;
}

function getLastSavedPageUrl(){
	return pageUrl;
}

export {setPageUrl, getLastSavedPageUrl};