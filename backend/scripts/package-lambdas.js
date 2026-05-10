const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const handlers = [
  'getPortfolio',
  'getTransactions',
  'addTransaction',
  'deleteTransaction',
  'syncPrices',
];

async function zipHandler(handler) {
  const distDir = path.join(__dirname, '..', 'dist');
  const handlerDir = path.join(distDir, handler);
  const entryFile = path.join(handlerDir, 'index.js');
  const zipPath = path.join(distDir, `${handler}.zip`);

  if (!fs.existsSync(entryFile)) {
    throw new Error(`Missing build output: ${entryFile}`);
  }

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('warning', reject);
    archive.on('error', reject);

    archive.pipe(output);
    archive.file(entryFile, { name: 'index.js' });
    archive.finalize();
  });

  console.log(`📦 Zipped ${handler} -> ${zipPath}`);
}

async function main() {
  for (const handler of handlers) {
    await zipHandler(handler);
  }
  console.log('\n🎉 All handler zips created successfully!');
}

main().catch((err) => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
