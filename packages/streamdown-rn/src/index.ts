/**
 * StreamdownRN - Streaming Markdown Renderer for React Native
 * 
 * High-performance streaming markdown renderer optimized for AI responses.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Main Component
// ============================================================================

export { default, StreamdownRN } from './StreamdownRN';

// ============================================================================
// Skeleton Primitives (for building component skeletons)
// ============================================================================

export {
  Skeleton, SkeletonCircle,
  SkeletonNumber, SkeletonRect, SkeletonText, type SkeletonProps,
  type SkeletonTextProps
} from './components';

// ============================================================================
// Security Utilities
// ============================================================================

export {
  sanitizeProps, sanitizeURL
} from './core/sanitize';

// ============================================================================
// Theme Exports
// ============================================================================

export {
  darkTheme, getBlockStyles, getTextStyles, getTheme, lightTheme
} from './themes';

// ============================================================================
// Public Types
// ============================================================================

export type {

  // Component injection (for custom component registries)
  ComponentDefinition,
  ComponentRegistry,
  // Debug/Observability
  DebugSnapshot,
  // Component props
  StreamdownRNProps, ThemeColors,
  // Theme configuration
  ThemeConfig, ThemeFontSizes,
  ThemeTableConfig
} from './core/types';

