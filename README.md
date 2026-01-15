# nutrient-font-tool

Generate `fonts.json` metadata for Nutrient PDF SDK font bundles.

📖 **Guide**: [Dynamic Font Loading in Nutrient Web SDK](https://www.nutrient.io/guides/web/forms/fill-form-fields/dynamic-font-loading/)

## Installation

```bash
# Run directly (no install needed)
npx github:PSPDFKit/nutrient-font-tool create ./my-fonts

# Or install globally
npm install -g github:PSPDFKit/nutrient-font-tool
```

## Usage

```bash
# Generate fonts.json inside the font directory
nutrient-font-tool create ./my-fonts
# → ./my-fonts/fonts.json

# Specify custom output path
nutrient-font-tool create ./my-fonts -o ./output/fonts.json

# Pretty-print the JSON
nutrient-font-tool create ./my-fonts --pretty
```

The tool recursively scans the input directory for font files.

### Options

| Option | Description |
|--------|-------------|
| `-o, --output <file>` | Output file (default: `<input-dir>/fonts.json`) |
| `--pretty` | Pretty-print JSON output |

## Supported Formats

- `.ttf` - TrueType
- `.otf` - OpenType
- `.ttc` - TrueType Collection
- `.otc` - OpenType Collection

## Output

Generates a `fonts.json` file with font metadata:

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

## Learn More

- [Dynamic Font Loading Guide](https://www.nutrient.io/guides/web/forms/fill-form-fields/dynamic-font-loading/) — How to use custom font bundles with Nutrient Web SDK
- [Nutrient Web SDK](https://www.nutrient.io/sdk/web/) — PDF SDK for web applications

## License

MIT
