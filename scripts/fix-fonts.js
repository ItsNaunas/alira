/**
 * Font Consistency Fixer
 * 
 * This script automatically replaces all inconsistent font usage across the entire project
 * with the standardized font system.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Font replacement rules
const REPLACEMENTS = [
  // Main headings - any standalone font-bold or font-heading should become font-serif font-bold
  {
    pattern: /className="([^"]*?)font-bold([^"]*?)"/g,
    replacement: (match, before, after) => {
      // If it already has font-serif, keep it
      if (before.includes('font-serif') || after.includes('font-serif')) {
        return match;
      }
      // If it's a heading-like element (text-xl or larger), add font-serif
      if (before.includes('text-xl') || before.includes('text-2xl') || before.includes('text-3xl') || 
          before.includes('text-4xl') || before.includes('text-5xl') || before.includes('text-6xl') ||
          before.includes('text-7xl')) {
        return `className="${before}font-serif font-bold${after}"`;
      }
      return match;
    }
  },
  
  // Replace font-heading with font-serif font-bold
  {
    pattern: /font-heading/g,
    replacement: 'font-serif font-bold'
  },
  
  // Subsection headings - font-semibold on medium+ text should be font-serif font-semibold
  {
    pattern: /className="([^"]*?)font-semibold([^"]*?)"/g,
    replacement: (match, before, after) => {
      // If it already has font-serif, keep it
      if (before.includes('font-serif') || after.includes('font-serif')) {
        return match;
      }
      // If it's in a label or small badge context, keep as sans
      if (before.includes('text-xs') || before.includes('text-sm') || 
          before.includes('uppercase') || before.includes('tracking-')) {
        return `className="${before}font-sans font-semibold${after}"`;
      }
      // Otherwise make it serif
      return `className="${before}font-serif font-semibold${after}"`;
    }
  },
  
  // Medium weight text
  {
    pattern: /className="([^"]*?)font-medium([^"]*?)"/g,
    replacement: (match, before, after) => {
      // If it already has font-serif or font-sans, keep it
      if (before.includes('font-serif') || after.includes('font-serif') ||
          before.includes('font-sans') || after.includes('font-sans')) {
        return match;
      }
      // Default to sans medium
      return `className="${before}font-sans font-medium${after}"`;
    }
  },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  REPLACEMENTS.forEach(({ pattern, replacement }) => {
    const newContent = typeof replacement === 'function'
      ? content.replace(pattern, replacement)
      : content.replace(pattern, replacement);
    
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔧 Fixing font consistency across the project...\n');
  
  const files = [
    ...glob.sync('app/**/*.tsx', { cwd: process.cwd() }),
    ...glob.sync('components/**/*.tsx', { cwd: process.cwd() }),
  ];
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Complete! Fixed ${fixedCount} files.`);
}

main();
