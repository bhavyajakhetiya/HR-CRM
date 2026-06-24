import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const base = new URL('./src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const dirs = [
  'pages/admin', 'pages/employee', 'pages/candidate', 'pages/auth', 'pages/public',
  'components/ui', 'components/layout', 'components/shared', 'components/forms',
  'layouts', 'services', 'hooks', 'store', 'utils', 'routes', 'context',
  'assets/images', 'assets/icons'
];

for (const d of dirs) {
  const fullPath = join(base, d);
  mkdirSync(fullPath, { recursive: true });
  writeFileSync(join(fullPath, '.gitkeep'), '');
}

console.log('✅ Folder structure created!');
