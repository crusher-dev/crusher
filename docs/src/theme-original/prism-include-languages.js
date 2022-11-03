/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

const prismIncludeLanguages = (PrismObject) => {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: {prism = {}},
    } = siteConfig;
    const {additionalLanguages = []} = prism;
    window.Prism = PrismObject;
    additionalLanguages.forEach((lang) => {
      require(`prismjs/components/prism-${lang}`); // eslint-disable-line
    });
    window.Prism.languages.shell = {
      ...window.Prism.languages.shell,
      builtin: [
        window.Prism.languages.shell.builtin,
        // Pattern for npx
        {
          pattern: /(^|[^a-z0-9])(npx)(?=[\s\n]|$)/,
          lookbehind: true,
          	alias: 'npx-color'
        }
      ],
      keyword: [
        window.Prism.languages.shell.keyword,
        // Pattern for crusher.dev | crusher-cli | crusher-debug
        {
          pattern: /(^|[^a-z0-9])(crusher\.dev|crusher-cli|crusher-debug)(?=[\s\n]|$)/,
          lookbehind: true,
          alias: "crusher-command"
        }
      ],
      function: [
        window.Prism.languages.shell.environment,
        // Pattern for test:create | test:run
        {
          pattern: /(^|[^a-z0-9])(test:create|test:run)(?=[\s\n]|$)/,
          lookbehind: true,
        }
      ]
    }
    delete window.Prism;
  }
};

export default prismIncludeLanguages;
