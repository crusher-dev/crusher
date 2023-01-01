import React from "react";
import CodeMirror from '@uiw/react-codemirror';

import { tags as t } from '@lezer/highlight';
import { createTheme, CreateThemeOptions } from '@uiw/codemirror-themes';

import { javascript } from '@codemirror/lang-javascript';

export const okaidiaInit = (options?: CreateThemeOptions) => {
  const { theme = 'dark', settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      background: '#090909',
      foreground: '#FFFFFF',
      caret: '#FFFFFF',
      selection: '#49483E',
      selectionMatch: '#49483E',
      gutterBackground: '#090909',
      gutterForeground: '#FFFFFF70',
      lineHighlight: '#00000059',
      ...settings,
    },
    styles: [
      { tag: [t.comment, t.documentMeta], color: '#8292a2' },
      { tag: [t.number, t.bool, t.null, t.atom], color: '#ae81ff' },
      { tag: [t.attributeValue, t.className, t.name], color: '#e6db74' },
      {
        tag: [t.propertyName, t.attributeName],
        color: '#a6e22e',
      },
      {
        tag: [t.variableName],
        color: '#9effff',
      },
      {
        tag: [t.squareBracket],
        color: '#bababa',
      },
      {
        tag: [t.string, t.special(t.brace)],
        color: '#e6db74',
      },
      {
        tag: [t.regexp, t.className, t.typeName, t.definition(t.typeName)],
        color: '#66d9ef',
      },
      {
        tag: [t.definition(t.variableName), t.definition(t.propertyName), t.function(t.variableName)],
        color: '#fd971f',
      },
      // { tag: t.keyword, color: '#f92672' },
      {
        tag: [t.keyword, t.definitionKeyword, t.modifier, t.tagName, t.angleBracket],
        color: '#f92672',
      },
      ...styles,
    ],
  });
};

const extensions = [javascript()];

const StepEditorCustomCode = React.memo(({ code, onChange = () => { } }) => {
  const [show, setShow] = React.useState(false);

  const theme = React.useMemo(() => {
    return okaidiaInit({
      settings: {
        caret: '#62BDFF',
        fontFamily: 'monospace',
        fontSize: 12
      }
    });
  }, []);
  
  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    });

    setShow(false);
  }, []);
  return (

    <div style={{ marginLeft: -22 }}>
           {show ? <CodeMirror
              value={`input[data-ved="0ahUKEwi-8v2Q2qb8AhVmTmwGHe3QBvQQ39UDCAU"]
      input[jsaction="paste:puy29d;"]
      input[maxlength="2048"]
      input[name="q"]
      input[type="text"]
      input[aria-autocomplete="both"]
      input[aria-haspopup="false"]
      input[autocapitalize="off"]
      input[autocomplete="off"]
      input[autocorrect="off"]
      input[autofocus=""]
      input[role="combobox"]
      input[spellcheck="false"]
      input[title="Search"]
      input[value=""]
      input[aria-label="Search"]
      .a4bIc > .gLFyf
      .SDkEP .gLFyf
      .RNNXgb .gLFyf
      //BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]	
            `}
              height="200px"
              theme={theme}


              //   extensions={extensions}
              basicSetup={{ foldGutter: false }}
              width="400px"
            /> : ""}
    </div>
  );
});




export { StepEditorCustomCode };


