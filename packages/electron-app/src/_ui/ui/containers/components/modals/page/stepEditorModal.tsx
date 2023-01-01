import React from "react";
import CodeMirror from '@uiw/react-codemirror';

import { tags as t } from '@lezer/highlight';
import { createTheme, CreateThemeOptions } from '@uiw/codemirror-themes';
import { useStore, useSelector } from "react-redux";

import { javascript } from '@codemirror/lang-javascript';
import { getAllSteps } from "electron-app/src/store/selectors/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { transformStringSelectorsToArray } from "electron-app/src/_ui/ui/screens/recorder/sidebar/stepsPanel/helper";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";

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

const StepEditorCustomCode = React.memo(({ code, stepId, onChange = () => { } }) => {
  const [show, setShow] = React.useState(false);
  const steps = useSelector(getAllSteps);
	const step = steps[stepId];
  const store = useStore();

	const getReadbleSelectors = (selectors: iSelectorInfo[] | null) => {
		if (!selectors) return [];

		return selectors
			.map((selector) => {
				return selector.value;
			});
	};


	const selectorsContent = React.useMemo(() => {
		let filteredSelectors = step.payload.selectors;
		return 	getReadbleSelectors(filteredSelectors).join("\n");
	}, [step]);

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

  const handleOnChange = (val, viewUpdate) => {
    const selectors = transformStringSelectorsToArray(val);
    
    store.dispatch(updateRecordedStep({
      ...step,
      payload: {
        ...step.payload,
        selectors
      }
    }, stepId));
  };

  return (

    <div style={{ marginLeft: -2 }}>
           {show ? <CodeMirror
              value={selectorsContent}
              height="200px"
              theme={theme}
              onChange={handleOnChange}

              //   extensions={extensions}
              basicSetup={{ foldGutter: false }}
              width="400px"
              className={"custom-scroll"}
            /> : ""}

            <style>
              {`
                	.cm-scroller::-webkit-scrollbar {
                    width: 10rem;
                    height: 10rem;
                  }
                  .cm-scroller::-webkit-scrollbar-track {
                    background-color: #0a0b0e;
                    box-shadow: none;
                  }
                  .cm-scroller::-webkit-scrollbar-thumb {
                    background-color: #1b1f23;
                    border-radius: 12rem;
                  }
                
                  .cm-scroller::-webkit-scrollbar-thumb:hover {
                    background-color: #272b31;
                    border-radius: 100rem;
                  }
                  .cm-scroller::-webkit-scrollbar-corner {
                    display: none;
                  }
              `}
            </style>
    </div>
  );
});




export { StepEditorCustomCode };


