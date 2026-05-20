const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) {
    console.log(`Source folder does not exist: ${from}`);
    return;
  }
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// Copy .next/static to .next/standalone/.next/static
const nextStaticSrc = path.join(__dirname, '../.next/static');
const nextStaticDest = path.join(__dirname, '../.next/standalone/.next/static');
console.log(`Copying .next/static from ${nextStaticSrc} to ${nextStaticDest}...`);
copyFolderSync(nextStaticSrc, nextStaticDest);

// Copy public to .next/standalone/public
const publicSrc = path.join(__dirname, '../public');
const publicDest = path.join(__dirname, '../.next/standalone/public');
console.log(`Copying public folder from ${publicSrc} to ${publicDest}...`);
copyFolderSync(publicSrc, publicDest);

console.log('Assets copied successfully.');
