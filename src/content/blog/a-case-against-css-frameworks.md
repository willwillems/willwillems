---
title: 'A case against CSS frameworks'
pubDate: 2018-12-13
duration: '5 min'
category: 'Vue.js'
heroImage: '/img/css-frameworks-thumb.png'
---

I don’t like CSS frameworks. I always design my web apps in Sketch before actually building them, I might think I have a solid idea of how a certain login page is supposed to look but when I head in code first the end result always ends up as a watered down version of the design that I had envisioned. This is since it is partly shaped by me and partly by the default CSS values and restrictions of what is easy to do with HTML and CSS and what is not. That problem is made 10x worse by current CSS frameworks.

Bulma, Bootstrap, Foundation, Pure… I’ve had to build websites with all of them and then some. Some were worse then others but they all have something in common: they bring design philosophies and code into your project that you realistically have no idea about.

I’m not talking about things like color schemes or font families here, I’m talking about the little things, the margin on your sign-up button, the thickness of the border on your transparent button, the opacity of your inactive elements, things that are already defined for you and do not on their own seem significant enough to modify.

Often when a website is designed with a certain framework front end devs with experience with that framework instantly feel that it is being used. I’m writing feel because it might not be instantly visually detectable that Bootstrap is hiding underneath those hip oversized input elements but for someone who has worked with Bootstrap it could not be more obvious.

This on its own is not very pleasant but the real fucking fun begins when people start integrating these CSS frameworks into JS frameworks! Often riddled with bugs due to immaturity and quirky required practices these hyper opinionated frameworks make it exhausting to stir in significant creative input that is truly your own.

I might be completely wrong here, I might just have completely misunderstood everything and if someone can convince me I will be very happy to have another good look, especially since my clients seem to love these frameworks (be it with some good reasons). But I would absolutely not recommend a starting front end developer to start using these things, don’t care for design and are 10 years deep into the industry? Then go ahead if you want but if you are just learning CSS and HTML stay away as far as possible! You can make your own `.float-right` class of you need to.

**Building stuff? I love making things too, if you want to check out what I’m doing follow me on [twitter](https://twitter.com/will_rut)!**
