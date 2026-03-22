---
title: "Collapsing borders in CSS with box-shadow"
pubDate: 2020-12-20
duration: "4 min"
category: "Development"
heroImage: "https://i.imgur.com/2Ng6N2a.png"
---
Thank god nobody uses tables for layout anymore but we can't collapse borders using regular CSS elements, unless...

## Box-shadow as a border

If it looks like a border and works like a border then it might be a box-shadow. We're using CSS, stay sharp.

[Box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) uses the following syntax:

```css
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 0px 0px 0px 2px black;
```

So in the example we're using here(`0 0 0 2px black`) you're getting a border with:

- Offset (x, y): `0 0`, meaning it sits right behind the element without any vertical or horizontal offset.
- Blur (r): `0`. Meaning the box-shadow is a perfect un-blurred silhouette of the DOM element.
- Spread (z): `2px`, scaling up the shadow so it is expanded 2px from the element border to the shadow border.
- Color (n): `black`, the color of the box-shadow, pretty straight forward.

As you can probably guess, visually speaking, this gives us the exact same effect as a plain `border: solid 2px black` border.

## How box-shadow differs from border

The thing that makes this so useful is that box-shadow doesn't have any effect on the layout of the element it's applied on, it just draws a border around it, not caring about its own visibility or position.

## How to use it with grid or margin

I'd say there are two ways to use this trick properly. Either with grid or/and with margin. I strongly recommend to primarily stick with grid and only use margin if grid makes no sense. Mainly since margin itself [has weird collapse rules](https://www.joshwcomeau.com/css/rules-of-margin-collapse/).

Using grid it's super simple, just apply grid rules to the parent, and a box-shadow to it's children.

```css
.parent {
  display: grid;
  grid-gap: 3px;
  grid-template-rows: 2rem 2rem auto;
}

.children {
	box-shadow:0 0 0 3px black;
}
```

I'd use margin primarily for the box-in-a-box look with collapsing borders which you can see in the header image of this post:

```css
.box {
	box-shadow:0 0 0 3px black;
}

.box-in-a-box {
	margin: 6px 6px 0 0;
	box-shadow:0 0 0 3px black;
}
```

For some more examples you can check out [this codepen](https://codepen.io/nickolasboyer/pen/wvzrMew)!