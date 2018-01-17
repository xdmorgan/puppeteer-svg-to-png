#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const pkg = require('./package.json');
const app = require('./');

// cli
program
  .version(pkg.version)
  .description('Convert from SVG to PNG with Chrome Puppeteer')
  .arguments('<files>')
  .option('--width <width>', 'Specify the output png width at 1x', 32)
  .option('--height <height>', 'Specify the output png height at 1x', 32)
  .option(
    '--output <output>',
    'Specify the output directory for generated files',
    './pup4svg2png'
  )
  .action(app);

function exitWithHelp(msg) {
  program.outputHelp();
  console.error('\n\n', chalk.red(msg), '\n\n');
  process.exit(1);
}

// output help if nothing is set
program.parse(process.argv);
if (!process.argv.slice(2).length)
  exitWithHelp('Please specify a glob pattern to search for');
