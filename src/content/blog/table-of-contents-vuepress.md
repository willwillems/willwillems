---
title: 'Creating a simple table of contents in Vuepress'
pubDate: 2020-12-18
duration: '2 min'
category: 'VuePress'
---

Most examples use pretty complicated Markdown extensions or way to extensive implementations, here's a super simple way.

It's kinda hard to find in the docs but you can access a page's headers trough `this.$page.headers`. This will give you an array filled with objects like these: `{ level: 2, slug: "why-vuepress", title: "Why Vuepress?" }` describing the page's headers.

## The JavaScript

We can just whip up some simple HTML to render this using either a list structure:

```pug
ol
  li( v-for="header in $page.headers" :key="header.slug" :data-header-level="header.level")
    a( :href="`#${header.slug}`" ) {{ header.title }}
```

Or a navigation markup:

```pug
aside
  nav
    a( v-for="header in $page.headers" :key="header.slug" :data-header-level="header.level" :href="`#${header.slug}`") {{ header.title }}
```

## The CSS

As you can see we're passing the level as a data attribute. That's so we can do this:

```css
[data-header-level] {
	margin-left: 1.5rem;
}

[data-header-level='2'] {
	margin-left: 0.75rem;
}

[data-header-level='1'] {
	margin-left: 0rem;
}
```

_Best to nest this inside your table of contents selector_

That's it, good luck!
