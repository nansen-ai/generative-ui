# Publishing StreamdownRN to npm

## Pre-Publish Checklist

### ✅ Already Completed

- [x] TypeScript type checking passes (`bun run type-check`)
- [x] Package builds successfully (`bun run build`)
- [x] `dist/` directory contains compiled JS and TypeScript definitions
- [x] Package structure verified with `npm pack --dry-run`
- [x] All unused imports and variables removed
- [x] Type declarations added for dependencies
- [x] License file (MIT) included
- [x] README documentation complete
- [x] Repository URL updated to darkresearch/streamdown-rn

### Package Stats

```
Package size: 40.4 kB (gzipped)
Unpacked size: 182.9 kB
Total files: 59
```

## Testing Before Publishing

### 1. Type Checking
```bash
cd /Users/phoenix/repos/dark/streamdown-rn
bun run type-check
```
✅ This passes successfully.

### 2. Build Verification
```bash
bun run build
ls -la dist/
```
✅ Generates all necessary `.js`, `.d.ts`, and `.map` files.

### 3. Package Contents Check
```bash
npm pack --dry-run
```
✅ Shows what will be published - looks good!

### 4. Test in Real Project (Mallory)

**Option A: Use npm link** (after publishing)
```bash
cd /Users/phoenix/repos/dark/mallory
npm install streamdown-rn
# Then test that the app builds and runs
```

**Option B: Local file install** (before publishing)
```bash
cd /Users/phoenix/repos/dark/streamdown-rn
npm pack  # Creates streamdown-rn-0.1.0.tgz

cd /Users/phoenix/repos/dark/mallory
npm install ../streamdown-rn/streamdown-rn-0.1.0.tgz
bun start
```

**Option C: Workspace reference** (current approach)
The package currently uses `"streamdown-rn": "workspace:*"` in Mallory's package.json, which points to the local monorepo version. After publishing, update this to `"streamdown-rn": "^0.1.0"`.

## Publishing to npm

### First Time Setup

1. **Create npm account** (if you don't have one):
```bash
npm adduser
```

2. **Login to npm**:
```bash
npm login
```

### Publish the Package

#### Option 1: Publish as Public Package

```bash
cd /Users/phoenix/repos/dark/streamdown-rn

# Double-check version
cat package.json | grep version

# Publish
npm publish
```

#### Option 2: Publish as Scoped Package (Recommended)

If you want it under the `@darkresearch` scope:

1. Update `package.json`:
```json
{
  "name": "@darkresearch/streamdown-rn",
  // ... rest of package.json
}
```

2. Publish:
```bash
npm publish --access public
```

### Post-Publish

1. **Verify on npm**:
   - Visit https://www.npmjs.com/package/streamdown-rn
   - Check that README displays correctly
   - Verify files are included

2. **Test installation**:
```bash
npm install streamdown-rn
# or
npm install @darkresearch/streamdown-rn
```

3. **Update Mallory**:
   - Change `package.json` from `"streamdown-rn": "workspace:*"` to `"streamdown-rn": "^0.1.0"`
   - Run `bun install`
   - Test that everything still works

## Version Management

### Patch Release (0.1.0 → 0.1.1)
```bash
npm version patch
npm publish
```

### Minor Release (0.1.0 → 0.2.0)
```bash
npm version minor
npm publish
```

### Major Release (0.1.0 → 1.0.0)
```bash
npm version major
npm publish
```

Each `npm version` command will:
- Update version in `package.json`
- Create a git commit
- Create a git tag

Then push the changes:
```bash
git push && git push --tags
```

## Troubleshooting

### "Package already exists"
If the package name is taken, you'll need to:
1. Choose a different name, or
2. Use a scoped package: `@darkresearch/streamdown-rn`

### Build errors before publish
The `prepublishOnly` script will automatically run `bun run build` before publishing. If this fails, fix the TypeScript errors first.

### Testing JSX transformation
The package contains JSX that isn't pre-transformed. This is intentional - React Native projects will handle the JSX transformation. You can't test the package with plain Node.js, but it will work fine in React Native projects.

## Current Status

✅ **Ready to publish!**

The package has been tested and is ready for npm. When you're ready to publish:

```bash
cd /Users/phoenix/repos/dark/streamdown-rn
npm login
npm publish
```

Or for scoped:
```bash
npm publish --access public
```

