const puppeteer = require('puppeteer');
const glob = require('glob');
const fs = require('fs-extra');

/* Constants
============================================================================ */

const SEARCH_PATTERN = './__test__/input/**/*.svg';
const SIZE = 128;
const MULTIPLIERS = [1, 2, 3];
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
  const files = await find(SEARCH_PATTERN);
  // make sure the dirs are ready for saving
  await fs.emptyDir(PATHS.out);
  // process queue
  const queue = [...files];
  while (queue.length) {
    const file = queue.shift();
    const dest = file.replace(PATHS.in, PATHS.out).replace('.svg', '.png');
    await render(page, file, dest, SIZE, MULTIPLIERS);
  }
  // we're done here
  await browser.close();
  // feedback, innit
  return files.length;
}

async function render(page, file, dest, size, multipliers = [1]) {
  const queue = multipliers.map(num => ({
    size: size * num,
    dest: filenameSuffix(dest, num),
  }));
  const content = (await fs.readFile(file)).toString();
  await page.setContent(html(content));
  await snapshot(page, queue.shift(), queue);
}

async function snapshot(page, { size, dest }, queue = []) {
  await page.setViewport({ width: size, height: size });
  await page.screenshot({ path: dest, omitBackground: true });
  if (queue.length) await snapshot(page, queue.shift(), queue);
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

const filenameSuffix = (file, num, extname = '.png') =>
  file.replace(extname, num > 1 ? `@${num}x${extname}` : extname);

/* Run
============================================================================ */

build().then(num =>
  console.log(
    `Rendering complete! Processed ${num} file${num !== 1 ? 's' : ''}`
  )
);
