
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
import { loadDefaultJapaneseParser } from 'budoux';
const parser = loadDefaultJapaneseParser();

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = 'white';

    if (theme === 'dark') {
        background = 'black';
    }
    return `
    @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        margin: 0;
    }

    code {
        color: #D400FF;
        font-family: 'Vera', 'M PLUS 1p';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .wrapper {
        width: 1200px;
        height: 630px;
        display: flex;
        box-sizing: border-box;
        background-color:white;
    }

    .spacer {
        margin: 0 64px 16px 64px;
        border-radius: 16px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        border: 4px dashed #4172B5;
        margin-top: 18px;
        padding: 24px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: 600;
        color: #1E2126;
        line-height: 1.5;
        margin: 0;
        text-align: left;

    }

    .footer {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: 24px;
        text-align: left;
        width: 100%;
        line-height: 0.5;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .footer-icon {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: 24px;
        text-align: left;
        width: 100%;
        line-height: 0.5;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize } = parsedReq;

    const translatedText = parser.translateHTMLString(
      emojify(md ? marked(text) : sanitizeHtml(text))
    )

    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="wrapper">
            <div class="spacer">
                <div>
                </div>
                <div class="heading">
                ${translatedText}
                </div>
                <div class="footer">
                    <p>cat2koban.dev</p>
                    <img src="https://img.esa.io/uploads/production/attachments/19513/2022/09/26/129728/b3c3cf55-f9de-4119-ac8a-811ffc235da6.png" width="64px" height="64px" style="border-radius: 100%;">
                </div>
            </div>
    </body>
</html>`;
}
