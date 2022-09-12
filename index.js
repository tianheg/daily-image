import fs from 'fs';
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
