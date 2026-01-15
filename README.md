# nutrient-font-tool

Create dynamic font bundles for Nutrient PDF SDK.

## Installation

```bash
# Run directly (no install needed)
npx github:PSPDFKit/nutrient-font-tool create ./my-fonts -o ./bundle

# Or install globally
npm install -g github:PSPDFKit/nutrient-font-tool
```

## Usage

```bash
# Basic usage
nutrient-font-tool create <input-dir> -o <output-dir>

# With options
nutrient-font-tool create ./fonts -o ./bundle --pretty --zip

# Help
nutrient-font-tool --help
```

### Options

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Output directory (required) |
| `--pretty` | Pretty-print fonts.json |
| `--zip` | Also create a .zip bundle |

## Supported Formats

- `.ttf` - TrueType
- `.otf` - OpenType
- `.ttc` - TrueType Collection
- `.otc` - OpenType Collection

## Output

The tool creates a font bundle directory containing:

- All input font files (copied)
- `fonts.json` - Font metadata for Nutrient PDF SDK

### fonts.json Structure

```json
{
  "v": 1,
  "availableFonts": [
    {
      "name": {
        "family": "Noto Sans",
        "fullName": "Noto Sans Regular",
        "subfamily": "Regular"
      },
      "filePath": "NotoSans-Regular.ttf",
      "codePoints": [[32, 126], [160, 255], ...],
      "sha1": "abc123...",
      "allowedToEmbed": true,
      "weight": 5
    }
  ]
}
```

## Requirements

- Node.js 18+

## License

MIT
