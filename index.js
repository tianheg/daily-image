import Axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import Parser from 'rss-parser';

/**
 * get Picture of the day url(Wikimedia Commons https://commons.wikimedia.org/wiki/Main_Page)
 */

const parser = new Parser();

async function getPictureUrls() {
  let feed = await parser.parseURL(
    'https://commons.wikimedia.org/w/api.php?action=featuredfeed&feed=potd&feedformat=rss&language=en'
  );
  const html = feed.items[feed.items.length - 1].content; // Today's image
  const before_html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Daily Image | tianheg</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n`;
  const after_html = '</body>\n</html>';
  fs.writeFile('index.html', before_html + html + after_html, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

getPictureUrls();

/**
 * Download image from mysite https://gh.tianheg.xyz/daily-image/
 */

const url = 'https://gh.tianheg.xyz/daily-image/';
const response = await fetch(url);
const body = await response.text();
let $ = load(body);
let img = $('img');
console.log(img.attr().src);

const __dirname = path.resolve(path.dirname(''));
async function downloadImage(url, filepath) {
  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  const basename = path.basename(url);
  const decodedBasename = decodeURIComponent(basename);

  return new Promise((resolve, reject) => {
    // create directory if not exists https://stackoverflow.com/a/26815894/12539782
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath)
    }
    response.data
      .pipe(
        fs.createWriteStream(path.resolve(__dirname, filepath, decodedBasename))
      )
      .on('error', reject)
      .once('close', () =>
        resolve(path.resolve(__dirname, filepath, decodedBasename))
      );
  });
}
downloadImage(img.attr().src, 'img');
