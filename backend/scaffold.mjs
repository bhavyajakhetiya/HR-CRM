import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const base = new URL('./src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const dirs = [
  'controllers', 'middleware', 'routes', 'utils', 'config'
];

for (const d of dirs) {
  const fullPath = join(base, d);
  mkdirSync(fullPath, { recursive: true });
  writeFileSync(join(fullPath, '.gitkeep'), '');
}

console.log('✅ Backend folder structure created!');
