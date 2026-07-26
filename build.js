const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, 'index.html');
const destinationDir = path.resolve(__dirname, 'public');
const destination = path.join(destinationDir, 'index.html');

fs.mkdirSync(destinationDir, { recursive: true });
fs.copyFileSync(source, destination);
console.log('Build complete: public/index.html created.');
