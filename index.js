const fs = require('fs');
const path = require('path');
const Axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

async function downloadImage(url, filepath) {
  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  // const url = new URL(options.url);
  const basename = path.basename(url);
  const decodedBasename = decodeURIComponent(basename);

  return new Promise((resolve, reject) => {
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

// downloadImage(
//   'https://upload.wikimedia.org/wikipedia/commons/7/7b/Bad_Rappenau_-_Heinsheim_-_Burg_Ehrenberg_-_Ansicht_von_Norden_%281%29.jpg',
//   'daily'
// );

// get Picture of the day url(Wikimedia Commons https://commons.wikimedia.org/wiki/Main_Page)
async function getPictureUrls() {
  let feed = await parser.parseURL(
    'https://commons.wikimedia.org/w/api.php?action=featuredfeed&feed=potd&feedformat=rss&language=en'
  );
  // console.log(feed.title);
  const contents = [];
  feed.items.forEach((item) => {
    contents.push(item.content);
  });
  const html = contents.join(' ');
  const before_html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Daily Image | tianheg</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n`;
  const after_html = '</body>\n</html>';
  fs.writeFile('index.html', before_html + html + after_html, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

getPictureUrls();
