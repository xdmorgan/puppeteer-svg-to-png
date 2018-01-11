const puppeteer = require('puppeteer');

const ICON_SIZE = 128;
const PATHS = {
  in: './__test__/input/',
  out: './__test__/output/',
};

async function build() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(
    html(`
  <svg width="128" height="128" style="enable-background:new 0 0 128 128;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- https://upload.wikimedia.org/wikipedia/commons/d/d3/Emoji_u1f60e.svg -->
    <path d="M63.79,8.64C1.48,8.64,0,78.5,0,92.33c0,13.83,28.56,25.03,63.79,25.03 c35.24,0,63.79-11.21,63.79-25.03C127.58,78.5,126.11,8.64,63.79,8.64z" style="fill:#FCC21B;"/>
    <path d="M63.91,104.82c-3.43,0-6.87-0.43-10.25-1.31c-1.6-0.42-2.56-2.06-2.15-3.66 c0.42-1.6,2.06-2.56,3.66-2.14c11.65,3.04,24.21-0.21,32.78-8.48c1.19-1.15,3.09-1.12,4.24,0.08c1.15,1.19,1.12,3.09-0.08,4.24 C84.54,100.85,74.32,104.82,63.91,104.82z" style="fill:#2F2F2F;"/>
    <path d="M55.53,67.26c-0.01,0.01-0.02,0.02-0.02,0.02C55.51,67.27,55.52,67.26,55.53,67.26z" style="fill:#2F2F2F;"/>
    <g>
      <path d="M98.21,41.34c-13.36,0-15.15,2.03-21.4,3.36C70.56,46.02,64,46.02,64,46.02s-6.56,0-12.81-1.33 c-6.25-1.33-8.05-3.36-21.4-3.36c-13.36,0-29.37,2.89-29.37,2.89v8.51c0,0,3.59,0.47,3.91,3.75c0.16,1.33-3.12,28.35,23.51,28.35 c18.9,0,26.87-11.33,29.45-20.54c1.17-4.37,2.19-9.37,6.72-9.37c4.53,0,5.55,5,6.72,9.37c2.58,9.22,10.54,20.54,29.45,20.54 c26.63,0,23.35-27.03,23.51-28.35c0.31-3.28,3.91-3.75,3.91-3.75v-8.51C127.58,44.23,111.57,41.34,98.21,41.34z" style="fill:#2F2F2F;"/>
      <path d="M95.94,45.05c-6.62,0.23-11.65,1.31-11.65,1.31c-9.84,2.06-10.55,8.14-9.93,12.97 c0.8,6.07,3.29,13.75,10.04,18.49c0.53,0.38,1.76,0.79,2.35-0.77c0,0-0.02,0.11,0,0c2.22-10.48,5.52-20.14,10.78-29.89l0,0 C98.14,45.37,96.71,45.02,95.94,45.05z" style="fill:#FFFFFF;"/>
      <path d="M31.06,45.02c-4.27-0.09-9.11,0.19-13.65,1.34c-5.1,1.28-7.07,3.85-7.6,9.39 c-0.53,5.43-1.13,19.27,8.73,24.46c0.57,0.3,1.83,0.5,2.44-0.91l0,0C24,66.21,25.61,60.13,32.54,47.22l0,0 C33.11,45.49,31.83,45.03,31.06,45.02z" style="fill:#FFFFFF;"/>
    </g>
  </svg>
  `)
  );
  await page.setViewport({ width: ICON_SIZE, height: ICON_SIZE });
  await page.screenshot({
    path: `${PATHS.out}/text.png`,
    omitBackground: true,
  });
  await browser.close();
}

const html = content => `
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

build().then(() => console.log('complete!'));
