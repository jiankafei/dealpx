'use strict';
const fs = require('fs');
const postcss = require('postcss');
const coverter = require('./index');
const css = fs.readFileSync('./index.css', 'utf8');

const processCSS = postcss(coverter()).process(css).css;

fs.writeFile('../assets/trans.css', processCSS, err => {
	if (err) throw new Error(err);
	console.log('Translate unit success.');
});
