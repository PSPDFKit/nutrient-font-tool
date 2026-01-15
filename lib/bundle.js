import fs from "fs/promises";
import path from "path";

import { processFont } from "./wasm-loader.js";

const FONT_EXTENSIONS = new Set([".ttf", ".otf", ".ttc", ".otc"]);

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function findFontFiles(dir) {
  const fontFiles = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await findFontFiles(fullPath);
      fontFiles.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (FONT_EXTENSIONS.has(ext)) {
        fontFiles.push({ path: fullPath, name: entry.name });
      }
    }
  }

  return fontFiles;
}

export async function createBundle(inputDir, outputPath, options = {}) {
  const { pretty = false } = options;

  const fontFiles = await findFontFiles(inputDir);
  const availableFonts = [];

  for (const { path: fontPath, name } of fontFiles) {
    const fileBuffer = await fs.readFile(fontPath);
    const result = await processFont(toArrayBuffer(fileBuffer), name);

    if (Array.isArray(result)) {
      availableFonts.push(...result);
    } else if (result) {
      availableFonts.push(result);
    }
  }

  const bundle = { v: 1, availableFonts };
  const json = JSON.stringify(bundle, null, pretty ? 2 : 0);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (outputDir && outputDir !== '.') {
    await fs.mkdir(outputDir, { recursive: true });
  }
  
  await fs.writeFile(outputPath, json);

  return {
    fontsProcessed: availableFonts.length,
    outputPath,
  };
}
