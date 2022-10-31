/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import clsx from 'clsx';
import LastUpdated from '@theme/LastUpdated';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import styles from './styles.module.css';
import { ThemeClassNames } from '@docusaurus/theme-common';
import './new.css';
import { DiscordSVG, GithubSVG } from '../../constants/svgs';
import { css } from '@emotion/css';

function TagsRow(props) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterTagsRow, 'row margin-bottom--sm')}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}
function sendMessage(message) {
  const iframe = document.querySelector('.giscus-frame');
  if (!iframe) return;
  iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
}

function CommunityAndFeedback({ editUrl }) {
  React.useEffect(() => {
    const commentBox = document.querySelector('#comments');
    const script = document.createElement('script');

    script.setAttribute('id', 'giscuss-comment-box');
    script.setAttribute('data-category-id', 'DIC_kwDOG24pmc4COFWH');
    script.setAttribute('data-repo', 'crusherdev/docsv2');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-repo-id', 'R_kgDOG24pmQ');
    script.setAttribute('data-reactions-enabled', '0');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('data-theme', 'https://crusher.dev/docs/comment_style.css');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.defer = true;
    commentBox.appendChild(script);

    const githubJS = document.querySelector('#github_js');
    const githubScript = document.createElement('script');

    githubScript.src = 'https://buttons.github.io/buttons.js';
    githubScript.async = true;
    githubScript.defer = true;
    githubJS.appendChild(githubScript);

    return () => {
      commentBox.innerHTML = '';
      githubJS.innerHTML = '';
    };
  }, []);
  return (
    <div className="footer-container-box">
      <div id="support-page">
        <div className="heading">Join community for support and feedback</div>
        <div className="second-box">
          <div className="social-links">
            <a href="https://github.com/crusherdev/crusher" target={'_blank'}>
              <div className={socialBlock}>
                <GithubSVG /> Github
              </div>
            </a>
            {/* <div className={`${socialBlock} ${discordBlock}`}> <DiscordSVG/> Discord</div> */}
          </div>
          <div className={githubSupport}>
            <img src="https://avatars.githubusercontent.com/u/7537349?s=96&v=4" height={20} width={20} />
            <img src="https://avatars.githubusercontent.com/u/4746156?v=4" height={20} width={20} />
            <span style={{ marginRight: 12 }}>200+ supporters</span>

            <a
              class="github-button"
              href="https://github.com/crusherdev/crusher"
              data-icon="octicon-star"
              aria-label="Star crusherdev/crusher on GitHub"
            >
              Star
            </a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, fontWeight: 600 }}>Comment/Discuss</div>
      <div>
        <div id="comments"></div>

        <div id="github_js"></div>
      </div>
    </div>
  );
}

const githubSupport = css`
  img {
    margin-right: 12px;
    border-radius: 50px;
  }

  display: flex;
  align-items: center;
`;
const socialBlock = css`
  display: flex;
  align-items: center;
  svg {
    margin-right: 8px;
  }

  :hover {
    color: #7766ff;
    cursor: pointer;
  }
`;
const discordBlock = css`
  margin-left: 12px;
`;

function FeedbackOption() {
  const [feedback, setFeedback] = useState(null);
  return (
    <div className="feedback-section">
      {feedback === null && (
        <div className="feedback-button-container">
          <div className="feedback-button" onClick={setFeedback.bind(this, 'yes')}>
            Yes
          </div>
          <div className="feedback-button feedback-button-right" onClick={setFeedback.bind(this, 'no')}>
            No
          </div>
        </div>
      )}

      {feedback === 'yes' && <div className="feedback-response-text">Thanks for your feedback :D</div>}

      {feedback === 'no' && <div className="feedback-response-text">Please let us know how we can improve.</div>}
    </div>
  );
}

function EditMetaRow({ editUrl, lastUpdatedAt, lastUpdatedBy, formattedLastUpdatedAt }) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, 'row')}>
      <CommunityAndFeedback editUrl={editUrl} />

      {/* <div>{editUrl && <EditThisPage editUrl={editUrl} />}</div> */}

      <div className={clsx('col', styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  );
}

export default function DocItemFooter(props) {
  const { content: DocContent } = props;
  const { metadata } = DocContent;
  const { editUrl, lastUpdatedAt, formattedLastUpdatedAt, lastUpdatedBy, tags } = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  if (!canDisplayFooter) {
    return <></>;
  }

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}
    </footer>
  );
}
