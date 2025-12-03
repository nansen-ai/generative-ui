# Streamdown Debugger

Web-based control panel for testing and debugging `streamdown-rn`.

## Features

- Character-by-character streaming simulator (play / pause / step / seek)
- Speed control (1–9 chars/tick) and keyboard shortcuts
- Preset markdown scenarios (headers, lists, code blocks, components, etc.)
- Real-time debug state inspector powered by `onDebug`
- WebSocket broadcast to `apps/debugger-ios` for mobile testing

## Getting Started

```bash
cd apps/debugger
bun install
bun run dev:web    # Starts WebSocket server + Expo web
```

Open http://localhost:8081 to access the debugger.

## Architecture

The debugger runs two processes concurrently:

1. **WebSocket Server** (`server.js`) — Broadcasts streaming content on port 3001
2. **Expo Web** — React Native web app with control panel UI

The iOS debugger (`apps/debugger-ios`) connects to the WebSocket server to receive real-time content updates.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` | Step backward |
| `→` | Step forward |
| `R` | Reset to start |
| `1-9` | Set streaming speed |

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev:web` | Start server + web app (recommended) |
| `bun run web` | Start web app only |
| `bun run server` | Start WebSocket server only |

## Folder Structure

```
apps/debugger/
├── server.js           # WebSocket relay server (port 3001)
├── src/
│   ├── App.tsx         # Control panel UI
│   ├── presets.ts      # Markdown test presets
│   └── debugComponents.tsx  # (removed - now in debug-components package)
└── package.json
```

## Testing with iOS

1. Start the web debugger: `bun run dev:web`
2. In another terminal, start the iOS app: `cd ../debugger-ios && bun run dev`
3. Content streamed in the web debugger will appear on the iOS device

## Related

- [apps/debugger-ios](../debugger-ios) — iOS companion app
- [packages/streamdown-rn](../../packages/streamdown-rn) — The renderer being tested
- [packages/debug-components](../../packages/debug-components) — Shared test components
