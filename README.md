# StreamdownRN

A React Native streaming markdown renderer inspired by [Vercel's Streamdown](https://github.com/vercel/streamdown), designed specifically for AI chat applications with dynamic component injection.

## Features

🚀 **Streaming-first** - Handles incomplete markdown gracefully during AI response streaming  
🔌 **Component registry** - Dynamic component injection via pluggable registry system  
📱 **Mobile-optimized** - Built specifically for React Native performance  
⚡ **Advanced features** - Math rendering, syntax highlighting, Mermaid diagrams  
🎨 **Themeable** - Built-in dark/light theme support  
🔢 **Math equations** - LaTeX rendering with react-native-math-view  
📊 **Mermaid diagrams** - Interactive flowcharts, sequence diagrams, and more  
🎯 **Syntax highlighting** - Beautiful code blocks with copy-to-clipboard  

## Why StreamdownRN?

Traditional markdown renderers break when you stream incomplete content from AI models. StreamdownRN is built specifically for this use case, handling partial formatting gracefully and providing smooth real-time rendering.

## Installation

```bash
npm install streamdown-rn
# or
yarn add streamdown-rn
# or
bun add streamdown-rn
```

## Usage

### Basic Usage

```typescript
import { StreamdownRN } from 'streamdown-rn';

const MyComponent = ({ content }) => (
  <StreamdownRN theme="dark">
    {content}
  </StreamdownRN>
);
```

### With Component Registry

```typescript
import { StreamdownRN } from 'streamdown-rn';

const AssistantMessage = ({ content, componentRegistry }) => (
  <View style={styles.assistantRow}>
    <DarkStarIcon />
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

### Component Injection

StreamdownRN supports dynamic component injection using JSON syntax:

```markdown
Here's some **bold text** and a dynamic component:

{{component: "TokenCard", props: {
  "tokenSymbol": "BTC",
  "tokenPrice": 45000,
  "priceChange24h": 2.5
}}}

More markdown content continues...
```

## API Reference

### StreamdownRN Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | The streaming markdown content |
| `componentRegistry` | `ComponentRegistry` | `undefined` | Optional component registry for dynamic components |
| `theme` | `'light' \| 'dark' \| ThemeConfig` | `'dark'` | Theme configuration |
| `onComponentError` | `(error: ComponentError) => void` | `undefined` | Error handler for component failures |
| `style` | `ViewStyle` | `undefined` | Additional styling for the container |

### Component Registry Interface

```typescript
interface ComponentRegistry {
  get(name: string): ComponentDefinition | undefined;
  validate(name: string, props: any): ValidationResult;
  has(name: string): boolean;
}
```

## Streaming Features

### Incomplete Markdown Handling

StreamdownRN automatically fixes common incomplete markdown patterns:

- **Unclosed bold**: `**bold text` → `**bold text**`
- **Unclosed italic**: `*italic text` → `*italic text*`
- **Unclosed code**: `` `code text`` → `` `code text` ``
- **Unclosed code blocks**: ````javascript\ncode``` → ````javascript\ncode\n````
- **Incomplete lists**: Proper spacing and formatting
- **Incomplete headings**: Proper spacing and formatting

### Performance Optimization

- **Memoized processing** - Prevents unnecessary re-renders
- **Streaming optimization** - Efficient handling of rapid text updates
- **Component caching** - Reuses validated components
- **Memory management** - Optimized for long chat sessions

## Examples

### Basic Markdown

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

### With Dynamic Components

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

### Advanced Features

**Math Equations:**
```typescript
const mathContent = `
# Mathematical Analysis

The compound interest formula is: $A = P(1 + r/n)^{nt}$

For continuous compounding:

$$A = Pe^{rt}$$

Where:
- $P$ = principal amount
- $r$ = annual interest rate
- $t$ = time in years
`;

<StreamdownRN>{mathContent}</StreamdownRN>
```

**Code Syntax Highlighting:**
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

**Mermaid Diagrams:**
```typescript
const diagramContent = `
# DeFi Protocol Flow

\`\`\`mermaid
graph TD
    A[User] --> B[Connect Wallet]
    B --> C[Select Token]
    C --> D[Approve Transaction]
    D --> E[Execute Swap]
    E --> F[Receive Tokens]
    F --> G[Update Balance]
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant User
    participant DApp
    participant Blockchain
    
    User->>DApp: Initiate Transaction
    DApp->>Blockchain: Submit Transaction
    Blockchain-->>DApp: Transaction Hash
    DApp-->>User: Confirmation
\`\`\`
`;

<StreamdownRN>{diagramContent}</StreamdownRN>
```

## Development

### Building

```bash
cd packages/streamdown-rn
npm run build
```

### Testing

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT - see LICENSE file for details

## Inspiration

This project is inspired by [Vercel's Streamdown](https://github.com/vercel/streamdown) but built specifically for React Native environments with mobile-first optimizations.