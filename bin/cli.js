#!/usr/bin/env node
import fs from "fs/promises";

import { createBundle } from "../lib/bundle.js";

const usage = `Usage:
  nutrient-font-tool create <input-dir> [-o <output-file>] [--pretty]
  nutrient-font-tool --help
  nutrient-font-tool --version

Options:
  -o, --output <file>  Output file (default: <input-dir>/fonts.json)
  --pretty             Pretty-print JSON output
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

  let outputPath = null; // Will default to inputDir/fonts.json
  let pretty = false;

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "-o" || arg === "--output") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("Missing value for -o/--output option.");
      }
      outputPath = value;
      index += 1;
      continue;
    }

    if (arg === "--pretty") {
      pretty = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return {
    inputDir,
    outputPath,
    options: { pretty },
  };
}

async function runCreate(args) {
  const { inputDir, outputPath: customOutput, options } = parseCreateArgs(args);
  // Default output is inputDir/fonts.json
  const outputPath = customOutput ?? `${inputDir}/fonts.json`;
  const result = await createBundle(inputDir, outputPath, options);
  console.log(`Created ${result.outputPath} with ${result.fontsProcessed} fonts`);
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
