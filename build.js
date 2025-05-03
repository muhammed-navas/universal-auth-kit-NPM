const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean up any temporary files
console.log('Cleaning up temporary files...');
try {
  // Delete bundled files
  const files = fs.readdirSync('.');
  files.forEach(file => {
    if (file.includes('.bundled_') && file.endsWith('.mjs')) {
      try {
        fs.unlinkSync(file);
        console.log(`Deleted: ${file}`);
      } catch (err) {
        console.error(`Failed to delete ${file}: ${err.message}`);
      }
    }
  });

  // Delete dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('Deleted: dist directory');
  }
} catch (err) {
  console.error(`Cleanup error: ${err.message}`);
}

// Build the package
console.log('\nBuilding package...');
try {
  // Build each entry point separately to avoid bundling issues
  const entries = [
    'index.ts',
    'client/index.ts',
    'server/index.ts',
    'next/index.ts'
  ];

  entries.forEach(entry => {
    console.log(`Building ${entry}...`);
    execSync(`npx tsc --declaration --emitDeclarationOnly --outDir dist ${entry}`, { stdio: 'inherit' });
    execSync(`npx esbuild ${entry} --outdir=dist --format=cjs --platform=node --sourcemap`, { stdio: 'inherit' });
    
    // Get the directory and filename
    const dir = path.dirname(entry);
    const base = path.basename(entry, '.ts');
    
    // Create the ESM version
    if (dir !== '.') {
      // Ensure directory exists
      if (!fs.existsSync(`dist/${dir}`)) {
        fs.mkdirSync(`dist/${dir}`, { recursive: true });
      }
    }
    
    // Copy the CJS file to create an ESM version
    const cjsPath = path.join('dist', dir === '.' ? `${base}.js` : `${dir}/${base}.js`);
    const esmPath = path.join('dist', dir === '.' ? `${base}.mjs` : `${dir}/${base}.mjs`);
    
    fs.copyFileSync(cjsPath, esmPath);
    console.log(`Created ESM version: ${esmPath}`);
  });

  console.log('\nBuild completed successfully!');
} catch (err) {
  console.error(`Build error: ${err.message}`);
  process.exit(1);
}
