rpg-cards
=========

RPG spell/item/monster card generator

Preview
=======

Click [here](https://rpg-cards.vercel.app) for a live preview of this generator.

Documentation
=============

Click [here](http://crobi.github.io/rpg-cards/) to read the documentation.

Support
=======

I (the original author) am not maintaining the project anymore, and will not be responding to issues or reviewing PRs.
However, I have given write access to a few collaborators that are maintaining the project.
Please reach out to me if you want to be included as collaborator, or if you want to take ownership of this project.


FAQ
=====================

- What browsers are supported?
  - A modern browser (Chrome, Firefox, Edge, Safari). The generator has some issues on IE.
- Cards are generated without icons and background colors, what's wrong?
  - Enable printing backround images in your browser print dialog
- I can't find an icon that I've seen on [game-icons.net](http://game-icons.net), where is it?
  - See the section "updating icons" below.
- The layout of the cards is broken (e.g., cards are placed outside the page), what's wrong?
  - Check your page size, card size, and cards/page settings. If you ask the generator to place 4x4 poker-sized cards on a A4 paper, they won't fit and they will overflow the page.

Installation
========

## Building

This project consists almost exclusively of static HTML/CSS/JavaScript files, plus the vue frameowrk
The only exception are icons, which are copied from the [game-icons](http://game-icons.net) project.

To build this project:

1. Check out this repository
1. Make sure you have [Node](https://nodejs.org/) installed
1. Run `npm install` to load the modules for rpg-cards
1. Run `npm run build` to build the modules

## Running
1. Run `npm install http-server -g` to install a global package that can create a local server
1. Run `http-server -o /generator/index.html` to launch the website
   - or run `http-server -p 47897` to start the server without opening the browser


License
=======

This generator is provided under the terms of the MIT License.

Icons are made by various artists, available at [http://game-icons.net](http://game-icons.net).
They are provided under the terms of the Creative Commons 3.0 BY license.
