#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .arguments('<glob>')
  .description('Convert from SVG to PNG with Chrome Puppeteer')
  .option('--width [width]', 'Specify the output png width at 1x', 32)
  .option('--height [height]', 'Specify the output png height at 1x', 32)
  .parse(process.argv);
