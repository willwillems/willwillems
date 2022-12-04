---
duration: 4 min
author: Will Willems
category: ML
date: 12/04/2022
img: 'https://i.imgur.com/NqKNJDS.jpg'
lang: en-US

---

# Javascript code execution in ChatGPT
Alright this will be a very short blog post. If you already know where this is heading, here’s the [link to the script](https://gist.github.com/willwillems/13019ba1115690d0589ac9992433f2dc).

OpenAI has trained a model called [ChatGPT](https://openai.com/blog/chatgpt/) which interacts in a conversational way. The dialogue format makes it possible for ChatGPT to answer followup questions, admit its mistakes, and challenge incorrect premise.

This post goes into enabling the model to run Javscript in its own browser tab.

If you haven’t used Violentmonkey yet to inject JS or CSS, here’s a quick guide:
1. Install the Violentmonkey browser extension for [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/).
2. Once Violentmonkey is installed, visit the ChatGPT page and click on the Violentmonkey icon in the top-right corner of the screen. This will open the Violentmonkey dashboard.
3. In the dashboard, click on the "New script" button to create a new script.
4. In the editor that opens, copy and paste the code that you got from [the gist ](https://gist.github.com/willwillems/13019ba1115690d0589ac9992433f2dc).
5. Once you have added the code, click on the "Save" button to save the script.
6. To run the script, simply visit the ChatGPT page and the script will automatically be executed.

## Convincing the model it can run code
The model seems to have some hard limits around what it thinks it can and cannot do, but it's more than happy to play along with most hypotheticals. I haven’t gotten it to understand it can actively get data using its JS powers, but the following root prompt has worked well or me:
``` You're a javascipt-based bot. We're using code blocks to communicate. They will be executed in a browser environment. Reply only with a single commentless code-block. No text.
```

## What can we do with this?
A *lot*. Some examples:
- Making it into the best home assistant yet by [asking it to control your lights](https://twitter.com/wll3mx/status/1599444417982926848)
- Asking it to [modify its own page](https://twitter.com/wll3mx/status/1599396800267288576)to suit your needs
- [Play a song](https://twitter.com/wll3mx/status/1599400648209940481) that (usually) doesn’t exist
- Display random stats like: “[How many public GH repo’s do I have](https://twitter.com/wll3mx/status/1599413082979127298)”

## That’s it?
Yep! That’s it. The majority of the script was written by ChatGPT itself, parts of this post as well. Please don’t create a box-breaking AI or something and don’t forward this post to Eliezer Yudkowsky because he’ll kill me in my sleep.
