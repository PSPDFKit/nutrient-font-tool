# FontToolWASM

Pre-compiled WebAssembly module for parsing font metadata.

## ⚠️ Do Not Modify

These files are **pre-compiled binaries** built from private source code:

- `FontToolWASM.js` - Emscripten-generated JavaScript loader
- `FontToolWASM.wasm` - Compiled WebAssembly binary

**Do not edit, regenerate, or reverse-engineer these files.**

## What It Does

The WASM module parses font files (TTF, OTF, TTC, OTC) and extracts metadata:

- Font names (family, full name, subfamily)
- Unicode code point coverage
- Embedding permissions
- Font weight
- SHA1 hash

## Usage

```javascript
import FontToolModule from './FontToolWASM.js';

// Initialize the module
const wasm = await FontToolModule();

// Allocate memory for font data
const fontBuffer = await fs.readFile('MyFont.ttf');
const memoryHandle = wasm.allocateMemory(fontBuffer.byteLength);

// Copy font data into WASM memory
new Uint8Array(memoryHandle.view).set(new Uint8Array(fontBuffer.buffer));

// Process the font
const jsonString = wasm.processFont(memoryHandle, 'MyFont.ttf');
const fontInfo = JSON.parse(jsonString);

// Always free memory when done
memoryHandle.delete();
```

## API

### `allocateMemory(size: number): MemoryHandle`

Allocates memory in the WASM heap for font data.

### `processFont(handle: MemoryHandle, filename: string): string`

Parses font data and returns JSON string with font metadata.

### `MemoryHandle`

- `.view` - Uint8Array view into allocated memory
- `.size` - Size of allocation in bytes  
- `.delete()` - Free the memory (must call when done)

## Output Format

```json
{
  "name": {
    "family": "Noto Sans",
    "fullName": "Noto Sans Regular",
    "subfamily": "Regular"
  },
  "filePath": "NotoSans-Regular.ttf",
  "codePoints": [[32, 126], [160, 255]],
  "sha1": "abc123...",
  "allowedToEmbed": true,
  "weight": 5
}
```
