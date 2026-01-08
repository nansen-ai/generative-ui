/**
 * Theme Configurations for Streamdown-RN
 * 
 * Dark and light themes with consistent styling.
 * Optimized for readability and streaming performance.
 * 
 * Font-agnostic: Uses platform defaults for text, allowing host apps
 * to set their own fonts. Only monospace is specified for code blocks.
 */

import { Platform } from 'react-native';
import type { ThemeConfig, ThemeColors, ThemeFontSizes } from '../core/types';

// ============================================================================
// Color Palettes
// ============================================================================

const darkColors: ThemeColors = {
  background: '#0d1117',
  foreground: '#c9d1d9',
  muted: '#8b949e',
  accent: '#58a6ff',
  codeBackground: '#161b22',
  codeForeground: '#c9d1d9',
  border: '#30363d',
  link: '#58a6ff',
  // Syntax highlighting (GitHub Dark style)
  syntaxDefault: '#c9d1d9',
  syntaxKeyword: '#ff7b72',
  syntaxString: '#a5d6ff',
  syntaxNumber: '#79c0ff',
  syntaxComment: '#8b949e',
  syntaxFunction: '#d2a8ff',
  syntaxClass: '#ffa657',
  syntaxOperator: '#ff7b72',
};

const lightColors: ThemeColors = {
  background: '#ffffff',
  foreground: '#24292e',
  muted: '#6a737d',
  accent: '#0366d6',
  codeBackground: '#f6f8fa',
  codeForeground: '#24292e',
  border: '#e1e4e8',
  link: '#0366d6',
  // Syntax highlighting (GitHub Light style)
  syntaxDefault: '#24292e',
  syntaxKeyword: '#d73a49',
  syntaxString: '#032f62',
  syntaxNumber: '#005cc5',
  syntaxComment: '#6a737d',
  syntaxFunction: '#6f42c1',
  syntaxClass: '#e36209',
  syntaxOperator: '#d73a49',
};

// ============================================================================
// Default Font Sizes
// ============================================================================

const defaultFontSizes: ThemeFontSizes = {
  body: 16,
  heading1: 28,
  heading2: 24,
  heading3: 20,
  heading4: 18,
  heading5: 16,
  heading6: 14,
  code: 14,
};

// ============================================================================
// Font Configuration
// ============================================================================

// Font-agnostic: undefined lets React Native use platform defaults
// This allows host apps to set fonts at the root level and have them inherited
// Only monospace is specified for code blocks
const fonts = {
  regular: undefined as string | undefined,
  bold: undefined as string | undefined,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
};

// ============================================================================
// Spacing
// ============================================================================

const spacing = {
  block: 12,    // Space between blocks
  inline: 4,    // Inline element spacing
  indent: 16,   // List/blockquote indent
};

// ============================================================================
// Theme Exports
// ============================================================================

export const darkTheme: ThemeConfig = {
  colors: darkColors,
  fonts,
  fontSizes: defaultFontSizes,
  spacing,
};

export const lightTheme: ThemeConfig = {
  colors: lightColors,
  fonts,
  fontSizes: defaultFontSizes,
  spacing,
};

/**
 * Get theme by name or return custom theme
 */
export function getTheme(theme: 'dark' | 'light' | ThemeConfig): ThemeConfig {
  if (typeof theme === 'object') return theme;
  return theme === 'light' ? lightTheme : darkTheme;
}

// ============================================================================
// Style Generators (used by block renderers)
// ============================================================================

/**
 * Generate text styles for a theme
 * 
 * Font-agnostic: Only applies fontFamily when explicitly set in theme.
 * This allows host apps to set fonts at the root level and have them inherited.
 * 
 * Uses theme.fontSizes when provided, falls back to defaults.
 */
export function getTextStyles(theme: ThemeConfig) {
  // Helper to conditionally include fontFamily
  const withFont = (fontKey: 'regular' | 'bold' | 'mono') => 
    theme.fonts[fontKey] ? { fontFamily: theme.fonts[fontKey] } : {};

  // Get font sizes from theme or use defaults
  const sizes = theme.fontSizes ?? defaultFontSizes;

  return {
    body: {
      color: theme.colors.foreground,
      ...withFont('regular'),
      fontSize: sizes.body,
      lineHeight: sizes.body * 1.5,
    },
    heading1: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading1,
      lineHeight: sizes.heading1 * 1.3,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    heading2: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading2,
      lineHeight: sizes.heading2 * 1.3,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    heading3: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading3,
      lineHeight: sizes.heading3 * 1.4,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    heading4: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading4,
      lineHeight: sizes.heading4 * 1.45,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    heading5: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading5,
      lineHeight: sizes.heading5 * 1.5,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    heading6: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontSize: sizes.heading6,
      lineHeight: sizes.heading6 * 1.55,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.block,
    },
    paragraph: {
      color: theme.colors.foreground,
      ...withFont('regular'),
      fontSize: sizes.body,
      lineHeight: sizes.body * 1.5,
      marginBottom: theme.spacing.block,
    },
    bold: {
      color: theme.colors.foreground,
      ...withFont('bold'),
      fontWeight: 'bold' as const,
    },
    italic: {
      color: theme.colors.foreground,
      fontStyle: 'italic' as const,
      // No fontFamily - inherits from parent, allowing platform italic to work
    },
    code: {
      ...withFont('mono'),
      fontSize: sizes.code,
      color: theme.colors.codeForeground,
      backgroundColor: theme.colors.codeBackground,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    link: {
      color: theme.colors.link,
      textDecorationLine: 'underline' as const,
    },
    strikethrough: {
      color: theme.colors.foreground,
      textDecorationLine: 'line-through' as const,
    },
  };
}

/**
 * Generate block container styles for a theme
 */
export function getBlockStyles(theme: ThemeConfig) {
  return {
    codeBlock: {
      backgroundColor: theme.colors.codeBackground,
      borderRadius: 8,
      padding: 12,
      marginBottom: theme.spacing.block,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.muted,
      paddingLeft: theme.spacing.indent,
      marginBottom: theme.spacing.block,
    },
    list: {
      marginBottom: theme.spacing.block,
    },
    listItem: {
      paddingLeft: theme.spacing.indent,
      marginBottom: theme.spacing.inline,
    },
    horizontalRule: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.block,
    },
    table: {
      marginBottom: theme.spacing.block,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      overflow: 'hidden' as const,
    },
    tableHeader: {
      backgroundColor: theme.colors.codeBackground,
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tableCell: {
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
  };
}

