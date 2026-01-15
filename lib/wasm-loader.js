let wasmModulePromise;

async function loadWasmModule() {
  try {
    const module = await import("../wasm/FontToolWASM.js");
    if (typeof module.default !== "function") {
      throw new Error("Invalid WASM module export; expected default function.");
    }
    return await module.default();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const missingModule =
      error?.code === "ERR_MODULE_NOT_FOUND" ||
      message.includes("FontToolWASM.js");

    if (missingModule) {
      throw new Error(
        "WASM module not found. Generate the WASM bundle and ensure `wasm/FontToolWASM.js` and related files exist.",
        { cause: error }
      );
    }

    throw error;
  }
}

async function getWasmModule() {
  if (!wasmModulePromise) {
    wasmModulePromise = loadWasmModule();
  }

  return wasmModulePromise;
}

export async function processFont(buffer, filename) {
  const wasmModule = await getWasmModule();
  // Use allocateMemory function, not MemoryHandle constructor
  const memoryHandle = wasmModule.allocateMemory(buffer.byteLength);

  try {
    const memoryView =
      memoryHandle.view instanceof Uint8Array
        ? memoryHandle.view
        : new Uint8Array(memoryHandle.view);

    memoryView.set(new Uint8Array(buffer));

    const resultJson = wasmModule.processFont(memoryHandle, filename);
    return JSON.parse(resultJson);
  } finally {
    memoryHandle.delete();
  }
}
