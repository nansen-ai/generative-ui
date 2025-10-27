# Component Buffering During Streaming

## Problem

When Mallory streams AI responses that include dynamic UI components, users were seeing partial component code like:

```
{{component: "InlineCitation", props: {
```

This created a weird experience where the underlying component syntax was visible while the language model was still streaming the complete component definition.

## Solution

Added **component buffering** to StreamdownRN's incomplete markdown parser. When the parser detects an incomplete component (a `{{component:` opening without the closing `}}`), it now hides the entire partial component syntax until it's complete.

## Changes Made

### 1. `/src/core/types.ts`
- Added `unClosedComponent` pattern to `IncompletePatterns` interface

### 2. `/src/core/parseIncomplete.ts`

#### Added `unClosedComponent` Pattern
```typescript
// Component syntax: {{component: ... without closing }}
unClosedComponent: /\{\{component:/,
```

#### New `hideIncompleteComponents()` Function
This function:
- Finds the last occurrence of `{{component:` in the text
- Checks if there's a matching closing `}}` using proper brace counting
- Handles JSON string escaping properly (doesn't count braces inside strings)
- Returns clean text (without incomplete component) and buffered component text
- Logs buffering activity for debugging

#### Updated `fixIncompleteMarkdown()`
- Now calls `hideIncompleteComponents()` FIRST before any other processing
- This ensures incomplete component syntax is hidden before rendering

#### Updated `isMarkdownIncomplete()`
- Added `unClosedComponent` to the list of patterns checked

## How It Works

1. **Streaming starts**: "Here's a citation"
2. **Next chunk**: "Here's a citation{{component:"
   - Parser detects incomplete component
   - Hides "{{component:" from display
   - User only sees: "Here's a citation"
3. **Next chunk**: "Here's a citation{{component: \"InlineCitation\", props: {"
   - Still incomplete
   - User still only sees: "Here's a citation"
4. **Final chunk**: "Here's a citation{{component: \"InlineCitation\", props: {\"text\": \"\", \"sources\": [...]}}}}"
   - Component is now complete
   - Parser processes it normally
   - User sees: "Here's a citation" + rendered InlineCitation component

## Testing

To test the changes:

1. **Link local version to Mallory**:
   ```bash
   cd /path/to/mallory/apps/client
   # Update package.json to use: "streamdown-rn": "file:../../../streamdown-rn"
   bun install
   ```

2. **Start Mallory**:
   ```bash
   cd /path/to/mallory
   bun run web
   ```

3. **Test with a prompt that triggers citations**:
   - Ask Mallory to search for something
   - Watch the streaming response
   - You should NOT see any `{{component:` syntax while streaming
   - The citation component should appear cleanly once complete

## Edge Cases Handled

- ✅ Nested JSON objects in component props
- ✅ Escaped quotes in strings
- ✅ Multiple components in sequence
- ✅ Component at end of stream
- ✅ Empty text before component
- ✅ Component with complex multi-line props

## Performance Impact

Minimal - the function runs in O(n) time where n is the length of the text after the last `{{component:` marker, which is typically very small during streaming.

## Future Improvements

If needed, we could:
1. Buffer multiple incomplete components (currently only the last one)
2. Add configuration to disable buffering
3. Add visual indicator that content is being buffered
4. Expose buffered content length in callbacks

## Rollback

To revert to the previous behavior:

1. Change package.json back to:
   ```json
   "streamdown-rn": "0.1.4-beta.3"
   ```

2. Run:
   ```bash
   bun install
   ```

## Publishing

When ready to publish:

1. Update version in `package.json`
2. Build: `bun run build`
3. Publish: `npm publish` or use changesets
4. Update Mallory's package.json to use the new version

