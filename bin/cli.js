#!/usr/bin/env node
import fs from "fs/promises";

import { createBundle } from "../lib/bundle.js";

const usage = `Usage:
  nutrient-font-tool create <input-dir> -o <output-dir> [--pretty] [--zip]
  nutrient-font-tool --help
  nutrient-font-tool --version
`;

async function printVersion() {
  const packageUrl = new URL("../package.json", import.meta.url);
  const data = await fs.readFile(packageUrl, "utf-8");
  const { version } = JSON.parse(data);
  console.log(version ?? "0.0.0");
}

function printUsage() {
  console.log(usage.trimEnd());
}

function parseCreateArgs(args) {
  const inputDir = args[0];
  if (!inputDir) {
    throw new Error("Missing <input-dir> for create command.");
  }

  let outputDir;
  let pretty = false;
  let zip = false;

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "-o" || arg === "--output") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("Missing value for -o/--output option.");
      }
      outputDir = value;
      index += 1;
      continue;
    }

    if (arg === "--pretty") {
      pretty = true;
      continue;
    }

    if (arg === "--zip") {
      zip = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  if (!outputDir) {
    throw new Error("Missing -o/--output for create command.");
  }

  return {
    inputDir,
    outputDir,
    options: { pretty, zip },
  };
}

async function runCreate(args) {
  const { inputDir, outputDir, options } = parseCreateArgs(args);
  const result = await createBundle(inputDir, outputDir, options);
  console.log(`Created bundle with ${result.fontsProcessed} fonts at ${result.outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    printUsage();
    process.exit(0);
  }

  if (args[0] === "--version") {
    await printVersion();
    process.exit(0);
  }

  if (args[0] === "create") {
    await runCreate(args.slice(1));
    process.exit(0);
  }

  throw new Error(`Unknown command: ${args[0]}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
