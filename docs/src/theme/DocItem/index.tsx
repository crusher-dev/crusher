/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useWindowSize from '@theme/hooks/useWindowSize';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import Seo from '@theme/Seo';
import type { Props } from '@theme/DocItem';
import DocItemFooter from '@theme/DocItemFooter';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { MainHeading } from '@theme/Heading';
import styles from './styles.module.css';
import { ThemeClassNames } from '@docusaurus/theme-common';

// CUSTOM CODE
import DocDemo from '@components/global/DocDemo'
import { css } from '@emotion/css';

export default function DocItem(props: Props): JSX.Element {
  const { content: DocContent, versionMetadata } = props;
  const { metadata, frontMatter } = DocContent;
  const {
    image,
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
    //#region ------- CUSTOM CODE --------
    demoUrl,
    demoSourceUrl,
    shouldHideMeta
    //#endregion
  } = frontMatter;

  //#region --------- CUSTOM CODE ---------
  const { metadata: { editUrl } } = DocContent;
  //#endregion

  const { description, title } = metadata;

  // We only add a title if:
  // - user asks to hide it with frontmatter
  // - the markdown content does not already contain a top-level h1 heading
  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === 'undefined';

  const windowSize = useWindowSize();

  const canRenderTOC =
    !hideTableOfContents && DocContent.toc && DocContent.toc.length > 0;


  return (
    <>
      <Seo {...{ title, description, keywords, image }} />


      <div className="row">

        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}>

          <DocVersionBanner versionMetadata={versionMetadata} />
          <div style={{ maxWidth: shouldHideMeta ? "95%" : 'undefined' }} className={styles.docItemContainer}>
            <article>
              {versionMetadata.badge && (
                <span
                  className={clsx(
                    ThemeClassNames.docs.docVersionBadge,
                    'badge badge--secondary',
                  )}>
                  Version: {versionMetadata.label}
                </span>
              )}

              {canRenderTOC && (
                <TOCCollapsible
                  toc={DocContent.toc}
                  minHeadingLevel={tocMinHeadingLevel}
                  maxHeadingLevel={tocMaxHeadingLevel}
                  className={clsx(
                    ThemeClassNames.docs.docTocMobile,
                    styles.tocMobile,
                  )}
                />
              )}

              {shouldHideMeta ? (
                  <div
                           className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
                                    <DocContent />
                   </div>
              ) : (
                  <div
                  className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
                    {/*
                    Title can be declared inside md content or declared through frontmatter and added manually
                    To make both cases consistent, the added title is added under the same div.markdown block
                    See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                    */}
                    {shouldAddTitle && <MainHeading>{title}</MainHeading>}


                    <div className={breadCrumbCSS}>
                      <a href="https://docs.crusher.dev">Home</a>
                      <span id="separator">></span>
                      <a href="https://docs.crusher.dev">Docs</a>
                    </div>

                    <DocContent />
                </div>
              )}
        
              <DocItemFooter {...props} />
            </article>

            <DocPaginator metadata={metadata} />
          </div>

          {/* ------- CUSTOM CODE -------- */}
          <div className="spacer"></div>
          {/* ---------------------------- */}


          {/* ------- CUSTOM CODE -------- */}
          {demoUrl && (
            <div
              className={clsx(
                'doc-demo-wrapper'
              )}
            >
              <DocDemo url={demoUrl} source={demoSourceUrl} />
            </div>
          )}
          {/* ---------------------------- */}
        </div>

        {/* ------- CUSTOM CODE -------- */}
        {/* {renderTocDesktop && (
          <div className="col col--3">
            <TOC
              toc={DocContent.toc}
              minHeadingLevel={tocMinHeadingLevel}
              maxHeadingLevel={tocMaxHeadingLevel}
              className={ThemeClassNames.docs.docTocDesktop}
            />
          </div>
        )} */}
        <div className="end">
          {!demoUrl && !shouldHideMeta && !hideTableOfContents && DocContent.toc && (
            <TOC
              toc={DocContent.toc}
              minHeadingLevel={tocMinHeadingLevel}
              maxHeadingLevel={tocMaxHeadingLevel}
              editUrl={editUrl}
              className={ThemeClassNames.docs.docTocDesktop}
            />
          )}
        </div>
        {/* -------------- */}

      </div >
    </>
  );
}


const breadCrumbCSS = css`
letter-spacing: 0.02em;

color: #848484;
margin-top: -17px !important;
margin-bottom: 32px !important;

a{
  font-size: 11.5px;
  color: #848484;
  :hover{
    text-decoration: underline;
  }
}

#separator{
  margin: 0 4px;
  font-size: 10px;
}
`