const path = require('path');

const BASE_URL = '';

module.exports = {
  title: 'Crusher docs',
  tagline:
    'Crusher is low-code testing platform, build test remarkably fast. Ship high quality product, faster than ever before.',
  url: 'https:/crusher.dev',
  baseUrl: `${BASE_URL}/`,
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: { label: 'English' },
    },
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://app.crusher.dev/assets/img/favicon.png',
  organizationName: 'crusherdev',
  projectName: 'crusher-docs',
  themeConfig: {
    autoCollapseSidebarCategories: true,
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: 'Crusher Logo',
        src: `/logos/logo.svg`,
        srcDark: `/logos/logo.svg`,
        href: '/',
        target: '_self',
        width: 78,
        height: 24,
      },
      items: [
        // {
        //   type: 'doc',
        //   docId: 'index',
        //   label: 'Guide',
        //   position: 'left',
        // },
        // {
        //   type: 'doc',
        //   docId: 'components',
        //   label: 'Components',
        //   position: 'left',
        // },
        {
          type: 'doc',
          docId: 'getting-started/what-is-crusher',
          label: 'home',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    tagManager: {
      trackingID: 'GTM-TKMGCBC',
    },
    prism: {
      theme: { plain: {}, styles: [] },
      // https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js
      additionalLanguages: ['shell-session', 'http'],
    },
    algolia: {
      appId: '2IUNW2DWDR',
      apiKey: 'c69996a42bcad17c5a007b291a08b3b7',
      indexName: 'crusher_docs',
      contextualSearch: true,
    },
  },
  plugins: [
    'docusaurus-tailwindcss',
    'docusaurus-plugin-sass',
    [
      'docusaurus-plugin-module-alias',
      {
        alias: {
          'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
          react: path.resolve(__dirname, './node_modules/react'),
          'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
          '@components': path.resolve(__dirname, './src/components'),
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: ({ versionDocsDirPath, docPath, locale }) => {
          return `https://github.com/crusherdev/docsv2/edit/main/${versionDocsDirPath}/${docPath}`;
        },
        exclude: ['README.md'],
        lastVersion: 'current',
        versions: {
          current: {
            label: 'v6',
            banner: 'none',
          },
        },
      },
    ],
    '@docusaurus/plugin-content-pages',
    '@docusaurus/plugin-debug',
    '@docusaurus/plugin-sitemap',
    '@ionic-internal/docusaurus-plugin-tag-manager',
  ],
  themes: [
    [
      //overriding the standard docusaurus-theme-classic to provide custom schema
      path.resolve(__dirname, 'docusaurus-theme-classic'),
      {
        customCss: [
          require.resolve('./node_modules/modern-normalize/modern-normalize.css'),
          require.resolve('./node_modules/@ionic-internal/ionic-ds/dist/tokens/tokens.css'),
          require.resolve('./src/styles/custom.scss'),
        ],
      },
    ],
    path.resolve(__dirname, './node_modules/@docusaurus/theme-search-algolia'),
  ],
  customFields: {},
};
