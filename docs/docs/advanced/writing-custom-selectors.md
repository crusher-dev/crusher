---
title: Writing custom selectors with crusher
sidebar_label: Writing custom selectors
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note What you'll learn?

- Different ways to write selectors
:::

  Often, when writing complex test flows or to ensure stability across tests, you'll have to write custom selectors for your test. This guide will go through different ways to write selectors and their advantages.

## Writing Selectors

Depending on your web app and your needs, there are different approaches you can choose when writing selectors.


<Tabs>
  <TabItem value="developers" label="Text Selectors" attributes={{className: "tab-item"}} default>

:::tip 🦖 &nbsp;&nbsp;Pros:

1. No need to go through the DOM tree to write text selectors.
2. Easily locate elements without any id/classNames.
:::

#### Elements containing some text

```
text=Hello world
```

This will match all the elements containing this text inside them.

#### Elements containing exactly the same text

```
text="Hello world"
```

This will match all the elements containing exactly the same text ("Hello world"). E.g a "Hello world" button.

  </TabItem>
  <TabItem value="css-selectors" label="CSS Selectors" attributes={{className: "tab-item"}}>

:::tip 🦖 &nbsp;&nbsp;Pros:

1. Supports a variety of use-cases as it is web-standard
2. Every major browser provides great tooling to play with CSS selectors.
:::
CSS Selectors are the standard and powerful way to match elements for web applications. Crusher supports all the CSS selectors available, some of which are listed below with their use cases,

1. **Selector for elements by className**: `.button` will select all items with the "button" class.
2. **Selector for elements by Id**: `#bookingButton` will select the element with id "bookingButton"
3. **Selector for elements by tags**: `div` will select all div tag elements.
4. **Selector for elements by attributes**: `button[clickable=true]` will select all buttons with the attribute "clickable" set to true.
5. **Selector for elements with relationships**: `#container .button` will select all the `.button` elements inside the `#container` element.
6. **Selector with different combinations**: `div#container .button[clickable=true]` will select all the `.button` elements with clickable attribute to true inside `#container` which is `div`.

If you want to know more about CSS selectors, Mozilla provides excellent documentation [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

  </TabItem>
  <TabItem value="xpath-selectors" label="XPath Selectors" attributes={{className: "tab-item"}}>
  XPath was originally developed for XML documents but it also supports HTML documents. You can make use of XPath with crusher like,

1. `//button[@class='button']`: This xPath will select all items with the "button" class.
2. `//button[@id='button']`: This xPath will select elements with the id "button"
3. `//div`: This will select div elements
4. `//div/button[@class='button'][clickable="true"]`: This will select the button element having ".button" class and clickable set to "true" inside the div.
5. `//button[text()="Hello world"]`: This will select the button with text "Hello world"
6. `//.button[3]`: Select the third element with ".button" class

Here's the cheatsheet for XPath, if you are interested in going deeper [https://devhints.io/xpath](https://devhints.io/xpath)
  </TabItem>
</Tabs>

## Resources

1. [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
2. [https://playwright.dev/docs/selectors](https://playwright.dev/docs/selectors)
3. [https://devhints.io/xpath](https://devhints.io/xpath)
