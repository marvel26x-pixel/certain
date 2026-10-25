import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1) ?? '';
const basePath = repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/';

await rm(output, { recursive: true, force: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await mkdir(path.join(output, 'catalogue'), { recursive: true });
await cp(path.join(output, 'catalogue.html'), path.join(output, 'catalogue', 'index.html'));
await mkdir(path.join(output, 'data'), { recursive: true });
await cp(path.join(root, 'data', 'products.json'), path.join(output, 'data', 'products.json'));

for (const fileName of ['index.html', 'catalogue.html', 'privacy.html', '404.html', 'catalogue/index.html']) {
  const filePath = path.join(output, fileName);
  let html = await readFile(filePath, 'utf8');
  html = html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${basePath}`);
  await writeFile(filePath, html);
}

const appPath = path.join(output, 'app.js');
const appScript = await readFile(appPath, 'utf8');
await writeFile(appPath, `window.GITHUB_PAGES = true;\nwindow.SITE_BASE_PATH = ${JSON.stringify(basePath)};\n${appScript}`);

console.log(`GitHub Pages site built at ${output} with base path ${basePath}`);