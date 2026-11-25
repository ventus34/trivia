import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-desktop');
const require = createRequire(import.meta.url);
const stylesMarker = '<!-- desktop:styles -->';
const webOnly = /<!-- desktop:omit:start -->.*?<!-- desktop:omit:end -->/gs;

const index = await readFile(path.join(root, 'index.html'), 'utf8');
const desktopIndex = index.replace(webOnly, '').replace(stylesMarker, [
  '<link rel="stylesheet" href="fonts/inter.css">',
  '<link rel="stylesheet" href="tailwind.css">',
].join('\n    '));
if (desktopIndex.includes('desktop:omit:') || !desktopIndex.includes('href="tailwind.css"')) {
  throw new Error('Could not prepare the desktop HTML.');
}

const catalogPath = 'databases/list.json';
const catalog = JSON.parse(await readFile(path.join(root, catalogPath), 'utf8'));
if (!Array.isArray(catalog) || catalog.length === 0) throw new Error('Question catalog is empty.');

const packPaths = new Set();
for (const entry of catalog) {
  const packPath = entry?.path;
  if (typeof packPath !== 'string' || packPath === catalogPath ||
      !/^databases\/(?:categories\/)?[^/\\:]+\.json$/.test(packPath)) {
    throw new Error(`Invalid catalog pack path: ${packPath}`);
  }
  packPaths.add(packPath);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'index.html'), desktopIndex);

const fontDir = path.dirname(require.resolve('@fontsource-variable/inter/package.json'));
const fontCss = await readFile(path.join(fontDir, 'index.css'), 'utf8');
await mkdir(path.join(output, 'fonts'), { recursive: true });
await writeFile(path.join(output, 'fonts/inter.css'), fontCss.replaceAll("'Inter Variable'", "'Inter'"));
await Promise.all([
  cp(path.join(fontDir, 'files'), path.join(output, 'fonts/files'), {
    recursive: true,
    filter: (name) => name === path.join(fontDir, 'files') || name.endsWith('-wght-normal.woff2'),
  }),
  cp(path.join(fontDir, 'LICENSE'), path.join(output, 'fonts/LICENSE')),
]);

const assets = [
  'style.css', 'presentation-rework.css', 'board-rework.css', 'reading-rework.css', 'tv-rework.css',
  'js/theme.js', 'js/theme-preload.js', 'js/trivia', catalogPath, ...packPaths,
];
for (const asset of assets) {
  try {
    await cp(path.join(root, asset), path.join(output, asset), { recursive: true });
  } catch (error) {
    throw new Error(`Could not package ${asset}: ${error.message}`, { cause: error });
  }
}

execFileSync(process.execPath, [
  require.resolve('tailwindcss/lib/cli.js'),
  '--config', 'scripts/tailwind.desktop.cjs',
  '--output', path.join(output, 'tailwind.css'),
  '--minify',
], { cwd: root, stdio: 'inherit' });

console.log(`Prepared Trivia desktop assets with ${packPaths.size} question packs.`);
