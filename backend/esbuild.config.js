const esbuild = require('esbuild');
const path = require('path');

const handlers = [
  'getPortfolio',
  'getTransactions',
  'addTransaction',
  'deleteTransaction',
  'syncPrices',
];

async function build() {
  for (const handler of handlers) {
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'src', 'handlers', `${handler}.ts`)],
      bundle: true,
      minify: true,
      sourcemap: true,
      platform: 'node',
      target: 'node22',
      outfile: path.join(__dirname, 'dist', handler, 'index.js'),
      external: ['pg-native'],
      format: 'cjs',
    });
    console.log(`✅ Built ${handler}`);
  }
  console.log('\n🎉 All handlers built successfully!');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
