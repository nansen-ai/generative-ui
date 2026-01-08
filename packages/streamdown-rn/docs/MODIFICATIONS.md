# streamdown-rn Modifications

Custom modifications to the base `streamdown-rn` package.

---

## New Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enable text selection for copy/paste |
| `onLinkPress` | `(url: string) => void` | - | Custom link press handler |

---

## Features

### 1. Text Selection
- Uses `react-native-uitextview` on iOS for proper partial text selection
- Falls back to standard `Text` for content with links (UITextView limitation)
- Standard `selectable` prop on Android

### 2. Custom Font Sizes
New `fontSizes` option in theme config:

```typescript
theme.fontSizes = {
  body: 16,
  heading1: 28,
  heading2: 24,
  heading3: 20,
  heading4: 18,
  heading5: 16,
  heading6: 14,
  code: 14,
};
```

### 3. Table Improvements
- Horizontal `ScrollView` for wide tables
- Minimum column width (100px)
- Consistent vertical padding on header and body rows

### 4. Strikethrough
Only `~~double tilde~~` supported. Single `~` disabled to avoid false positives with patterns like `~100`, `~/path`.

### 5. Debug Logging
Verbose logging disabled to reduce console spam.

---

## Dependencies

```bash
yarn add react-native-uitextview
```

---

## Files Modified

- `src/StreamdownRN.tsx` – new props
- `src/core/types.ts` – `ThemeFontSizes` interface
- `src/core/incomplete.ts` – strikethrough fix
- `src/core/splitter/logger.ts` – logging disabled
- `src/renderers/ASTRenderer.tsx` – `SelectableText` component, table rendering
- `src/renderers/ActiveBlock.tsx` – prop propagation
- `src/renderers/StableBlock.tsx` – prop propagation
- `src/themes/index.ts` – font sizes, color inheritance
