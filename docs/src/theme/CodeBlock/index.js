/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Highlight, { defaultProps } from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import Translate, { translate } from '@docusaurus/Translate';
import { useThemeConfig, parseCodeBlockTitle, parseLanguage, parseLines } from '@docusaurus/theme-common';
import usePrismTheme from '@theme/hooks/usePrismTheme';
import styles from './styles.module.css';
export default function CodeBlock({ children, className: blockClassName, metastring, title }) {
  const { prism } = useThemeConfig();
  const [showCopied, setShowCopied] = useState(false);
  const [mounted, setMounted] = useState(false); // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.

  useEffect(() => {
    setMounted(true);
  }, []); // TODO: the title is provided by MDX as props automatically
  // so we probably don't need to parse the metastring
  // (note: title="xyz" => title prop still has the quotes)

  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;
  const prismTheme = usePrismTheme(); // In case interleaved Markdown (e.g. when using CodeBlock as standalone component).

  const content = Array.isArray(children) ? children.join('') : children;
  const language = parseLanguage(blockClassName) ?? prism.defaultLanguage;
  const { highlightLines, code } = parseLines(content, metastring, language);

  const handleCopyCode = () => {
    copy(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const isShell = language === 'shell';

  return (
    <Highlight {...defaultProps} key={String(mounted)} theme={prismTheme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={clsx(styles.codeBlockContainer, blockClassName)}>
          {codeBlockTitle && (
            <div style={style} className={styles.codeBlockTitle}>
              {codeBlockTitle}
            </div>
          )}
          <div className={clsx(styles.codeBlockContent, language)}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              style={!isShell ? { ...(style || {}), padding: '0.25em' } : { ...(style || {}) }}
            >
              <code className={styles.codeBlockLines} style={{ paddingLeft: isShell ? '2rem' : '0rem' }}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0].content === '\n') {
                    line[0].content = '';
                  }

                  const lineProps = getLineProps({
                    line,
                    key: i,
                  });
                  lineProps.style = {
                    ...lineProps.style,
                    position: 'relative',
                  };

                  if (highlightLines.includes(i)) {
                    lineProps.className += ' docusaurus-highlight-code-line';
                  }

                  return (
                    <span key={i} {...lineProps}>
                      {isShell && (
                        <code
                          style={{
                            position: 'absolute',
                            top: '65%',
                            transform: 'translateY(-50%)',
                            left: '-1.1rem',
                            userSelect: 'none',
                          }}
                        >
                          $
                        </code>
                      )}
                      {line.map((token, key) => (
                        <span
                          key={key}
                          {...getTokenProps({
                            token,
                            key,
                          })}
                        />
                      ))}
                      <br />
                    </span>
                  );
                })}
              </code>
            </pre>

            <button
              type="button"
              aria-label={translate({
                id: 'theme.CodeBlock.copyButtonAriaLabel',
                message: 'Copy code to clipboard',
                description: 'The ARIA label for copy code blocks button',
              })}
              className={clsx(styles.copyButton, 'clean-btn')}
              onClick={handleCopyCode}
            >
              <Copy style={{ marginRight: 8 }} />
              {showCopied ? (
                <Translate id="theme.CodeBlock.copied" description="The copied button label on code blocks">
                  Copied
                </Translate>
              ) : (
                <Translate id="theme.CodeBlock.copy" description="The copy button label on code blocks">
                  Copy
                </Translate>
              )}
            </button>
          </div>
        </div>
      )}
    </Highlight>
  );
}

function Copy(props) {
  return (
    <svg width={12} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.112 0H4.478a.858.858 0 00-.857.857V2.87h3.901c.905 0 1.64.735 1.64 1.64v3.838h1.95a.858.858 0 00.857-.857V.857A.858.858 0 0011.112 0z"
        fill="snow"
        fillOpacity={0.43}
      />
      <path
        d="M7.522 3.652H.889a.858.858 0 00-.858.857v6.634c0 .472.385.857.858.857h6.633a.858.858 0 00.857-.857V4.509a.858.858 0 00-.857-.857z"
        fill="snow"
        fillOpacity={0.43}
      />
    </svg>
  );
}
