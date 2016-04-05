# Gulp Browsersync POC

A Bootstrap and Font-Awesome HTML starter kit with gulp and browserify.
Live reload and thanks to Browsersync.
All source in the `assets` folder, and compiled to the `dist` folder.

What does Gulp do for you ?

 * install/copy font-awesome less/fonts
 * install/require Bootstrap less/js
 * compile and minimize less files located in the `./assets/less` folder
 * minimize/optimize images and svg files located in the `./assets/img`
 * require your node js libs and compile to a single minified `app.js` file

## Requirements

* Nodejs, npm, gulp

## Install

    $ npm install

## compile assests

    $ gulp build

Your less and js files will be compiled to the `dist` folder.

## compile assests during development

    $ gulp


## javascript packages with npm

Use npm to install a new package, for example if you need jquery-ui:

    $ npm install [jquery-ui] -save

This will download the node package and save it in your  `package.json` file as a project dependency.
Then require your lib in the `assets/js/app.js` file like this :

    $ require('jquery-ui');

Then you're ready to go.
