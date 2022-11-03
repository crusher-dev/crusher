import OriginalTOC from '@theme-original/TOC';
import EditThisPage from '@theme/EditThisPage';
import React from 'react';

export default function TOC({ toc, editUrl, shouldHideTOC, ...props }) {
  const isEmpty = toc.length <= 0;
  // console.log(toc, props)

  if(shouldHideTOC) return null;
  // if (isEmpty) return null;

  const basic = [{ value: 'Overview', id: 'use-crusher', children: Array(0), level: 3 }];


  return (
    <div className="toc-wrapper">
      <h2>On this page</h2>
      <OriginalTOC toc={isEmpty ? basic : toc} {...props} />
      <EditThisPage editUrl={editUrl} />
    </div>
  );
}
