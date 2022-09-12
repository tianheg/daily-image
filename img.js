import Axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

/**
 * Download image from mysite https://gh.tianheg.xyz/daily-image/
 */

const url = 'https://gh.tianheg.xyz/daily-image/';
const response = await fetch(url);
const body = await response.text();
let $ = load(body);
let img = $('img');

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
