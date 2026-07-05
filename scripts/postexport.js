const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
const prefix = '/9BallScorer';

let html = fs.readFileSync(indexPath, 'utf-8');

html = html.replace(/(href|src)="\//g, (m) => m.replace('"/', `"${prefix}/`));

fs.writeFileSync(indexPath, html);
