const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'redesign_3.html');
if (!fs.existsSync(inputPath)) {
  console.error("File not found: " + inputPath);
  process.exit(1);
}

const content = fs.readFileSync(inputPath, 'utf8');

// The file contains three HTML pages separated by comments:
// <!-- Home (Redesigned Branding) -->
// <!-- AI Assistant (Redesigned Branding) -->
// <!-- Medicines (Redesigned Branding) -->

const sections = content.split(/<!--\s*(Home|AI Assistant|Medicines)\s*\(Redesigned Branding\)\s*-->/i);

console.log(`Found ${sections.length} parts`);

let currentName = 'unknown';
for (let i = 0; i < sections.length; i++) {
  const part = sections[i].trim();
  if (!part) continue;
  
  if (part.toLowerCase() === 'home' || part.toLowerCase() === 'ai assistant' || part.toLowerCase() === 'medicines') {
    currentName = part.toLowerCase().replace(' ', '_');
  } else {
    const filename = `redesign_code_${currentName}.html`;
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, part, 'utf8');
    console.log(`Wrote section to ${outputPath} (${part.length} chars)`);
  }
}
