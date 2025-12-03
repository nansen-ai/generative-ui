# Debugger iOS

iOS companion app for testing `streamdown-rn` on real devices.

## Overview

This app connects to the web debugger via WebSocket and renders the same streaming content on a real iOS device. This allows you to test:

- Native rendering performance
- iOS-specific font and layout behavior
- Real device streaming experience

## Getting Started

### Prerequisites

- The web debugger must be running (`apps/debugger`)
- Xcode installed
- CocoaPods installed

### First Time Setup

```bash
cd apps/debugger-ios
bun install

# Install iOS dependencies
cd ios && pod install && cd ..
```

### Running the App

```bash
bun run dev    # Starts Metro (port 8082) + builds iOS app
```

> **Note:** Make sure the web debugger is running first:
> ```bash
> cd ../debugger && bun run dev:web
> ```

## How It Works

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│  Web Debugger   │ ──────────────────▶│  iOS Debugger   │
│  (port 8081)    │    (port 3001)     │  (port 8082)    │
│                 │                     │                 │
│  Control Panel  │                     │  StreamdownRN   │
│  + Streaming    │                     │  Renderer       │
└─────────────────┘                     └─────────────────┘
```

1. Web debugger streams markdown content
2. WebSocket server broadcasts to connected clients
3. iOS app receives content and renders via `StreamdownRN`

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Metro + build iOS (recommended) |
| `bun run start` | Start Metro server only |
| `bun run ios` | Build and run iOS app |

## Port Configuration

This app uses **port 8082** to avoid conflicts with the web debugger (port 8081).

The Metro URL is hardcoded in `ios/DebuggeriOS/AppDelegate.swift` to ensure the iOS simulator connects to the correct bundler.

## Troubleshooting

### "No script URL provided"

Make sure Metro is running on port 8082:
```bash
bun run start
```

### WebSocket not connecting

1. Ensure web debugger is running: `cd ../debugger && bun run dev:web`
2. Check that port 3001 is accessible from the simulator

### Build errors

Clean and rebuild:
```bash
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..
bun run ios
```

## Related

- [apps/debugger](../debugger) — Web control panel
- [packages/streamdown-rn](../../packages/streamdown-rn) — The renderer
- [packages/debug-components](../../packages/debug-components) — Shared test components
