// debug-syntax.js - Find the exact syntax error
const fs = require('fs');
const content = fs.readFileSync('./build/ExpoLeafletModule.js', 'utf8');

console.log('🔍 Searching for the "typeof" syntax error...');

const lines = content.split('\n');
let found = false;

// Look for lines with 'typeof' that might be problematic
lines.forEach((line, index) => {
  if (line.includes('typeof') && !line.trim().startsWith('//')) {
    console.log(`\n=== Line ${index + 1}: ===`);
    console.log(line.trim());
    
    // Show context (previous and next lines)
    const start = Math.max(0, index - 2);
    const end = Math.min(lines.length - 1, index + 2);
    console.log('Context:');
    for (let i = start; i <= end; i++) {
      console.log(`${i + 1}: ${lines[i].trim()}`);
    }
    found = true;
  }
});

if (!found) {
  console.log('No "typeof" found in the file. Let me check for other issues...');
  
  // Look for other potential syntax issues
  const problematicPatterns = [
    '??', '?.', '||=', '&&=', '??=', 'import.meta', 'export default', 'class {'
  ];
  
  problematicPatterns.forEach(pattern => {
    const matches = content.match(new RegExp(pattern, 'g'));
    if (matches) {
      console.log(`Found '${pattern}' ${matches.length} times`);
    }
  });
}
