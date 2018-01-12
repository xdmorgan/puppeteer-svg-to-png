const puppeteer = require('puppeteer');
const glob = require('glob');
const fs = require('fs-extra');
const imagemin = require('imagemin');

/* Constants
============================================================================ */

const SEARCH_PATTERN = './__test__/input/**/*.svg';
const SIZE = 128;
const PATHS = {
  in: './__test__/input/',
  out: './__test__/output/',
};

/* Main
============================================================================ */

/**
 * Convert from SVG to 1-3x PNG
 */
async function build() {
  // create browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // get list of files
  const queue = await find(SEARCH_PATTERN);
  // make sure the dirs are ready for saving
  await fs.emptyDir(PATHS.out);
  // process queue
  const files = [];
  while (queue.length) {
    const file = queue.shift();
    const dest = file.replace(PATHS.in, PATHS.out).replace('.svg', '.png');
    await render(page, file, dest, SIZE);
    files.push(dest);
  }
  // minify the generated images
  await imagemin(files, PATHS.out);
  // we're done here
  await browser.close();
  // feedback, innit
  return files.length;
}

async function render(page, file, dest, size) {
  const content = (await fs.readFile(file)).toString();
  await page.setContent(html(content));
  await page.setViewport({ width: size, height: size });
  await page.screenshot({
    path: dest,
    omitBackground: true,
  });
}

/* Utils
============================================================================ */

const html = (content = '') => `
<html>
  <head>${cssReset()}</head>
  <body>${content}</body>
</html>
`;

const cssReset = () => `
<style>
  body, html{ margin:0; }
</style>
`;

const find = (pattern = '') =>
  new Promise((resolve, reject) => {
    glob(pattern, (err, files) => (err ? reject(err) : resolve(files)));
  });

/* Run
============================================================================ */

build().then(num =>
  console.log(
    `Rendering complete! Processed ${num} file${num !== 1 ? 's' : ''}`
  )
);
