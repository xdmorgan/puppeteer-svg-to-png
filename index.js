const puppeteer = require('puppeteer');
const glob = require('glob');
const fs = require('fs-extra');

const MULTIPLIERS = [1, 2, 3];

/* Main
============================================================================ */

/**
 * Convert from SVG to 1-3x PNG
 */
async function build(pattern, { width, height, output }) {
  // create browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // get list of files
  const files = await find(pattern);
  // make sure the dirs are ready for saving
  await fs.emptyDir(output);
  // process queue
  const queue = [...files];
  while (queue.length) {
    const file = queue.shift();
    const dest = `${output}/${file.replace('.svg', '.png')}`;
    await fs.ensureDir([...dest.split('/')].slice(0, -1).join('/'));
    await render(page, { file, dest, width, height, multipliers: MULTIPLIERS });
  }
  // we're done here
  await browser.close();
  // feedback, innit
  return files.length;
}

async function render(page, { file, dest, width, height, multipliers = [1] }) {
  const queue = multipliers.map(num => ({
    width: width * num,
    height: height * num,
    dest: filenameSuffix(dest, num),
  }));
  const content = (await fs.readFile(file)).toString();
  await page.setContent(html(content));
  await snapshot(page, queue.shift(), queue);
}

async function snapshot(page, { width, height, dest }, queue = []) {
  await page.setViewport({ width, height });
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

module.exports = (pattern, opts) =>
  build(pattern, opts).then(num =>
    console.log(
      `Rendering complete! Processed ${num} file${num !== 1 ? 's' : ''}`
    )
  );
