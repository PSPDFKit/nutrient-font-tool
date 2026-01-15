# AGENTS.md - nutrient-font-tool

Guidelines for AI coding assistants working on this repository.

## Overview

This is a CLI tool that generates `fonts.json` metadata for Nutrient PDF SDK font bundles.

## Architecture

```
nutrient-font-tool/
├── bin/cli.js          # CLI entry point
├── lib/
│   ├── bundle.js       # Main logic: scan fonts, generate JSON
│   └── wasm-loader.js  # Loads and interfaces with WASM module
├── wasm/
│   ├── FontToolWASM.js   # Emscripten-generated JS loader
│   └── FontToolWASM.wasm # Compiled WebAssembly binary
└── test/
    └── bundle.test.js  # Vitest tests
```

## Important: WASM Binary

**The `wasm/` directory contains pre-compiled binaries.** The source code is not in this repository.

- Do NOT attempt to modify, regenerate, or reverse-engineer the WASM files
- Do NOT ask users for the WASM source code
- The WASM binary is built from private source code and distributed in compiled form
- Treat `wasm/FontToolWASM.js` and `wasm/FontToolWASM.wasm` as opaque dependencies

### WASM Interface

The WASM module exports:
- `allocateMemory(size)` → `MemoryHandle` - Allocate memory for font data
- `processFont(memoryHandle, filename)` → `string` - Process font, returns JSON string

The `MemoryHandle` object has:
- `.view` - Uint8Array view into WASM memory (copy data here)
- `.delete()` - Free the memory (always call when done)

## What You CAN Modify

- `bin/cli.js` - CLI argument parsing, user interaction
- `lib/bundle.js` - File scanning, JSON generation, output handling
- `lib/wasm-loader.js` - How we call into WASM (but not the WASM itself)
- `test/` - Tests
- Documentation, CI workflows, package.json

## What You Should NOT Modify

- `wasm/FontToolWASM.js` - Generated file, do not edit
- `wasm/FontToolWASM.wasm` - Binary, cannot edit

## Testing

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
```

Tests use a small fixture font (`test/fixtures/Anton-Regular.ttf`).

## Code Style

- ES modules (`import`/`export`)
- Node.js 18+ features are OK
- Keep dependencies minimal
- Async/await for file operations
