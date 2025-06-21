const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync(path.join(__dirname, '../src/pages/**/*.{js,jsx}'));

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const suggestions = [];
  if (!/AdminPageLayout/.test(content)) suggestions.push('wrap with AdminPageLayout');
  if (!/AppBreadcrumbs/.test(content)) suggestions.push('add AppBreadcrumbs');
  if (/<h5[^>]*>/.test(content) && !/Typography[^>]*variant="h5"/.test(content)) {
    suggestions.push('replace h5 with Typography variant="h5"');
  }
  if (suggestions.length) {
    console.log(`${path.relative(path.join(__dirname, '..'), file)}: ${suggestions.join(', ')}`);
  }
});
