import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import archiver from "archiver";

import { processFont } from "./wasm-loader.js";

const FONT_EXTENSIONS = new Set([".ttf", ".otf", ".ttc", ".otc"]);

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function createZip(sourceDir, zipPath) {
  await new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

export async function createBundle(inputDir, outputDir, options = {}) {
  const { pretty = false, zip = false } = options;

  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(inputDir, { withFileTypes: true });
  const availableFonts = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!FONT_EXTENSIONS.has(extension)) {
      continue;
    }

    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);
    const fileBuffer = await fs.readFile(inputPath);
    const result = await processFont(toArrayBuffer(fileBuffer), entry.name);

    if (Array.isArray(result)) {
      availableFonts.push(...result);
    } else if (result) {
      availableFonts.push(result);
    }

    await fs.copyFile(inputPath, outputPath);
  }

  const bundle = { v: 1, availableFonts };
  const json = JSON.stringify(bundle, null, pretty ? 2 : 0);
  const fontsJsonPath = path.join(outputDir, "fonts.json");
  await fs.writeFile(fontsJsonPath, json);

  let zipPath;
  if (zip) {
    zipPath = `${outputDir}.zip`;
    await createZip(outputDir, zipPath);
  }

  return {
    fontsProcessed: availableFonts.length,
    outputPath: fontsJsonPath,
    ...(zipPath ? { zipPath } : {}),
  };
}
