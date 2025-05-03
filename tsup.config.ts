// tsup configuration

export default {
  entry: ["index.ts", "client/index.ts", "server/index.ts", "next/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  outDir: "dist",
  bundle: false,
  onSuccess: "echo Build completed successfully!",
};
