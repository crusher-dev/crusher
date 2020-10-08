export function loadContentInBody(content: string) {
  // @ts-ignore
  document.body.insertAdjacentHTML("beforeend", content);
}

export function removeAllTargetBlankFromLinks() {
  const { links } = document;
  let i;
  let length;

  for (i = 0, length = links.length; i < length; i++) {
    links[i].target == "_blank" && links[i].removeAttribute("target");
  }
}

export function startSession() {
  // @ts-ignore
  window.sessionStarted = true;
}

export function stopSession() {
  // @ts-ignore
  window.sessionStarted = false;
}

export function isSessionGoingOn() {
  // @ts-ignore
  return !!window.sessionStarted;
}

export function loadCSSIfNotAlreadyLoadedForSomeReason(href: any) {
  const ss = document.styleSheets;
  for (let i = 0, max = ss.length; i < max; i++) {
    if (ss[i].href == "/path/to.css") return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.id = "overlay_css";

  document.getElementsByTagName("head")[0].appendChild(link);
}

export function setAttributeForAllChildNodes(
  parent: any,
  attributeKey: string,
  attributeValue: string
) {
  return [...parent.children].map((children: any) => {
    children.setAttribute(attributeKey, attributeValue);
  });
}

export function hideAllChildNodes(parent: any) {
  return setAttributeForAllChildNodes(parent, "data-gone", "true");
}

export function sendPostDataWithForm(url: string, options: any = {}) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = url;
  form.target = "_blank";
  const optionKeys = Object.keys(options);
  for (const optionKey of optionKeys) {
    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = optionKey;
    hiddenField.value = options[optionKey];

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}
