import {defineConfig} from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://schema.gesslar.dev',
  integrations: [
    starlight({
      title: 'schema.gesslar.dev',
      logo: {
        src: './src/assets/logo.svg',
      },
      favicon: '/img/favicon.ico',
      social: {
        github: 'https://github.com/gesslar/schema.gesslar.dev',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/@vscode/codicons@0.0.36/dist/codicon.css',
          },
        },
      ],
      components: {
        Sidebar: './src/overrides/Sidebar.astro',
      },
      sidebar: [
        {label: 'BeDoc', autogenerate: {directory: 'bedoc'}},
        {label: 'Muddler', autogenerate: {directory: 'muddler'}},
        {label: 'mpackage', autogenerate: {directory: 'mudlet-mpackage'}},
      ],
    }),
  ],
})
