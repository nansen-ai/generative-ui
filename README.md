![streamdown-rn Banner](./assets/banner.png)

# streamdown-rn

[![npm version](https://img.shields.io/npm/v/streamdown-rn)](https://www.npmjs.com/package/streamdown-rn)

A React Native streaming markdown renderer based on [Vercel's Streamdown](https://github.com/vercel/streamdown), with powerful enhacements for more dynamic AI applications.

streamdown-rn is designed to be mobile native and to have feature parity with streamdown, then adds one additional standout feature: **dynamic component injection.**

Dynamic component injection gives LLMs the ability to use arbitrary React Native components that are curated through an external registry, turning an AI chat interface into a dynamically generated UI.

## What makes streamdown-rn different?

streamdown-rn brings Vercel's streaming markdown philosophy to React Native, plus a powerful innovation that streamdown doesn't have:

**🎯 Dynamic component injection**:
- Supports **arbitrary React Native components** supplied through an external registry
- LLMs can inject any registered component directly into markdown responses
- Runtime component validation with JSON schemas
- Turn chat into a **programmable UI platform** where AI composes complex, interactive interfaces on the fly
- Example: AI renders a `TokenCard`, `Chart`, or any custom component right in the response


**Importantly:** Rather than requiring rigid rendering logic on the client side to render these UI components (which would mean your client side code gets more complicated with each additional component), streamdown-rn gives your LLM a flexible, generic interface through which it chooses to use and saturates the props of UI components when it deems best.

Of course, mobile and streaming come standard:

**📱 Mobile-first** - Built specifically for React Native:
- StyleSheet-based theming (not CSS)
- Optimized for touch interfaces
- Cross-platform (iOS, Android, Web)

**🚀 Streaming-first** - Just like Vercel's streamdown:
- Handles incomplete markdown gracefully
- Smooth real-time rendering during AI responses
- Optimized for rapid text updates

## Features

🎯 **Dynamic component injection** - Supports arbitrary React Native components via external registry  
🚀 **Streaming-first** - Handles incomplete markdown gracefully during AI response streaming  
📱 **Mobile-optimized** - Built specifically for React Native performance  
🎨 **Themeable** - Built-in dark/light theme support with StyleSheet  
💻 **Syntax highlighting** - Beautiful code blocks with copy-to-clipboard  
📊 **Table support** - Horizontal scrolling for mobile  
⚡ **Performance optimized** - Memoized rendering, streaming optimization, component caching  
🎛️ **Style overrides** - Deep merge custom styles with theme styles  
🛡️ **Error handling** - Component error callbacks for graceful failures

## Why streamdown-rn?

Traditional markdown renderers break down when you stream incomplete content from AI models - Vercel's streamdown solvd this for React. streamdown-rn brings the same elegance to React Native, allowing LM sto compose rich, interactive UIs directly in markdown responses.

## Installation

```bash
bun add streamdown-rn
```

Or with npm/yarn:
```bash
npm install streamdown-rn
# or
yarn add streamdown-rn
```

## Usage

### Basic usage

```typescript
import { StreamdownRN } from 'streamdown-rn';

const MyComponent = ({ content }) => (
  <StreamdownRN theme="dark">
    {content}
  </StreamdownRN>
);
```

### With component registry

```typescript
import { StreamdownRN } from 'streamdown-rn';
import { View } from 'react-native';

// Your component registry (see Component Registry Setup below)
const componentRegistry = createComponentRegistry();

const AssistantMessage = ({ content }) => (
  <View style={styles.assistantRow}>
    <StreamdownRN 
      componentRegistry={componentRegistry}
      theme="dark"
      onComponentError={(error) => console.warn('Component error:', error)}
    >
      {content}
    </StreamdownRN>
  </View>
);
```

### Component injection - the killer feature

This is streamdown-rn's standout feature - something Vercel's streamdown doesn't have. Your AI can inject **arbitrary React Native components** directly into markdown responses:

```markdown
Here's some **bold text** and a dynamic component:

{{component: "TokenCard", props: {
  "tokenSymbol": "BTC",
  "tokenPrice": 45000,
  "priceChange24h": 2.5
}}}

More markdown content continues...
```

This turns your chat interface into a **programmable UI platform** where the LLM composes complex, interactive interfaces on the fly. Any component you register can be injected by the AI.

### Component registry setup

To enable component injection, you need to create and provide a component registry. Here's how:

```typescript
import { ComponentRegistry, ComponentDefinition } from 'streamdown-rn';
import { TokenCard } from './components/TokenCard';
import { Chart } from './components/Chart';

// Define your components with JSON schemas for validation
const components: ComponentDefinition[] = [
  {
    name: 'TokenCard',
    component: TokenCard,
    category: 'dynamic',
    description: 'Displays token information',
    propsSchema: {
      type: 'object',
      properties: {
        tokenSymbol: { type: 'string' },
        tokenPrice: { type: 'number' },
        priceChange24h: { type: 'number' }
      },
      required: ['tokenSymbol', 'tokenPrice']
    }
  },
  {
    name: 'Chart',
    component: Chart,
    category: 'dynamic',
    description: 'Renders a chart',
    propsSchema: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        type: { type: 'string', enum: ['line', 'bar', 'pie'] }
      },
      required: ['data', 'type']
    }
  }
];

// Create registry implementation
function createComponentRegistry(): ComponentRegistry {
  const componentMap = new Map(components.map(c => [c.name, c]));
  
  return {
    get(name: string) {
      return componentMap.get(name);
    },
    has(name: string) {
      return componentMap.has(name);
    },
    validate(name: string, props: any) {
      const def = componentMap.get(name);
      if (!def) {
        return { valid: false, errors: [`Component '${name}' not found`] };
      }
      
      // Simple validation - you can use ajv or similar for full JSON Schema validation
      const schema = def.propsSchema;
      const errors: string[] = [];
      
      if (schema.required) {
        for (const field of schema.required) {
          if (!(field in props)) {
            errors.push(`Missing required field: ${field}`);
          }
        }
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    }
  };
}

// Use it
const registry = createComponentRegistry();

<StreamdownRN componentRegistry={registry}>
  {markdownContent}
</StreamdownRN>
```

### Custom themes and style overrides

```typescript
import { StreamdownRN, ThemeConfig } from 'streamdown-rn';

// Use built-in themes
<StreamdownRN theme="dark">
  {content}
</StreamdownRN>

<StreamdownRN theme="light">
  {content}
</StreamdownRN>

// Custom theme
const customTheme: ThemeConfig = {
  colors: {
    text: '#FFFFFF',
    background: '#000000',
    border: '#333333',
    link: '#4A9EFF',
    code: '#A7BEE6',
    codeBackground: '#101A29',
    blockquote: '#4A9EFF',
    strong: '#FFFFFF',
    emphasis: '#C7D2E8',
  },
  fonts: {
    body: 'Satoshi',
    code: 'Menlo',
    heading: 'Satoshi',
  },
  spacing: {
    paragraph: 12,
    heading: 16,
    list: 8,
    code: 12,
  },
};

<StreamdownRN theme={customTheme}>
  {content}
</StreamdownRN>

// Style overrides (deep merged with theme)
<StreamdownRN 
  theme="dark"
  styleOverrides={{
    paragraph: {
      fontSize: 18,
      lineHeight: 26,
    },
    heading1: {
      fontSize: 28,
    }
  }}
>
  {content}
</StreamdownRN>
```

## API reference

### StreamdownRN props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | The streaming markdown content |
| `componentRegistry` | `ComponentRegistry` | `undefined` | Optional component registry for dynamic components |
| `theme` | `'light' \| 'dark' \| ThemeConfig` | `'dark'` | Theme configuration |
| `styleOverrides` | `Partial<Record<string, any>>` | `undefined` | Style overrides (deep merged with theme styles) |
| `onComponentError` | `(error: ComponentError) => void` | `undefined` | Error handler for component failures |
| `style` | `ViewStyle` | `undefined` | Additional styling for the container |

### Component registry interface

```typescript
interface ComponentRegistry {
  get(name: string): ComponentDefinition | undefined;
  validate(name: string, props: any): ValidationResult;
  has(name: string): boolean;
}

interface ComponentDefinition {
  name: string;
  component: ComponentType<any>;
  category: 'dynamic';
  description?: string;
  propsSchema: JSONSchema;
  examples?: any[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

### Exported utilities

streamdown-rn exports several utilities for advanced use cases:

#### Markdown processing utilities

```typescript
import { 
  fixIncompleteMarkdown,
  isMarkdownIncomplete,
  sanitizeMarkdown,
  optimizeForStreaming
} from 'streamdown-rn';

// Fix incomplete markdown patterns
const fixed = fixIncompleteMarkdown('**bold text'); // Returns '**bold text**'

// Check if markdown is incomplete
const incomplete = isMarkdownIncomplete('**bold text'); // Returns true

// Sanitize markdown for safe rendering
const safe = sanitizeMarkdown(markdown);

// Optimize for streaming (handles long content efficiently)
const optimized = optimizeForStreaming(longMarkdown);
```

#### Component utilities

```typescript
import {
  extractComponents,
  injectComponentPlaceholders,
  validateComponentSyntax,
  getComponentStats
} from 'streamdown-rn';

// Extract components from markdown
const { markdown, components } = extractComponents(
  markdownWithComponents,
  componentRegistry
);

// Validate component syntax without processing
const validation = validateComponentSyntax(markdown);
// Returns: { valid: boolean, errors: string[], components: string[] }

// Get component statistics
const stats = getComponentStats(markdown);
// Returns: { totalComponents: number, uniqueComponents: string[], componentCounts: Record<string, number> }
```

#### Theme exports

```typescript
import {
  darkTheme,
  darkMarkdownStyles,
  lightTheme,
  lightMarkdownStyles
} from 'streamdown-rn';

// Use theme configs
const theme = darkTheme;

// Use pre-styled markdown styles
const styles = darkMarkdownStyles;
```

#### TypeScript types

All TypeScript interfaces are exported:

```typescript
import type {
  StreamdownRNProps,
  ComponentRegistry,
  ComponentDefinition,
  ComponentInstance,
  ProcessedMarkdown,
  ComponentError,
  ThemeConfig,
  ValidationResult,
  JSONSchema,
  IncompletePatterns,
} from 'streamdown-rn';
```

## Streaming features

### Incomplete markdown handling

streamdown-rn automatically fixes common incomplete markdown patterns during streaming:

- **Unclosed bold**: `**bold text` → `**bold text**`
- **Unclosed italic**: `*italic text` → `*italic text*`
- **Unclosed code**: `` `code text`` → `` `code text` ``
- **Unclosed code blocks**: ````javascript\ncode``` → ````javascript\ncode\n````
- **Unclosed links**: `[text](url` → `[text](url)`
- **Incomplete lists**: Proper spacing and formatting
- **Incomplete headings**: Proper spacing and formatting
- **Incomplete components**: Hides incomplete `{{component:...}}` syntax until complete

### Performance optimization

- **Memoized processing** - Prevents unnecessary re-renders
- **Streaming optimization** - Efficient handling of rapid text updates (processes only recent changes for long content)
- **Component caching** - Reuses validated components
- **Memory management** - Optimized for long chat sessions

## Examples

### Basic markdown

```typescript
const content = `
# Hello World

This is **bold text** and *italic text*.

Here's some \`inline code\` and a list:

- Item 1
- Item 2
- Item 3
`;

<StreamdownRN>{content}</StreamdownRN>
```

### With dynamic components

```typescript
const content = `
# Token Analysis

Here's the current Bitcoin data:

{{component: "TokenCard", props: {
  "tokenSymbol": "BTC",
  "tokenName": "Bitcoin",
  "tokenPrice": 45000,
  "priceChange24h": 2.5,
  "volume24h": 1200000000,
  "marketCap": 850000000000
}}}

The price has been **trending upward** recently.
`;

<StreamdownRN componentRegistry={myRegistry}>
  {content}
</StreamdownRN>
```

### Code syntax highlighting

```typescript
const codeContent = `
# Smart Contract Example

Here's a simple Solidity contract:

\`\`\`solidity
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
\`\`\`
`;

<StreamdownRN>{codeContent}</StreamdownRN>
```

### Tables with horizontal scroll

```typescript
const tableContent = `
# Data Table

| Token | Price | Change |
|-------|-------|--------|
| BTC   | $45,000 | +2.5% |
| ETH   | $3,200 | +1.8% |
| SOL   | $150 | -0.5% |
`;

<StreamdownRN>{tableContent}</StreamdownRN>
```

Tables automatically wrap in a horizontal ScrollView on mobile for better UX.

## Requirements

- **Node.js** >= 18
- **React** >= 18.0.0
- **React Native** >= 0.70.0

## Roadmap

streamdown-rn is early in development and still lacks some feature parity with Vercel's streamdown. The primary goal of our roadmap is to match that feature parity. Planned for future releases:

- **Math equations** - LaTeX rendering with KaTeX or react-native-math-view
- **Mermaid diagrams** - Interactive flowcharts, sequence diagrams, and more
- **GitHub Flavored Markdown** - Enhanced table support, task lists, strikethrough
- **Custom markdown rules** - Plugin system for extending functionality
- **Accessibility** - Screen reader support and ARIA labels

## Development

### Building

```bash
bun run build
```

### Testing

```bash
bun test
```

### Type checking

```bash
bun run type-check
```

## Contributing

We use [Changesets](https://github.com/changesets/changesets) for version management:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add a changeset: `bun run changeset`
5. Commit your changes with the changeset file
6. Submit a pull request

When your PR is merged, GitHub Actions will automatically create a "Version Packages" PR. When that PR is merged, your changes will be published to npm.

See [RELEASING.md](RELEASING.md) for detailed release process documentation.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details

## Inspiration

This project is inspired by [Vercel's Streamdown](https://github.com/vercel/streamdown).

----

Made with ❤️ by [Dark](https://darkresearch.ai)
