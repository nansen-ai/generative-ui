/**
 * Dark Theme Configuration
 * Matches the existing Scout app dark theme
 */

import { ThemeConfig } from '../core/types';

export const darkTheme: ThemeConfig = {
  colors: {
    text: '#DCE9FF',           // Main text color for better readability
    background: '#05080C',     // Background matching app
    border: '#1a1e24',         // Border color matching app
    link: '#4A9EFF',          // Link color matching app accent
    code: '#A7BEE6',          // Code text color
    codeBackground: '#101A29', // Code background matching chat input
    blockquote: '#4A9EFF',    // Blockquote accent color
    strong: '#FFFFFF',        // Bold text - slightly brighter
    emphasis: '#C7D2E8',      // Italic text - slightly dimmed
  },
  fonts: {
    body: 'Satoshi',          // Main font matching app
    code: 'Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',  // Monospace font stack (similar to ChatGPT)
    heading: 'Satoshi',       // Heading font
  },
  spacing: {
    paragraph: 12,            // Space between paragraphs
    heading: 16,              // Space around headings
    list: 8,                  // Space between list items
    code: 12,                 // Space around code blocks
  },
};

/**
 * Dark theme styles for react-native-markdown-display
 */
export const darkMarkdownStyles = {
  body: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  heading1: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  heading2: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  heading3: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  heading4: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  heading5: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  heading6: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.heading,
    fontSize: 12,
    fontWeight: 'bold' as const,
    marginTop: darkTheme.spacing.heading,
    marginBottom: darkTheme.spacing.paragraph,
  },
  paragraph: {
    color: darkTheme.colors.text,
    fontFamily: darkTheme.fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: darkTheme.spacing.paragraph,
  },
  strong: {
    color: darkTheme.colors.strong,
    fontWeight: 'bold' as const,
  },
  em: {
    color: darkTheme.colors.emphasis,
    fontStyle: 'italic' as const,
  },
  link: {
    color: darkTheme.colors.link,
    textDecorationLine: 'underline' as const,
  },
  code_inline: {
    color: darkTheme.colors.text,  // Same as regular text
    backgroundColor: 'transparent',  // No background, blend into chat
    fontFamily: darkTheme.fonts.code,
    fontSize: 14,  // Match body text size
    lineHeight: 22,  // Match body line height
    borderWidth: 0,  // No border
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
  },
  code_block: {
    color: darkTheme.colors.code,
    backgroundColor: darkTheme.colors.codeBackground,
    fontFamily: darkTheme.fonts.code,
    fontSize: 13,  // Slightly smaller like ChatGPT
    padding: 12,  // More consistent padding
    borderRadius: 6,  // Slightly tighter radius
    marginVertical: 8,  // Tighter spacing
  },
  fence: {
    color: darkTheme.colors.code,
    backgroundColor: darkTheme.colors.codeBackground,
    fontFamily: darkTheme.fonts.code,
    fontSize: 13,  // Slightly smaller like ChatGPT
    padding: 12,  // More consistent padding
    borderRadius: 28,  // Rounder corners like ChatGPT
    borderWidth: 1,
    borderColor: '#1a2433',  // Barely lighter than background for subtle border
    marginVertical: 0,  // No extra spacing - CodeBlock handles its own margins
  },
  blockquote: {
    borderLeftColor: darkTheme.colors.blockquote,
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginVertical: darkTheme.spacing.paragraph,
    fontStyle: 'italic' as const,
  },
  list_item: {
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.list,
  },
  bullet_list: {
    marginVertical: darkTheme.spacing.paragraph,
  },
  ordered_list: {
    marginVertical: darkTheme.spacing.paragraph,
  },
  hr: {
    backgroundColor: darkTheme.colors.border,
    height: 1,
    marginVertical: darkTheme.spacing.heading,
  },
  table: {
    borderColor: darkTheme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: darkTheme.spacing.paragraph,
  },
  th: {
    backgroundColor: darkTheme.colors.codeBackground,
    color: darkTheme.colors.text,
    fontWeight: 'bold' as const,
    padding: 8,
    borderColor: darkTheme.colors.border,
    borderWidth: 1,
  },
  td: {
    color: darkTheme.colors.text,
    padding: 8,
    borderColor: darkTheme.colors.border,
    borderWidth: 1,
  },
};
