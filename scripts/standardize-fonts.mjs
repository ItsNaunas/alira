#!/usr/bin/env node

/**
 * Font Standardization Script
 * 
 * This script ensures 100% font consistency across the entire ALIRA project.
 * It replaces all font weight classes with the standardized system.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Comprehensive replacement rules
const replacements = [
  // 1. Replace font-heading with font-serif font-bold
  {
    find: /\bfont-heading\b/g,
    replace: 'font-serif font-bold',
    description: 'Replace font-heading'
  },
  
  // 2. Standalone font-bold on large text (headings) -> font-serif font-bold
  {
    find: /className="([^"]*?)(text-(?:xl|2xl|3xl|4xl|5xl|6xl|7xl)[^"]*?)(\s+)font-bold(?!\s*font-serif)([^"]*)"/g,
    replace: 'className="$1$2$3font-serif font-bold$4"',
    description: 'Add font-serif to large bold text'
  },
  
  // 3. Standalone font-semibold on medium+ text -> font-serif font-semibold
  {
    find: /className="([^"]*?)(text-(?:base|lg|xl|2xl|3xl)[^"]*?)(\s+)font-semibold(?!\s*font-serif)([^"]*)"/g,
    replace: 'className="$1$2$3font-serif font-semibold$4"',
    description: 'Add font-serif to medium+ semibold text'
  },
  
  // 4. Small font-semibold (labels) -> font-sans font-semibold
  {
    find: /className="([^"]*?)(text-(?:xs|sm)[^"]*?)(\s+)font-semibold(?!\s*font-(?:serif|sans))([^"]*)"/g,
    replace: 'className="$1$2$3font-sans font-semibold$4"',
    description: 'Add font-sans to small semibold text'
  },
  
  // 5. Standalone font-medium -> font-sans font-medium
  {
    find: /className="([^"]*?)font-medium(?!\s*font-(?:serif|sans))([^"]*)"/g,
    replace: 'className="$1font-sans font-medium$2"',
    description: 'Add font-sans to medium weight text'
  },
  
  // 6. Fix any double font families (keep serif if present)
  {
    find: /\bfont-sans\s+font-serif\s+font-bold\b/g,
    replace: 'font-serif font-bold',
    description: 'Remove double font families (serif)'
  },
  {
    find: /\bfont-serif\s+font-sans\s+font-semibold\b/g,
    replace: 'font-serif font-semibold',
    description: 'Remove double font families (serif semibold)'
  },
  
  // 7. Clean up any triple font declarations
  {
    find: /(\bfont-serif\b)\s+(\bfont-serif\b)/g,
    replace: '$1',
    description: 'Remove duplicate font-serif'
  },
  {
    find: /(\bfont-sans\b)\s+(\bfont-sans\b)/g,
    replace: '$1',
    description: 'Remove duplicate font-sans'
  },
  
  // 8. Add dark mode colors to text-alira-onyx (if not already present)
  {
    find: /\btext-alira-onyx(?!\S)(?!.*dark:text-)/g,
    replace: 'text-alira-onyx dark:text-alira-porcelain',
    description: 'Add dark mode color to text-alira-onyx'
  },
  
  // 9. Add dark mode colors to text-alira-onyx/80
  {
    find: /\btext-alira-onyx\/80(?!\S)(?!.*dark:text-)/g,
    replace: 'text-alira-onyx/80 dark:text-alira-porcelain/80',
    description: 'Add dark mode color to text-alira-onyx/80'
  },
  
  // 10. Add dark mode colors to text-alira-onyx/70
  {
    find: /\btext-alira-onyx\/70(?!\S)(?!.*dark:text-)/g,
    replace: 'text-alira-onyx/70 dark:text-alira-porcelain/70',
    description: 'Add dark mode color to text-alira-onyx/70'
  },
];

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        results = results.concat(getAllTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  
  return results;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changesCount = 0;
  
  replacements.forEach(({ find, replace }) => {
    const before = content;
    content = content.replace(find, replace);
    if (content !== before) {
      changesCount++;
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return changesCount;
  }
  
  return 0;
}

function main() {
  console.log('🎨 ALIRA Font Standardization Script\n');
  console.log('━'.repeat(50));
  console.log('Scanning for TSX/TS files...\n');
  
  const appFiles = getAllTsxFiles(path.join(rootDir, 'app'));
  const componentFiles = getAllTsxFiles(path.join(rootDir, 'components'));
  const allFiles = [...appFiles, ...componentFiles];
  
  console.log(`Found ${allFiles.length} files to process\n`);
  console.log('Processing...\n');
  
  let totalFilesModified = 0;
  let totalChanges = 0;
  
  allFiles.forEach(file => {
    const changes = processFile(file);
    if (changes > 0) {
      totalFilesModified++;
      totalChanges += changes;
      const relativePath = path.relative(rootDir, file);
      console.log(`✓ ${relativePath} (${changes} change${changes > 1 ? 's' : ''})`);
    }
  });
  
  console.log('\n' + '━'.repeat(50));
  console.log(`\n✅ Complete!`);
  console.log(`   Files modified: ${totalFilesModified}`);
  console.log(`   Total changes: ${totalChanges}\n`);
  
  if (totalFilesModified === 0) {
    console.log('🎉 All fonts are already consistent!\n');
  } else {
    console.log('🎉 All fonts are now standardized!\n');
  }
}

main();
