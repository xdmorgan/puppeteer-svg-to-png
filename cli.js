#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');

// cli
program
  .version(pkg.version)
  .description('Convert from SVG to PNG with Chrome Puppeteer')
  .option(
    '--pattern [glob]',
    'Glob pattern to match files against',
    'src/**/*.svg'
  )
  .option('--width [width]', 'Specify the output png width at 1x', 32)
  .option('--height [height]', 'Specify the output png height at 1x', 32)
  .parse(process.argv);

// output help if nothing is set
if (!process.argv.slice(2).length) program.help();
