import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  console.log("Cleaning dist directory...");
  await rm("dist", { recursive: true, force: true });

  console.log("Building client with Vite...");
  await viteBuild();

  console.log("Building server with esbuild...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "dist/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`.trim(),
    },
    external: [
      ...externals,
      "events", "fs", "path", "http", "https", "util", "stream", "crypto", "os", "url", "zlib", "child_process", "cluster", "dgram", "dns", "net", "querystring", "readline", "repl", "tls", "tty", "v8", "vm", "worker_threads",
      "node:*"
    ],
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error("BUILD FAILED!");
  console.error(err);
  if (err instanceof Error) {
    console.error(err.stack);
  }
  process.exit(1);
});
