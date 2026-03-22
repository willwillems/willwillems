---
title: "Add Tailwind to a Svelte Webpack project"
pubDate: 2020-10-27
duration: "5 min"
category: "Svelte"
---
Wanna use Tailwind with a Svelte Webpack project? It's super easy, takes about 5 minutes and should work without any problems!

## Install tailwind

Install Tailwind with `npm i -D tailwindcss` and create a `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  future: {},
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```
*This file is not required but you really should include it, Tailwinds power lies in it's customizability.* 

## Install postCSS etc

Run: `npm i -D postcss postcss-loader precss autoprefixer`

Create a `postcss.config.js` file where you require `tailwindcss`:

```js
//postcss.config.js
module.exports = {
  plugins: [
    require('precss'),
		require('tailwindcss'),
    require('autoprefixer')
  ]
}
```
*In this example we're also importing `precss` and `autoprefixer`. These plugins are real no-brainers and you should probably use them unless you have a specific reason not to.*

**Make sure you've set the `emitCss` option of `svelte-loader` in your `webpack.config.js` to `true`.**

## Pipe your CSS trough PostCSS loader

Add this little piece of config to the bottom of your CSS `module.rules` in `webpack.config.js`, right after `css-loader`.

```
{
  loader: 'postcss-loader'
}
```

This actually sends your CSS code to PostCSS to be transformed.

## Advanced (recommended): Add a Svelte config file

If your setup is throwing CSS errors you probably need this, it's a good idea to include it anyway.

Create a `svelte.config.js` file and `npm i --save-dev svelte-preprocess`. Many utilities in the svelte ecosystem hook into this config file. We're going to import it into our Webpack config to configure `svelte-loader`.

```js
// svelte.config.js
const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  // ...other svelte options
}
```

Import this config into your Webpack config with: `const svelteConfig = require('./svelte.config')` and include the preprocess config in the options of your `svelte-loader`:

```js
{
  test: /\.svelte$/,
  use: {
    loader: 'svelte-loader',
    options: {
      emitCss: true,
      preprocess: svelteConfig.preprocess,
    },
  },
}
```

## Optional: include global CSS trough JS

You might have been importing global CSS without processing it, you can fix this by moving the importing of this file to your JS entry file and putting the import at the top there like:

```js
//main.js
import './global.css';
import App from './App.svelte';
```

## Enabling Intellisense

Add `{ "svelte": "html" }` to the `includeLanguages` setting of the Tailwind Intellisense plugin to get autocompletion.
