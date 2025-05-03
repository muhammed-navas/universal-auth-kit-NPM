const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Clean up any temporary files
console.log("Cleaning up temporary files...");
try {
  // Delete bundled files
  const files = fs.readdirSync(".");
  files.forEach((file) => {
    if (file.includes(".bundled_") && file.endsWith(".mjs")) {
      try {
        fs.unlinkSync(file);
        console.log(`Deleted: ${file}`);
      } catch (err) {
        console.error(`Failed to delete ${file}: ${err.message}`);
      }
    }
  });

  // Delete dist directory
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
    console.log("Deleted: dist directory");
  }
} catch (err) {
  console.error(`Cleanup error: ${err.message}`);
}

// Create dist directory
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
  console.log("Created dist directory");
}

// Create subdirectories
["client", "server", "next", "common"].forEach((dir) => {
  if (!fs.existsSync(`dist/${dir}`)) {
    fs.mkdirSync(`dist/${dir}`, { recursive: true });
    console.log(`Created dist/${dir} directory`);
  }
});

// Create type declaration files if they don't exist
const createTypeFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
  }
};

// Simple build function
console.log("\nBuilding package...");
try {
  // Copy files instead of compiling
  const copyFile = (src, dest) => {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  };

  // Create simple index.js files
  const createIndexFile = (dir, exports) => {
    const cjsContent = `// CommonJS exports
${exports.map((name) => `exports.${name} = require('./${name}');`).join("\n")}
`;

    const esmContent = `// ESM exports
${exports
  .map((name) => `export { default as ${name} } from './${name}';`)
  .join("\n")}
`;

    fs.writeFileSync(`dist/${dir}/index.js`, cjsContent);
    console.log(`Created dist/${dir}/index.js`);

    fs.writeFileSync(`dist/${dir}/index.mjs`, esmContent);
    console.log(`Created dist/${dir}/index.mjs`);
  };

  // Client exports
  createIndexFile("client", ["AuthProvider", "useAuth"]);

  // Copy client files
  copyFile("client/AuthContext.tsx", "dist/client/AuthProvider.js");
  copyFile("client/useAuth.ts", "dist/client/useAuth.js");

  // Server exports
  createIndexFile("server", [
    "authMiddleware",
    "createToken",
    "verifyToken",
    "authRoutes",
  ]);

  // Copy server files
  copyFile("server/middleware.ts", "dist/server/authMiddleware.js");
  copyFile("server/token.ts", "dist/server/token.js");
  copyFile("server/routes.ts", "dist/server/authRoutes.js");

  // Next exports
  createIndexFile("next", ["withAuthAPI", "withAuthSSR"]);

  // Copy next files
  copyFile("next/withAuthAPI.ts", "dist/next/withAuthAPI.js");
  copyFile("next/withAuthSSR.ts", "dist/next/withAuthSSR.js");

  // Common exports
  createIndexFile("common", ["User", "AuthTokenPayload"]);

  // Copy common files
  copyFile("common/index.ts", "dist/common/index.js");

  // Main index file
  const mainIndexContent = `// Main exports
exports.client = require('./client');
exports.server = require('./server');
exports.next = require('./next');
exports.common = require('./common');
`;

  fs.writeFileSync("dist/index.js", mainIndexContent);
  console.log("Created dist/index.js");

  const mainIndexEsmContent = `// Main ESM exports
export * as client from './client/index.mjs';
export * as server from './server/index.mjs';
export * as next from './next/index.mjs';
export * as common from './common/index.mjs';
`;

  fs.writeFileSync("dist/index.mjs", mainIndexEsmContent);
  console.log("Created dist/index.mjs");

  console.log("\nBuild completed successfully!");
} catch (err) {
  console.error(`Build error: ${err.message}`);
  process.exit(1);
}
