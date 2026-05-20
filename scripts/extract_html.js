const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\prabh\\.gemini\\antigravity\\brain\\6bbf6e0c-c09c-430c-97eb-e430d0bee913\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found at " + logPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

let count = 0;
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes('Redesigned Branding')) {
      const outputName = `redesign_${++count}.html`;
      const outputPath = path.join(__dirname, '..', 'scripts', outputName);
      fs.writeFileSync(outputPath, obj.content, 'utf8');
      console.log(`Extracted text to ${outputPath}`);
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
}
