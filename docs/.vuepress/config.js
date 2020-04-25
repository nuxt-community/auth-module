module.exports = {
  title: 'Auth Module',
  description: 'Authentication module for Nuxt',
  themeConfig: {
    algolia: {
      apiKey: '40443e7f7f59ee3f7927b6b9176100a6',
      indexName: 'nuxtjs_auth'
    },
    repo: 'nuxt-community/auth-module',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    sidebarDepth: 2,
    sidebar: {
      '/api/': [
        '/api/auth',
        '/api/options',
        '/api/storage',
        '/api/tokens',
        '/api/refreshController'
      ],
      '/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '/',
            '/guide/setup',
            '/guide/middleware',
            '/guide/scheme',
            '/guide/provider',
          ]
        },
        {
          title: 'Schemes',
          collapsable: false,
          children: [
            '/schemes/local',
            '/schemes/cookie',
            '/schemes/refresh',
            '/schemes/oauth2'
          ]
        },
        {
          title: 'Providers',
          collapsable: false,
          children: [
            '/providers/auth0',
            '/providers/facebook',
            '/providers/github',
            '/providers/google',
            '/providers/laravel-passport',
            '/providers/laravel-sanctum',
            '/providers/laravel-jwt',
          ]
        }, {
          title: 'Recipes',
          collapsable: false,
          children: [
            '/recipes/extend'
          ]
        }
      ],
    },
    nav: [
      {
        text: 'Guide',
        link: '/'
      },
      {
        text: 'API',
        link: '/api/'
      }
    ]
  }
}
