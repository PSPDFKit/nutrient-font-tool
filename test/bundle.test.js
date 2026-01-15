import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createBundle } from '../lib/bundle.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures');

describe('createBundle', () => {
  const outputPath = path.join(__dirname, 'output', 'fonts.json');
  
  afterAll(async () => {
    // Cleanup
    try {
      await fs.rm(path.join(__dirname, 'output'), { recursive: true });
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  it('should create fonts.json from font files', async () => {
    const result = await createBundle(fixturesDir, outputPath);
    
    expect(result.fontsProcessed).toBeGreaterThan(0);
    expect(result.outputPath).toBe(outputPath);
    
    // Verify file was created
    const content = await fs.readFile(outputPath, 'utf-8');
    const json = JSON.parse(content);
    
    expect(json.v).toBe(1);
    expect(json.availableFonts).toBeInstanceOf(Array);
    expect(json.availableFonts.length).toBeGreaterThan(0);
  });

  it('should include font metadata', async () => {
    const result = await createBundle(fixturesDir, outputPath);
    const content = await fs.readFile(outputPath, 'utf-8');
    const json = JSON.parse(content);
    
    const font = json.availableFonts[0];
    
    expect(font).toHaveProperty('name');
    expect(font).toHaveProperty('filePath');
    expect(font).toHaveProperty('codePoints');
    expect(font).toHaveProperty('sha1');
    expect(font).toHaveProperty('allowedToEmbed');
  });

  it('should support pretty printing', async () => {
    const prettyPath = path.join(__dirname, 'output', 'fonts-pretty.json');
    await createBundle(fixturesDir, prettyPath, { pretty: true });
    
    const content = await fs.readFile(prettyPath, 'utf-8');
    
    // Pretty printed JSON has newlines
    expect(content).toContain('\n');
    expect(content).toContain('  ');
  });

  it('should scan directories recursively', async () => {
    // Create nested structure
    const nestedDir = path.join(__dirname, 'output', 'nested');
    const subDir = path.join(nestedDir, 'subdir');
    await fs.mkdir(subDir, { recursive: true });
    await fs.copyFile(
      path.join(fixturesDir, 'Anton-Regular.ttf'),
      path.join(subDir, 'Anton-Regular.ttf')
    );
    
    const nestedOutput = path.join(__dirname, 'output', 'nested-fonts.json');
    const result = await createBundle(nestedDir, nestedOutput);
    
    expect(result.fontsProcessed).toBe(1);
  });
});
