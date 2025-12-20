import {themes as prismThemes} from 'prism-react-renderer';

const { vsLight: PrismLight, vsDark: PrismDark } = prismThemes

const config = {
  title: 'schema.gesslar.dev',
  tagline: 'JSON Schema Repository',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://schema.gesslar.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'gesslar',
  projectName: 'SCHEMATA',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social.png',
    scrollToTop: true,
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'schema.gesslar.dev',
      logo: {
        alt: 'schema.gesslar.dev',
        src: 'img/logo.svg',
        href: '/',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'bedocSidebar',
          position: 'left',
          label: 'BeDoc',
        },
        {
          type: 'docSidebar',
          sidebarId: 'muddlerSidebar',
          position: 'left',
          label: 'Muddler',
        },
        {
          href: 'https://github.com/gesslar/schema.gesslar.dev',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `🙅🏻<del>Copyright ©${new Date().getFullYear()}</del>🙅🏻<br /><a href="https://unlicense.org"/>Unlicense</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: PrismLight,
      darkTheme: PrismDark,
    },
  },
};

export default config;
