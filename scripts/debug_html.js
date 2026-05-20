const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'redesign_3.html'), 'utf8');
const regex = /<!--[\s\S]*?-->/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Match: "${match[0]}" at index ${match.index}`);
}
console.log(`Total content length: ${content.length}`);
