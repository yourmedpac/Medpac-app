const sharp = require('sharp');
const fs = require('fs');

const svgPath = 'public/logo.svg';
const pngPath = 'medpac_mobile/assets/logo.png';

async function convert() {
  if (!fs.existsSync('medpac_mobile/assets')) {
    fs.mkdirSync('medpac_mobile/assets', { recursive: true });
  }

  await sharp(svgPath)
    .resize(512, 512)
    .png()
    .toFile(pngPath);
  
  console.log('Converted logo.svg to logo.png');
}

convert().catch(console.error);
