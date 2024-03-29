module.exports = {
  docs: [
    {
      type: 'category',
      label: '🦖 Overview',
      collapsed: true,
      items: [
        'overview/index',
        'overview/features',
        'development/architecture',
      ],
    },
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/create-your-first-test',
        'getting-started/what-is-crusher',
      ],
    },

    {
      type: 'category',
      label: '💡 Guides',
      collapsed: true,
      items: ['guides/setting-up-services', 'guides/using-email-apis'],
    },
    {
      type: 'category',
      label: '⚽ Integration',
      collapsed: true,
      items: ['setting-up/manage-alerts', 'setting-up/github', 'integrations/with-vercel'],
    },
    {
      type: 'category',
      label: '🏄‍♂️ Code',
      collapsed: true,
      items: [ 'code/writing-custom-code', 'advanced/custom-code-usecases-1', 'advanced/making-network-requests', 'advanced/writing-custom-selectors'],
    },
    {
      type: 'category',
      label: '🧱 Contribute',
      collapsed: true,
      items: [
        'development/contributing',
        'development/docker-deploy-locally',
        'development/setting-up-development-env',
      ],
    },
    {
      type: "doc",
      id: "advanced/faq",
      label: "FAQ"
    },
  ],


  cli: [
    {
      type: 'category',
      label: 'CLI Documentation',
      collapsed: true,
      items: ['cli', 'cli/using-cli-in-project', 'cli/custom-host', 'cli/global-option', 'cli/project-options'],
    },
    {
      type: 'category',
      label: 'Command Reference',
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: 'cli/commands', // Generate section automatically based on files
        },
      ],
    },
  ],
};
