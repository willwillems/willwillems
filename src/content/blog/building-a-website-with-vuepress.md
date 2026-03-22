---
title: "Building a website with VuePress"
pubDate: 2019-01-23
duration: "8 min"
category: "VuePress"
heroImage: "https://source.unsplash.com/Wiu3w-99tNg/"
---
VuePress is a simple static site generator initially created to support the docs for large projects. It however it can do many more things as you are about to learn, personally I use it to generate [my website and blog](https://willwillems.com). 

**Why VuePress:**

- Makes your website blazing fast & SEO friendly.
- Development is super simple and an absolute joy.
- Very clean separation of your content from the rest of your site.
- Provides a full-fledged Vue instance no different from normal development. You are still able to create custom routes, use Vue plugins, anything that you would be able to normally.
- Flexible plugin API which, for example, I am using to automatically generate an RSS feed for my blog every time I update the content.
- Use Markdown with markdown-it and its extensive ecosystem.
- Being able to use Vue components inside your markdown.

## Who this guide is for

- You want to create a static website powered by Vue  
  :x: → *Why are you even here?*  
  :white_check_mark: → *Continue* :arrow_heading_down:
- Your website is content-centric (e.g. not a web app)    
  :x: → *Static is going to be tougher for you in general but you might checkout [Nuxt](https://nuxtjs.org)*  
  :white_check_mark: → *Continue* :arrow_heading_down:
- Your content is, or is going to be, in markdown  
  :x: → *If you are already on any kind of JAMstack [Nuxt](https://nuxtjs.org) might be a better option for now*  
  :white_check_mark: → *Continue* :arrow_heading_down:
- You want to create something else than docs for your project  
  :x: → *Creating docs? Continue to the [VuePress docs](https://vuepress.vuejs.org), they are excellent for this.*  
  :white_check_mark: → *Continue* :arrow_heading_down:

## How this will work

To very briefly describe how this will end up working: 

- You'll have a git repo which contains your website content (markdown files) and your VuePress assets (theme, config, images etc.) in a separate folder called `.vuepress`.
- Every time you'll run `npm run build` the markdown files you have created will be converted into HTML files using the available VuePress layout files in your theme. Additionally defined routes will also be pre-rendered.
- A folder `/dist` will be produced filled with static assets that can be served by any ordinary web server such as NGINX or Apache.

## Setup

Ok, let's get started, first off we'll do al the usual stuff:

- Create the project folder `mkdir my-project && cd my-project`
- Create a valid `package.json` file with `npm init`
- Initialize Git with `git init`

If you don't want to copy all of that and to demonstrate the use of Vue components inside markdown you can fill in your project name here, copy the command below and that's that!

<CommandStringGenerator/>

Now let's get to the VuePress specific stuff:

First off, add the VuePress package itself with `npm i -D vuepress`

::: warning
In this guide we are using VuePress v1 so depending on when you are reading this you might have to install `vuepress@next` to get the proper version.
:::

You can also add VuePress globally with `npm install -g vuepress` to be able to use commands such as `vuepress dev` in the terminal but we'll add these commands as NPM scripts anyway so this is up to you.

Next up we'll add the following scripts to our `package.json` file:

``` js
"scripts": {
  "dev": "vuepress dev",
  "build": "vuepress build"
},
```

This enables us *and others* to interact with the project in a more general way without any setup or global package requirements with `npm run dev` and `npm run build`.

Ok time to create the project files, we'll start of by creating a `.vuepress` directory in our project folder root and throwing an `config.js` file in there. Our project structure should now look something like this:

```
my-project
|--.vuepress
|  |--config.js
|--node_modules
|--package.json
```

The `.vuepress` directory is going to be the backbone of this project containing all the files concerning your website besides the actual content itself, this will be placed in the root of the project folder. 

::: tip Wait what is in that weird folder?
Basically the `.vuepress` directory will contain anything Vue related:

- If you want to use a custom theme it will be in there in the `theme` folder
- If you want to use Vue components inside your markdown you'll place them there in the `components` folder
- If you want to add custom routes you can do so there using the `enhanceApp.js` file.
- If you want to tweak your markdown settings they will be available in there in the `config.js` file.

This creates a very clean separation of your Vue related files and everything outside it (your markdown content).
:::

For some more info about this folder and what it will contain [check this out](https://vuepress.vuejs.org/guide/directory-structure.html).

## The config.js file

As might have guessed this file will contain much of the configuration and options concerning your website including the config for your theme. A minimal config file will look like this:

``` js
module.exports = {
  title: 'My Site',
  description: 'Welcome to my site.'
}
```

But we'll start off by extending it a bit straight away by specifying the folder where the compiled assets should end up:

``` js
module.exports = {
  title: 'My Site',
  description: 'Welcome to my site.',
  dest: "dist"
}
```

Now your static assets will end up in the `/dist` folder in your root. By default these will end up inside the `.vuepress/dist` folder which is a bit messy and less generic.

## Creating our fist content

Since this project is originally geared towards documentation creation its only logical that the source for the `index.html` file will be the `README.md` file in the root of your project. Create the file and put some simple markdown in there like:

``` md
# Use a title

And some more content

- A list
- for example
```

Now it's time to reap the fruits of our labor, if you've done everything correctly you should now be able to execute `npm run dev` and check out your first webpage!

If everything looks good you can generate your new webpage using `npm run build`.

::: tip Where does my  markdown content end up?

The way VuePress routes your compiled markdown files is very straightforward, with the exemption of `[README.md](http://readme.md)` which gets turned into an `index.html` file the rest of the content can be found at their respective position inside the project. For example:

`/about.md` → `/about.html`

`/posts/vuepress-rocks.md` → `/posts/vuepress-rocks.md`

`/posts/README.md` → `/posts`

:::

## Using static assets

I can see why the VuePress team did this but I do hope there will be an option to change the current location as is the case with the output directory for the build. Currently your static assets should be placed inside `.vuepress/public` and they will be available at the root of your project.

<MailingListBox/>

## That's it!

Well done! You probably got your first VuePress site up and running, you probably want to create a custom theme though. No problem, [read more about that here](https://willwillems.com/posts/write-a-custom-theme-with-vuepress.html).
