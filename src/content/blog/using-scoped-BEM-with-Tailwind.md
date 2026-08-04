---
title: 'Tailwind for actual front-end developers'
pubDate: 2020-11-18
duration: '8 min'
category: 'Development'
heroImage: 'https://i.imgur.com/V8KMjHP.png'
---

Let's be honest. Exclusively using a framework with predefined CSS atoms will never be a proper solution for anyone designing a custom front-end. Thoroughly customising Tailwind already gets you pretty far but you'll never be able to reasonably bridge [the Bailwind gap](https://twitter.com/ryanflorence/status/1251589516617379840) with it. However. Using scoped CSS and BEM naming with Tailwind you can write some of the most maintainable and readable CSS while still decreasing development time and improving readability.

## Scoping

For the people not familiar with scoped CSS, scoping the CSS is usually done automatically without you having to worry about it. Many JS frameworks (Vue, Svelte, Angular) do this by default, scoping it to the component instance. This means that the CSS you write for one component can never conflict with the CSS written for another, or influence the global CSS.

Scoping solves a lot of issues. Without it you have to be sure you're being specific enough with your CSS naming. Often resulting in over-specific and long class names.

Scoping solves this problem completely. Since you're designing a independent self-contained unit you'll effortlessly and intuitively be able to do this without running into weird CSS conflicts.

To give an example, these two would not conflict using scoped CSS.

```css
/* AppModal */
.title {
	font-size: 2rem;
}

/* TheHeader */
.title {
	font-size: 4rem;
}
```

## BEM

`input__label--active` you might have seen CSS like this before. I find the explanation on [GetBEM](http://getbem.com) a bit vague so I'll try to do better here but BEM can be a bit tough to explain.

BEM stands for Block Element Modifier and is noted as: `block__element--modifier`. You can chain blocks when convenient but you should really limit this to 2 max, e.g. `block__element-or-block__element--modifier`. Modifiers are applied in parallel, avoiding this problem: `block__element--modifier-one block__element--modifier-two`.

As you can see `__` is used as the block-element divider and `--` as the element-modifier divider. As usual '-' is used to write names in `kebab-case`.

![BEM naming example](https://i.imgur.com/ph5CajQ.jpg)

On GetBEM they mark menu items as elements and the menu as a block, where one draws the line between block and element really is up to you but I would definitely define the menu items as a block resulting in the following CSS:

```scss
.menu {
	height: 3rem;

	&__icon {
		height: 2rem;
		width: 2rem;
	}
}

.menu-item {
	color: gray;
	font-weight: bold;

	&__status-indicator {
		border-radius: 50%;

		&--active {
			background-color: green;
		}
	}
}
```

You might not be familiar with the ampersand syntax used here. The `&` simply gets replaced by the nearest parent class name so here `&__icon` becomes `.menu__icon`. PostCSS has got a popular [plugin](https://github.com/postcss/postcss-nested) for this.

## Tailwind

The cherry on top. Although less popular, you can use Tailwind with the `@apply` directive to compose classes instead of writing CSS in HTML which, in my opinion, is a terrible idea, sorry Adam and Steve 😉.

So why use it? Consistent and customisable color use, easy proper sizing, typography defaults, etc. All definitely good reasons to use Tailwind but for me the number one benefit is speed of development & readability.

Using tailwind and extending our previous example a bit gives us this:

```scss
.menu {
	@apply w-full h-12 bg-gray-100 flex flex-row items-center;

	&__icon {
		@apply h-8 w-8 object-fit;
		background-image: url('/icon/caret.svg');
		background-position: center;
		background-size: 100%;
		background-repeat: no-repeat;
	}
}

.menu-item {
	@apply relative txt-sm txt-gray-800 font-bold;

	&__status-indicator {
		@apply absolute h-4 w-4 top-0 right-0 rounded-full bg-gray-800;

		&--active {
			@apply bg-green-800;
		}
	}
}
```

Remembering all CSS properties and their values without autocomplete took me years to do, Tailwind weeks.

One additional benefit is being able to add custom CSS when you feel like it. I for example like to write out CSS background rules because that's more clear to me and they often need quite specific values.

Additionally if you need to use some CSS to do a unusual thing, tailwind won't help you so you'll need to write it manually. The beauty of this workflow is that hyper-specific or unusual CSS will stand out by default!

```scss
.menu-item {
  @apply relative txt-sm txt-gray-800 font-bold;
  margin-bottom: -3px;
```
