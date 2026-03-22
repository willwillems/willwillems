---
title: "Learn to manage large Vue.js components in 4 min"
pubDate: 2018-11-20
duration: "4 min"
category: "Vue.js"
heroImage: "/img/vue-components-thumb.png"
---
Vue.js is, in my opinion, the nicest JS framework currently available. One of the features I like the most are the `.vue` single-file components. It can get quite hard to manage larger ones tough, especially when you start creating custom sub-components and adding static assets. Here are some things I’ve tried, you might like them too.

_Figure 1: You when handling large components before reading this post._

## Some quick basics

This might be common knowledge to you but just in case:

* Use PascalCase file naming.  
  _Example:_ `ComponentName.vue`  
  [doc reference](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended)
* Preface base components with a default word like App, Base or V.  
  _Example:_ `AppTable.vue`  
  [doc reference](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended)
* Preface components with a max of one active instance with The.  
  _Example:_ `TheLargeComponent.vue`  
  [doc reference](https://vuejs.org/v2/style-guide/#Single-instance-component-names-strongly-recommended)
* Always use multi-word names for your components. Prefacing `App` or `The` simplifies this but do this for all components. This is to avoid clashes with standard HTML tags which are always a single word.  
  _Example:_ `MainModal.vue` _instead of_ `Modal.vue`  
  [doc reference](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential)

## How it is often done.

I’ve seen this all too often, and with large projects this becomes a nightmare. All components are in the `components` folder, all assets are in a central assets folder and single-instance child components are only indicated by prefacing the name of it’s parent (this gets super fun after 2 layers). Often this looks a little like this:

```
components
|--LargeComponent.vue
|--LargeComponentModal.vue
|--LargeComponentModalTextSection.vue
|--LargeComponentModalTextSectionTitle.vue
|--LargeComponentModalButton.vue
|--LargeComponentModalButtonText.vue
assets
|--img
|  |--large-component-banner.png
|  |--large-component-button-bg.png
```

OK, so this obviously gets cluttered fast, how do we fix this? Let’s get to the first option!

## 1. Putting the component in it’s own folder.

One of the first options I tried. Name the folder `LargeComponent` and put the original component in it. You can do two things here.

First you can name the component `index.vue`/`component.vue` which probably works in your build system and has the great benefit of not changing your import statements. This is really really handy but a very hacky and not the most stable solution. **Note: this does not work if you are specifying the file extension in your imports like** `**LargeComponent.vue**`

```
components
|--LargeComponent
|  |--index.vue
|  |--components
|  |  |--LargeComponentModal.vue
|  |--assets
|  |  |--img
|  |  |  |--banner.png
```

Secondly you could just name it after it’s parent folder and thus keep it `LargeComponent.vue` which is probably the wisest choice here. This does change the import from `./components/LargeComponent` to `./components/LargeComponent/LargeComponent` which isn’t ideal.

Pro’s

* All items in the components folder indicate and represent a component.
* Easy to understand for other dev’s.
* Sub-components and assets can be imported with clean relative imports: ./assets/img/banner.png

Secondly an approach which looks very much like this one and probably the most straightforward one:

## 2. Putting the folder alongside the vue component.

This solution has no problem with specifying the file extension and does not change the imports.

```
components
|--LargeComponent.vue
|--LargeComponent
|  |--components
|  |  |--LargeComponentModal.vue
|  |--assets
|  |  |--img
|  |  |  |--banner.png
```

The imports in the file itself do look a bit more complex but are also very clear: `./LargeComponent/assets/img/banner.png`. It also makes the main components folder look a bit more cluttered but not necessarily more unclear.

Pro’s

* Works in every build system, very straightforward.
* Easy to understand for other dev’s.
* Does not change imports when creating folder for component.

Finally there is a bit more uncommon one I really like if you are using imports without file extension specified:

## 3. Putting an index.js/package.json in your component folder

Pretty straightforward, you just throw this `index.js`/`package.json ` file in your component folder:
``` json
{
    "name": "MY_COMPONENT_NAME",
    "private": true,
    "main": "./MY_COMPONENT_NAME.vue"
}
```

This takes care of resolving the import correctly. You can keep a tidy structure in your components folder with every element representing a component. You’ll end up with this folder structure:

```
components
|--LargeComponent
|  |--package.json
|  |--LargeComponent.vue
|  |--components
|  |  |--LargeComponentModal.vue
|  |--assets
|  |  |--img
|  |  |  |--banner.png
```

This has all the advantages of the methods above but it is a bit more obscure and looses one of it’s biggest advantages when using imports with file extension specified.

Pro’s

* Does not change imports when creating folder for component.
* All component data contained in one folder.
* Relative imports are cleaner.

## Bonus round: Tip for Vue-Router users

When building an SPA I really like to put the single-instance components in a folder corresponding to the page they belong to, like this:

```
views
|--SubscribeView.vue
|--SubscribeView
|  |--components
|  |  |--TheHeader.vue
|  |--assets
|  |  |--header-image.png
components
|--AppButton.vue
|--AppButton
|  |--components
|  |  |--AppButtonText.vue
|  |--assets
|  |  |--img
|  |  |  |--button-background.png
```

That’s it!

Thanks for reading, really hope this helped, if you’ve got suggestions and improvements please do leave them in the comments!

**Building stuff? I love making things too, if you want to check out what I’m doing follow me on** [**twitter**](https://twitter.com/will_rut)**!**