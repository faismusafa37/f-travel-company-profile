const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/Ftravel/src');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('const prisma = new PrismaClient();')) {
    content = content.replace(/import\s*\{\s*PrismaClient\s*\}\s*from\s*['\"]@prisma\/client['\"];?/g, '');
    content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, 'import prisma from \"@/lib/prisma\";');
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
    count++;
  }
});

console.log('Total fixed:', count);
