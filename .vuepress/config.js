module.exports = {
  title: 'Will Willems\' Blog',
  description: 'The personal page and blog of Will Willems',
  dest: "dist",
  markdown: {
    externalLinkSymbol: false,
    anchor: {
      permalink: false, permalinkBefore: false // disable links placed before headers
    }
  },
  themeConfig: {
    homeImgSrc: '/img/headshot.jpg',
    footerAuthorImgSrc: 'https://pbs.twimg.com/profile_images/1388422916707074048/hum1k57g_400x400.jpg',
    footerAuthorName: 'Will Willems',
    footerAuthorDescription: 'Web developer @ Nickolas Boyer and dabbling in digital products. Blogs about software development and more.'
  },
  additionalPages: [
    {
       path: '/posts/',
       frontmatter: {
          layout: 'Posts'
       }
    }
  ],
  plugins: {
    'feed': {
      canonical_base: 'https://willwillems.com',
      posts_directories: ['/posts/'],
    },
    'autometa': {
      site: {
        name   : 'Will Willems\' Blog',
      },
      author: {
        name   : 'Will Willems',
        twitter: 'will_rut',
      },
      canonical_base: 'https://willwillems.com',
    }
  }
}
