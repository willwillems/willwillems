---
title: 'Write a custom Vuepress theme'
pubDate: 2019-01-28
duration: '12 min'
category: 'VuePress'
heroImage: 'https://source.unsplash.com/mIylM2RC16M/800x800'
---

VuePress offers a very solid system to integrate your own theme into a project and it is a lot easier than you might think.

::: info

If you don't want to go trough all of this manually there is an example available [here](https://github.com/NickolasBoyer/vuepressblogstarter).

:::

## Who should use this guide

- You came from my previous article "Building a website with VuePress"
- You want to create a custom website using VuePress and are already familiar with the general workings of VuePress

## Who should not use this guide

- You mainly just want to change the color scheme of your newly created docs to match your project, for that the docs will be [more than sufficient](https://vuepress.vuejs.org/config/#styling).
- You want to create a custom theme for your doc's. I would only do this if you are creating the docs for a rather large project, the default VuePress theme is absolutely excellent supporting many amazing features right out of the box, you can always change the looks of that theme [using the palette stylus file](https://vuepress.vuejs.org/config/#styling). Otherwise proceed.

## Lets get started

You are probably already somewhat familiar with the VuePress directory structure, if you are not or just need a refresher [you can check it out here](https://vuepress.vuejs.org/guide/directory-structure.html#directory-structure).

As you can see there is an optional `theme` folder inside the `.vuepress` directory, this is where our theme will reside. VuePress will automatically detect that it is being used.

We'll start of as simple as possible.

## Creating your first layout

The VuePress theming system uses certain `.vue` files to determine how to transform your Markdown pages into HTML. These "layout" files will reside in the `layouts` directory inside your theme folder.

In it's most simple form a layout `.vue` component may look like this:

```html
<template>
	<div class="theme-container">
		<content />
	</div>
</template>
```

You can probably already see what is going on here. The Vue single-file component is processed and the processed content from your markdown file is inserted using the `<Content/>` tag.

Assuming you have at least an `[README.md](http://readme.md)` file in your project root with some markdown in it you can now go along and create your first layout file called `Layout.vue`. This is the default layout file VuePress will pick if none is specified inside the Markdown [front matter](https://vuepress.vuejs.org/guide/frontmatter.html#front-matter).

Your file structure should look something like this:

```
my-project
|--.vuepress
|  |--theme
|  |  |--layouts
|  |  |  |--Layout.vue
|  |--config.js
|--node_modules
|--package.json
|--README.md
```

When running the dev server or build command you should be able to see your `[README.md](http://readme.md)` content displayed in the `Layout.vue` file you just created.

## Using multiple layout components

### Defining the desired layout in md

Naturally you are able to create more than one layout file. To keep this example simple let's say you are creating a blog, you'll probable have the default layout file which represents a blog article but you'll also want a separate layout for you landing/home page to display your articles in a list.

To create an alternate layout file just put another file inside the `layouts` directory, in this case you'd probably call it `Home.vue` but you can pick any name you'd like.

In order for VuePress to know that it has to use this layout instead of the default one we'll have to specify it in the markdown file's front matter. This can be used to specify all sorts of options like the language, author and publish date of the article but for now we'll keep it simple and just specify the layout we'll be using:

```md
---
layout: Home
---

# Home page layout

This is my homepage
```

However you'll probably want your homepage to be a little more exciting than just a text document.

### Using content slots

In order to populate multiple sections with content data VuePress uses content slots. For example you might want to create 3 different sections on you home page: "About", "Articles" and "Contact". The proper way to do this is with content slots.

As we have seen in the earlier section of this article you can use the `<Content/>` tag to inject the markdown in your `.vue` file, we'll use the same mechanism here but we'll specify a slot as a property of the content tag like so:

```html
<div class="home">
  <div id="articles">
    <Content slot-key="articles" />
  </div>
  <div id="about">
    <Content slot-key="contact">
  </div>
</div>
```

The Markdown needed to fill these slots is very straightforward:

```md
# This will still be the title

And this content will still be available through the general `<Content/> tag.

::: slot articles

## What I Write

But this will only be available in the 'articles' slot
:::

::: slot about

## Who am I

And this in the 'about' slot
:::
```

This way you can be much more flexible with how your content is displayed on your pages while still using markdown in a clean and maintainable way.

### Using pre-processors

If you want to use some pre-processors like SCSS or Pug to make creating your Vue components a bit easier you can, no need to configure anything except to specify the language in your template and style tags and to add the required dependencies to the project using NPM.

### The default 404 page

Besides the `layouts/Layout.vue` file there is one more layout file that has a predefined function which is the `layouts/404.vue` file. As you might guess this file will be served on a 404 if you create it.

## EnhanceApp file, creating custom routes and importing custom styles

There are several ways to modify the more _under-the-hood_ behaviour of your vuepress app. We can do this by modifying the `EnhanceApp.js` file which is located at the root of the theme folder.

### Importing custom styles

You'll probably want to define some global styles for your website, there are multiple ways to approach this but I'll show you my preferred way and then you can customise from there if you want to.

```
theme
|--style
|  |--vars.scss
|  |--mixins.scss
|  |--general.scss
|  |--index.scss
```

I think it's pretty straightforward what these stylesheets contain. I use the `index.scss` file to import them all and then subsequently I'll import that file into the project.

The way I do this is as follows:

```js
export default (
	{
		// Vue, // the version of Vue being used in the VuePress app
		// options, // the options for the root Vue instance
		// router // the router instance for the app
		// siteData // site metadata
	},
) => {
	// import styles
	require('./styles/index.scss');
};
```

You'll still have to import the `vars.scss` manually into a Vue component when you want to use them but otherwise this works very well.

### Defining custom routes

As you might have already noticed in the previous section the EnhanceApp file can be used to define additional routes using the router instance that is provided by VuePress:

```js
export default ({
	// Vue, // the version of Vue being used in the VuePress app
	// options, // the options for the root Vue instance
	router, // the router instance for the app
	// siteData // site metadata
}) => {
	// add routes
	router.addRoutes([
		{ path: '/example-vue-page', component: ExampleVuePage },
	]);
};
```

You can read more about the `addRoutes` method [here in the Vue Router docs](https://router.vuejs.org/api/#router-addroutes).

### Registering Vue plugins

Finally you'll also have access to the Vue instance itself inside the EnhanceApp file enabling you do do many things such as registering a plugin:

```js
import VeeValidate from 'vee-validate';

export default ({
	Vue, // the version of Vue being used in the VuePress app
	// options, // the options for the root Vue instance
	// router // the router instance for the app
	// siteData // site metadata
}) => {
	// Register VeeValidate
	Vue.use(VeeValidate);
};
```

## Using variables inside your layouts

### Global variables using config.js

For global variables for your theme you can use the `themeConfig` field in your `options.js` file, these variables will subsequently be available in your layouts on the `$site.themeConfig` object.

### Page specific variables using front matter

Most of your variable will belong to a specific page though, for this you can use the Markdown front matter we discussed earlier, for example:

```md
---
varOne: hello
varTwo: VuePress
---

# Home page layout

This is my homepage
```

These variables will be available on the `$page`'s front matter object: `this.$page.frontmatter.varOne` which will have the value `"hello"`.

### Site and page variables

There is much more data available on these two objects, the VuePress docs are very clear on this, I suggest you [take a look](https://vuepress.vuejs.org/theme/writing-a-theme.html#site-and-page-metadata) if you haven't already done so.

## Tips & Tricks

### Stop the VuePress build from whining with an empty index file

Create an `index.js` file in your root that just exports an empty object like:

```js
module.exports = {};
```

This is not required for themes that will not be published as NPM modules but it stops VuePress from logging errors during the build process.

### Style your code blocks and content containers in order to display them properly

In order for code highlighting and [custom containers](https://vuepress.vuejs.org/guide/markdown.html#custom-containers) to work you need to import the proper styles, for code highlighting you can either pick/create your own prism.js theme or you can import one from the package itself like the default VuePress theme does by placing this line at the bottom of your layout file.

```html
<style src="prismjs/themes/prism-tomorrow.css"></style>
```

You'll need a separate fix to highlight inline-code, I'm just using a very simple bit of global CSS:

```css
p > code,
li > code {
	background-color: rgba(103, 149, 201, 0.12);
	padding: 0.25rem 0.5rem;
	border-radius: 3px;
}
```

In order for custom containers to display properly you can either write your own style or [copy it straight from the default VuePress theme](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/theme-default/styles/custom-blocks.styl) which is what I did.

### Hiding the hashtags in front of sub-headers

This is probably going to be available as a config option in the future but currently you can hide them by using this CSS snippet:

```css
svg.icon.outbound,
.header-anchor {
	display: none;
}
```

### Style compiled markdown inside a scoped style layout page

To style the nested HTML in your layout pages (when using scoped style) you can use `/deep/` or `>>>` like so:

```css
.parent /deep/ .child {
	color: red;
}
/* or */
.parent >>> .child {
	color: red;
}
```

I strongly prefer the `/deep/` method since this does not try to look like it's valid SCSS/CSS which it is not.

### Something is not working as expected during development (and it's not you)

VuePress' hot reloading works pretty well but with some changes it doesn't quite pick up the change, restarting the dev server should do the trick in this case. If this does not work, it's probably you.

## That's it!

I hope everything worked out, I would love to see what you came up with, show me on Twitter!
