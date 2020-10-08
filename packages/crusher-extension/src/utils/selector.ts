import { finder } from "@medv/finder";

const uniqueSelector = require("unique-selector");
const uniqueSelector2 = require("unique-selector-2");

function getXpathTo(element: any): any {
  if (element.id !== "") return `id("${element.id}")`;
  if (element === document.body) return element.tagName;

  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element)
      return `${getXpathTo(element.parentNode)}/${element.tagName}[${ix + 1}]`;
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

function getFinderSelector(elementNode: HTMLElement) {
  const optimizedMinLength = elementNode.getAttribute("id") ? 2 : 10; // if the target has an id, use that instead of multiple frames selectors
  // @ts-ignore
  return finder(elementNode, { seedMinLength: 5, optimizedMinLength });
}

export function getSelectors(elementNode: HTMLElement) {
  const _uniqueSelector2 = new uniqueSelector2.default({});
  const selectors = _uniqueSelector2.getUniqueSelector(elementNode);

  return [
    {
      type: "customFinder",
      value: getFinderSelector(elementNode),
      uniquenessScore: 1,
    },
    {
      type: "uniqueSelector",
      value: uniqueSelector.default(elementNode),
      uniquenessScore: 1,
    },
    { type: "xpath", value: getXpathTo(elementNode), uniquenessScore: 1 },
    ...selectors.list,
  ];
}
