import { ComponentType } from 'react';
import { ViewStyle } from 'react-native';

/**
 * Component registry interface - matches existing registry structure
 */
export interface ComponentRegistry {
  get(name: string): ComponentDefinition | undefined;
  validate(name: string, props: any): ValidationResult;
  has(name: string): boolean;
}

/**
 * Component definition structure - matches existing registry
 */
export interface ComponentDefinition {
  name: string;
  component: ComponentType<any>;
  category: 'dynamic';
  description?: string;
  propsSchema: JSONSchema;
  examples?: any[];
}

/**
 * JSON Schema for prop validation - matches existing registry
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  items?: JSONSchema;
  [key: string]: any;
}

/**
 * Validation result - matches existing registry
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  colors: {
    text: string;
    background: string;
    border: string;
    link: string;
    code: string;
    codeBackground: string;
    blockquote: string;
    strong: string;
    emphasis: string;
  };
  fonts: {
    body: string;
    code: string;
    heading: string;
  };
  spacing: {
    paragraph: number;
    heading: number;
    list: number;
    code: number;
  };
}

/**
 * Component error for error handling
 */
export interface ComponentError {
  componentName: string;
  error: Error;
  props?: any;
}

/**
 * Parsed component instance
 */
export interface ComponentInstance {
  id: string;
  name: string;
  component: ComponentType<any>;
  props: any;
  originalText: string;
}

/**
 * Markdown processing result
 */
export interface ProcessedMarkdown {
  markdown: string;
  components: ComponentInstance[];
}

/**
 * StreamdownRN component props
 */
export interface StreamdownRNProps {
  /** The streaming markdown content */
  children: string;
  /** Optional component registry for dynamic components */
  componentRegistry?: ComponentRegistry;
  /** Theme configuration */
  theme?: 'light' | 'dark' | ThemeConfig;
  /** Error handler for component failures */
  onComponentError?: (error: ComponentError) => void;
  /** Additional styling */
  style?: ViewStyle;
}

/**
 * Incomplete markdown patterns that need special handling
 */
export interface IncompletePatterns {
  unClosedBold: RegExp;
  unClosedItalic: RegExp;
  unClosedCode: RegExp;
  unClosedCodeBlock: RegExp;
  unClosedLink: RegExp;
  unClosedList: RegExp;
  unClosedHeading: RegExp;
}
