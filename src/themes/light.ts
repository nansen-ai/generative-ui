/**
 * Light Theme Configuration
 * For future light mode support
 */

import { ThemeConfig } from '../core/types';

export const lightTheme: ThemeConfig = {
  colors: {
    text: '#1a1a1a',          // Dark text on light background
    background: '#ffffff',     // White background
    border: '#e5e5e5',         // Light border
    link: '#0066cc',          // Blue links
    code: '#666666',          // Code text color
    codeBackground: '#f5f5f5', // Light code background
    blockquote: '#0066cc',    // Blockquote accent
    strong: '#000000',        // Bold text - pure black
    emphasis: '#4a4a4a',      // Italic text - medium gray
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
 * Light theme styles for react-native-markdown-display
 */
export const lightMarkdownStyles = {
  body: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  heading1: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  heading2: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  heading3: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  heading4: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  heading5: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  heading6: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.heading,
    fontSize: 12,
    fontWeight: 'bold' as const,
    marginTop: lightTheme.spacing.heading,
    marginBottom: lightTheme.spacing.paragraph,
  },
  paragraph: {
    color: lightTheme.colors.text,
    fontFamily: lightTheme.fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: lightTheme.spacing.paragraph,
  },
  strong: {
    color: lightTheme.colors.strong,
    fontWeight: 'bold' as const,
  },
  em: {
    color: lightTheme.colors.emphasis,
    fontStyle: 'italic' as const,
  },
  link: {
    color: lightTheme.colors.link,
    textDecorationLine: 'underline' as const,
  },
  code_inline: {
    color: lightTheme.colors.text,  // Same as regular text
    backgroundColor: 'transparent',  // No background, blend into chat
    fontFamily: lightTheme.fonts.code,
    fontSize: 16,  // Match body text size
    lineHeight: 22,  // Match body line height
    borderWidth: 0,  // No border
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
  },
  code_block: {
    color: lightTheme.colors.code,
    backgroundColor: lightTheme.colors.codeBackground,
    fontFamily: lightTheme.fonts.code,
    fontSize: 13,  // Slightly smaller like ChatGPT
    padding: 12,  // More consistent padding
    borderRadius: 6,  // Slightly tighter radius
    marginVertical: 8,  // Tighter spacing
  },
  fence: {
    color: lightTheme.colors.code,
    backgroundColor: lightTheme.colors.codeBackground,
    fontFamily: lightTheme.fonts.code,
    fontSize: 13,  // Slightly smaller like ChatGPT
    padding: 12,  // More consistent padding
    borderRadius: 28,  // Rounder corners like ChatGPT
    borderWidth: 1,
    borderColor: '#e8e8e8',  // Barely lighter than background for subtle border
    marginVertical: 0,  // No extra spacing - CodeBlock handles its own margins
  },
  blockquote: {
    borderLeftColor: lightTheme.colors.blockquote,
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginVertical: lightTheme.spacing.paragraph,
    fontStyle: 'italic' as const,
  },
  list_item: {
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.list,
  },
  bullet_list: {
    marginVertical: lightTheme.spacing.paragraph,
  },
  ordered_list: {
    marginVertical: lightTheme.spacing.paragraph,
  },
  hr: {
    backgroundColor: lightTheme.colors.border,
    height: 1,
    marginVertical: lightTheme.spacing.heading,
  },
  table: {
    borderColor: lightTheme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: lightTheme.spacing.paragraph,
  },
  th: {
    backgroundColor: lightTheme.colors.codeBackground,
    color: lightTheme.colors.text,
    fontWeight: 'bold' as const,
    padding: 8,
    borderColor: lightTheme.colors.border,
    borderWidth: 1,
  },
  td: {
    color: lightTheme.colors.text,
    padding: 8,
    borderColor: lightTheme.colors.border,
    borderWidth: 1,
  },
};
