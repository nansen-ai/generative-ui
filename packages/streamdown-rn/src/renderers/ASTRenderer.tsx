/**
 * AST Renderer
 * 
 * THE single source of truth for rendering MDAST nodes to React Native.
 * Handles all GitHub Flavored Markdown via remark-gfm.
 * 
 * Includes:
 * - All block-level nodes (paragraph, heading, code, blockquote, list, table, hr, image)
 * - All inline nodes (text, strong, emphasis, delete, code, link, break)
 * - Custom component injection via [{c:"Name",p:{...}}] syntax
 * - Syntax highlighting for code blocks
 */

import type { Code as CodeNode, Content, Image as ImageNode, Link as LinkNode, List as ListNode, Parent, Table as TableNode } from 'mdast';
import React, { ReactNode, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TextProps, View } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { UITextView } from 'react-native-uitextview';
import { extractComponentData, type ComponentData } from '../core/componentParser';
import { sanitizeURL } from '../core/sanitize';
import type { ComponentRegistry, StableBlock, ThemeConfig } from '../core/types';
import { getBlockStyles, getTextStyles } from '../themes';

// ============================================================================
// Selectable Text Component
// ============================================================================

/**
 * Check if an AST node contains any link children (recursively)
 */
function nodeContainsLinks(node: Content): boolean {
  if (!node) return false;
  if (node.type === 'link') return true;
  if ('children' in node && node.children) {
    return node.children.some(child => nodeContainsLinks(child as Content));
  }
  return false;
}

/**
 * SelectableText - A smart Text component that uses UITextView on iOS for proper
 * partial text selection, and falls back to regular Text on other platforms.
 *
 * Note: UITextView doesn't support nested React Native components well,
 * so we use regular Text when the content contains links or for inline elements.
 */
const SelectableText: React.FC<TextProps & {
  selectable?: boolean;
  hasLinks?: boolean;
  inline?: boolean;
  children?: React.ReactNode;
}> = ({ selectable = false, children, onPress, hasLinks = false, inline = false, ...props }) => {
  // Inline elements are nested inside parent Text - must use Text (UITextView can't nest)
  // Also use Text when content has links or onPress (UITextView doesn't support these)
  if (inline || hasLinks || onPress) {
    return <Text {...props} selectable={selectable} onPress={onPress}>{children}</Text>;
  }
  // On iOS with selectable=true, use UITextView for proper partial text selection
  if (Platform.OS === 'ios' && selectable) {
    return (
      <UITextView {...props} selectable uiTextView>
        {children}
      </UITextView>
    );
  }
  // On Android or when not selectable, use regular Text
  return <Text {...props} selectable={selectable}>{children}</Text>;
};

// ============================================================================
// Syntax Highlighting Utilities
// ============================================================================

/**
 * Map common language aliases to Prism language names
 */
function normalizeLanguage(lang: string): string {
  const aliases: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'tsx': 'tsx',
    'jsx': 'jsx',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'shell': 'bash',
    'zsh': 'bash',
    'yml': 'yaml',
    'md': 'markdown',
    'json5': 'json',
    'dockerfile': 'docker',
  };
  return aliases[lang.toLowerCase()] || lang.toLowerCase();
}

/**
 * Create Prism syntax style from theme colors
 */
function createSyntaxStyle(theme: ThemeConfig) {
  return {
    'pre[class*="language-"]': {
      color: theme.colors.syntaxDefault,
      background: 'transparent',
    },
    'token': { color: theme.colors.syntaxDefault },
    'keyword': { color: theme.colors.syntaxKeyword },
    'builtin': { color: theme.colors.syntaxOperator },
    'class-name': { color: theme.colors.syntaxClass },
    'function': { color: theme.colors.syntaxFunction },
    'string': { color: theme.colors.syntaxString },
    'number': { color: theme.colors.syntaxNumber },
    'operator': { color: theme.colors.syntaxOperator },
    'comment': { color: theme.colors.syntaxComment },
    'punctuation': { color: theme.colors.syntaxDefault },
    'property': { color: theme.colors.syntaxClass },
    'constant': { color: theme.colors.syntaxNumber },
    'boolean': { color: theme.colors.syntaxNumber },
    'tag': { color: theme.colors.syntaxKeyword },
    'attr-name': { color: theme.colors.syntaxString },
    'attr-value': { color: theme.colors.syntaxString },
    'selector': { color: theme.colors.syntaxClass },
    'regex': { color: theme.colors.syntaxString },
  };
}

// ============================================================================
// Component Extraction (re-export for backwards compatibility)
// ============================================================================

export { extractComponentData, type ComponentData };

// ============================================================================
// Main Component
// ============================================================================

export interface ASTRendererProps {
  /** MDAST node to render */
  node: Content;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Component registry for custom components */
  componentRegistry?: ComponentRegistry;
  /** Whether this is streaming (for components) */
  isStreaming?: boolean;
  /** Enable text selection for copy/paste */
  selectable?: boolean;
  /** Callback for when a link is pressed */
  onLinkPress?: (url: string) => void;
}

/**
 * Main AST Renderer Component
 * 
 * Renders a single MDAST node and its children recursively.
 */
export const ASTRenderer: React.FC<ASTRendererProps> = ({
  node,
  theme,
  componentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress,
}) => {
  return <>{renderNode(node, theme, componentRegistry, isStreaming, selectable, onLinkPress)}</>;
};

// ============================================================================
// Node Rendering
// ============================================================================

/**
 * Render a single MDAST node
 * @param textColorOverride - Optional color to override text color (used in tables)
 */
function renderNode(
  node: Content,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number,
  textColorOverride?: string
): ReactNode {
  const styles = getTextStyles(theme);
  const blockStyles = getBlockStyles(theme);
  const hasLinks = nodeContainsLinks(node);
  
  // Helper to apply color override to a style
  const withColorOverride = (style: object) => 
    textColorOverride ? [style, { color: textColorOverride }] : style;
  
  switch (node.type) {
    // ========================================================================
    // Block-level nodes
    // ========================================================================
    
    case 'paragraph':
      return (
        <SelectableText key={key} style={styles.paragraph} selectable={selectable} hasLinks={hasLinks}>
          {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
        </SelectableText>
      );
    
    case 'heading':
      const headingStyle = styles[`heading${node.depth}` as keyof typeof styles];
      return (
        <SelectableText key={key} style={headingStyle} selectable={selectable} hasLinks={hasLinks}>
          {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
        </SelectableText>
      );
    
    case 'code':
      return renderCodeBlock(node as CodeNode, theme, selectable, key);
    
    case 'blockquote':
      return renderBlockquote(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, key);
    
    case 'list':
      return renderList(node as ListNode, theme, componentRegistry, isStreaming, selectable, onLinkPress, key);
    
    case 'listItem':
      return (
        <View key={key} style={{ flexDirection: 'row', marginBottom: 4 }}>
          <SelectableText style={styles.body} selectable={selectable}>• </SelectableText>
          <View style={{ flex: 1 }}>
            {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
          </View>
        </View>
      );
    
    case 'thematicBreak':
      return (
        <View key={key} style={blockStyles.horizontalRule} />
      );
    
    case 'table':
      return renderTable(node as TableNode, theme, componentRegistry, isStreaming, selectable, onLinkPress, key);
    
    case 'html':
      // Render HTML as plain text (React Native doesn't support HTML)
      return (
        <SelectableText key={key} style={[styles.code, { color: theme.colors.muted }]} selectable={selectable}>
          {node.value}
        </SelectableText>
      );
    
    // ========================================================================
    // Inline (phrasing) nodes
    // ========================================================================
    
    case 'text':
      // Check if text contains inline component syntax
      if (node.value.includes('[{c:')) {
        return renderTextWithComponents(node.value, theme, componentRegistry, isStreaming, selectable, onLinkPress, key);
      }
      return node.value;
    
    case 'strong':
      return (
        <SelectableText key={key} style={withColorOverride(styles.bold)} selectable={selectable} inline>
          {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, textColorOverride)}
        </SelectableText>
      );

    case 'emphasis':
      return (
        <SelectableText key={key} style={withColorOverride(styles.italic)} selectable={selectable} inline>
          {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, textColorOverride)}
        </SelectableText>
      );

    case 'delete':
      // GFM strikethrough
      return (
        <SelectableText key={key} style={withColorOverride(styles.strikethrough)} selectable={selectable} inline>
          {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, textColorOverride)}
        </SelectableText>
      );

    case 'inlineCode':
      return (
        <SelectableText key={key} style={withColorOverride(styles.code)} selectable={selectable} inline>
          {node.value}
        </SelectableText>
      );
    
    case 'link': {
      // Sanitize URL to prevent XSS via javascript: or data: protocols
      const linkNode = node as LinkNode;
      const safeUrl = sanitizeURL(linkNode.url);
      // Get link text directly from children
      const linkText = node.children?.map(child => 
        child.type === 'text' ? child.value : ''
      ).join('') || '';
      
      // If URL is dangerous, render as plain text
      if (!safeUrl) {
        return linkText;
      }
      
      // Always use regular Text for links (UITextView doesn't support onPress)
      return (
        <Text
          key={key}
          style={styles.link}
          accessibilityRole="link"
          onPress={onLinkPress ? () => onLinkPress(safeUrl) : undefined}
        >
          {linkText}
        </Text>
      );
    }
    
    case 'image':
      return renderImage(node as ImageNode, theme, selectable, key);
    
    case 'break':
      return '\n';
    
    // ========================================================================
    // GFM-specific nodes (handled above or ignored)
    // ========================================================================
    
    case 'tableRow':
    case 'tableCell':
      // Handled by renderTable
      return null;
    
    case 'footnoteReference':
      return (
        <SelectableText key={key} style={{ fontSize: 12 }} selectable={selectable} inline>
          [{node.identifier}]
        </SelectableText>
      );
    
    case 'footnoteDefinition':
      return null; // Footnotes rendered separately
    
    // ========================================================================
    // Fallback
    // ========================================================================
    
    default:
      console.warn('Unhandled MDAST node type:', (node as Content).type);
      return null;
  }
}

/**
 * Render children of a parent node
 */
function renderChildren(
  node: Parent,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  textColorOverride?: string
): ReactNode {
  if (!('children' in node) || !node.children) {
    return null;
  }
  
  return node.children.map((child, index) =>
    renderNode(child as Content, theme, componentRegistry, isStreaming, selectable, onLinkPress, index, textColorOverride)
  );
}

// ============================================================================
// Specialized Renderers
// ============================================================================

/**
 * Render a code block with syntax highlighting
 */
function renderCodeBlock(
  node: CodeNode,
  theme: ThemeConfig,
  selectable: boolean,
  key?: string | number
): ReactNode {
  const blockStyles = getBlockStyles(theme);
  const code = node.value.replace(/\n+$/, ''); // Trim trailing newlines
  const language = node.lang || 'text';
  const normalizedLanguage = normalizeLanguage(language);
  const syntaxStyle = createSyntaxStyle(theme);
  
  return (
    <View key={key} style={blockStyles.codeBlock}>
      {language && language !== 'text' && (
        <SelectableText style={{
          color: theme.colors.muted,
          fontSize: 12,
          marginBottom: 8,
          fontFamily: theme.fonts.mono,
        }} selectable={selectable}>
          {language}
        </SelectableText>
      )}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={syntaxStyle}
          highlighter="prism"
          customStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0,
          }}
          fontSize={14}
          fontFamily={Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            web: 'monospace',
            default: 'monospace',
          })}
          PreTag={View as any}
          CodeTag={Text as any}
        >
          {code}
        </SyntaxHighlighter>
      </ScrollView>
    </View>
  );
}

/**
 * Render a list (ordered or unordered)
 */
function renderList(
  node: ListNode,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number
): ReactNode {
  const styles = getTextStyles(theme);
  const ordered = node.ordered ?? false;
  // Use the list's start property for ordered lists (handles loose lists split by blank lines)
  const startNumber = node.start ?? 1;

  return (
    <View key={key} style={{ marginBottom: theme.spacing.block }}>
      {node.children.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
          <SelectableText style={[styles.body, { width: 24 }]} selectable={selectable}>
            {ordered ? `${startNumber + index}.` : '•'}
          </SelectableText>
          <View style={{ flex: 1 }}>
            {item.children.map((child, childIndex) =>
              renderListItemChild(child as Content, theme, componentRegistry, isStreaming, selectable, onLinkPress, childIndex)
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Render a child node inside a list item.
 * Strips paragraph margins to prevent double-spacing in lists.
 */
function renderListItemChild(
  node: Content,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number
): ReactNode {
  const styles = getTextStyles(theme);
  const hasLinks = nodeContainsLinks(node);
  
  // For paragraphs inside list items, render without margin
  if (node.type === 'paragraph') {
    return (
      <SelectableText key={key} style={[styles.body, { marginBottom: 0 }]} selectable={selectable} hasLinks={hasLinks}>
        {renderChildren(node, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
      </SelectableText>
    );
  }
  
  // For nested lists, render with reduced margin
  if (node.type === 'list') {
    return (
      <View key={key} style={{ marginTop: 4, marginBottom: 0 }}>
        {renderList(node as ListNode, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
      </View>
    );
  }
  
  // For other types, use normal rendering
  return renderNode(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, key);
}

/**
 * Render a blockquote.
 * Strips paragraph margins to prevent extra spacing at the end.
 */
function renderBlockquote(
  node: { children?: Content[] },
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number
): ReactNode {
  const styles = getTextStyles(theme);
  const blockStyles = getBlockStyles(theme);
  
  return (
    <View key={key} style={blockStyles.blockquote}>
      {node.children?.map((child, index) => {
        // For paragraphs inside blockquotes, render without bottom margin
        if (child.type === 'paragraph') {
          const hasLinks = nodeContainsLinks(child);
          return (
            <SelectableText key={index} style={[styles.body, { marginBottom: 0 }]} selectable={selectable} hasLinks={hasLinks}>
              {renderChildren(child, theme, componentRegistry, isStreaming, selectable, onLinkPress)}
            </SelectableText>
          );
        }
        // For other types, use normal rendering
        return renderNode(child, theme, componentRegistry, isStreaming, selectable, onLinkPress, index);
      })}
    </View>
  );
}

/**
 * Render a table with horizontal scrolling support
 */
function renderTable(
  node: TableNode,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number
): ReactNode {
  const styles = getTextStyles(theme);
  const blockStyles = getBlockStyles(theme);
  const rows = node.children;
  
  if (rows.length === 0) return null;
  
  const headerRow = rows[0];
  const bodyRows = rows.slice(1);
  const columnCount = headerRow.children.length;
  
  // Extract text colors for passing to nested renderNode calls
  const headerTextColor = blockStyles.tableHeaderText.color;
  const cellTextColor = blockStyles.tableCellText.color;
  
  return (
    <ScrollView 
      key={key} 
      horizontal 
      showsHorizontalScrollIndicator={true} 
      style={blockStyles.table}
    >
      <View>
        {/* Header */}
        <View style={blockStyles.tableHeader}>
          {headerRow.children.map((cell, cellIndex) => {
            const cellHasLinks = nodeContainsLinks(cell as unknown as Content);
            const isLastColumn = cellIndex === columnCount - 1;
            return (
              <View key={cellIndex} style={[
                blockStyles.tableCell,
                !isLastColumn && blockStyles.tableCellSeparator,
              ]}>
                <View style={blockStyles.tableCellContent}>
                  <SelectableText style={[styles.bold, { fontSize: 14 }, blockStyles.tableHeaderText]} selectable={selectable} hasLinks={cellHasLinks}>
                    {cell.children.map((child, childIndex) =>
                      renderNode(child as Content, theme, componentRegistry, isStreaming, selectable, onLinkPress, childIndex, headerTextColor)
                    )}
                  </SelectableText>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Body */}
        {bodyRows.map((row, rowIndex) => (
          <View key={rowIndex} style={blockStyles.tableRow}>
            {row.children.map((cell, cellIndex) => {
              const cellHasLinks = nodeContainsLinks(cell as unknown as Content);
              const isLastColumn = cellIndex === columnCount - 1;
              return (
                <View key={cellIndex} style={[
                  blockStyles.tableCell,
                  !isLastColumn && blockStyles.tableCellSeparator,
                ]}>
                  <View style={blockStyles.tableCellContent}>
                    <SelectableText style={[styles.body, blockStyles.tableCellText]} selectable={selectable} hasLinks={cellHasLinks}>
                      {cell.children.map((child, childIndex) =>
                        renderNode(child as Content, theme, componentRegistry, isStreaming, selectable, onLinkPress, childIndex, cellTextColor)
                      )}
                    </SelectableText>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/**
 * Auto-sized image component that fetches dimensions and renders with correct aspect ratio
 */
function AutoSizedImage({
  uri,
  alt,
  theme,
}: {
  uri: string;
  alt?: string;
  theme: ThemeConfig;
}) {
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9); // Default fallback
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    Image.getSize(
      uri,
      (width, height) => {
        if (mounted && width && height) {
          setAspectRatio(width / height);
          setLoaded(true);
        }
      },
      () => {
        // On error, keep default aspect ratio
        if (mounted) {
          setLoaded(true);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [uri]);

  return (
    <Image
      source={{ uri }}
      style={{
        width: '100%',
        aspectRatio,
        borderRadius: 8,
        backgroundColor: theme.colors.codeBackground,
        opacity: loaded ? 1 : 0.5,
      }}
      resizeMode="cover"
      accessibilityLabel={alt || 'Image'}
    />
  );
}

/**
 * Render an image
 * URL is sanitized to prevent XSS via javascript: or data: protocols
 */
function renderImage(
  node: ImageNode,
  theme: ThemeConfig,
  selectable: boolean,
  key?: string | number
): ReactNode {
  const styles = getTextStyles(theme);

  if (!node.url) {
    return null;
  }

  // Sanitize URL to prevent XSS
  const safeUrl = sanitizeURL(node.url);
  if (!safeUrl) {
    // Dangerous URL - render alt text only as a fallback
    if (node.alt) {
      return (
        <View key={key} style={{ marginVertical: theme.spacing.block }}>
          <SelectableText style={[styles.body, { color: theme.colors.muted, textAlign: 'center' }]} selectable={selectable}>
            [Image: {node.alt}]
          </SelectableText>
        </View>
      );
    }
    return null;
  }

  return (
    <View key={key} style={{ marginVertical: theme.spacing.block }}>
      <AutoSizedImage uri={safeUrl} alt={node.alt ?? undefined} theme={theme} />
    </View>
  );
}

/**
 * Render text that may contain inline component syntax
 */
function renderTextWithComponents(
  text: string,
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void,
  key?: string | number
): ReactNode {
  // Look for inline components
  const componentMatch = text.match(/\[\{c:\s*"([^"]+)"\s*,\s*p:\s*(\{[\s\S]*?\})\s*\}\]/);
  
  if (!componentMatch) {
    return text;
  }
  
  const before = text.slice(0, componentMatch.index);
  const after = text.slice(componentMatch.index! + componentMatch[0].length);
  
  const { name, props } = extractComponentData(componentMatch[0]);
  
  if (!componentRegistry) {
    return (
      <>
        {before}
        <SelectableText style={{ color: theme.colors.muted }} selectable={selectable}>⚠️ [{name}]</SelectableText>
        {after}
      </>
    );
  }
  
  const componentDef = componentRegistry.get(name);
  if (!componentDef) {
    return (
      <>
        {before}
        <SelectableText style={{ color: theme.colors.muted }} selectable={selectable}>⚠️ [{name}]</SelectableText>
        {after}
      </>
    );
  }
  
  const Component = componentDef.component;
  
  return (
    <>
      {before}
      <Component key={key} {...props} _isInline={true} _isStreaming={isStreaming} />
      {renderTextWithComponents(after, theme, componentRegistry, isStreaming, selectable, onLinkPress, `${key}-after`)}
    </>
  );
}

// ============================================================================
// Block-level Component Renderer (for StableBlock with type='component')
// ============================================================================

export interface ComponentBlockProps {
  theme: ThemeConfig;
  componentRegistry?: ComponentRegistry;
  /** StableBlock input */
  block?: StableBlock;
  /** Direct component name (when not using block) */
  componentName?: string;
  /** Direct props (when not using block) */
  props?: Record<string, unknown>;
  /** CSS Grid-like style for layout positioning */
  style?: Record<string, unknown>;
  /** Direct children (when not using block) */
  children?: ComponentData[];
  /** Whether streaming (for active blocks) */
  isStreaming?: boolean;
}

/**
 * Render error/fallback states for components.
 */
function renderComponentError(theme: ThemeConfig, message: string): ReactNode {
  return (
    <View style={{
      padding: 12,
      backgroundColor: theme.colors.codeBackground,
      borderRadius: 8,
      marginBottom: theme.spacing.block,
    }}>
      <Text style={{ color: theme.colors.muted }}>{message}</Text>
    </View>
  );
}

/**
 * Render a block-level custom component with skeleton and children support.
 */
export const ComponentBlock: React.FC<ComponentBlockProps> = React.memo(
  ({ 
    theme, 
    componentRegistry, 
    block, 
    componentName: directName, 
    props: directProps,
    style: directStyle,
    children: directChildren,
    isStreaming = false,
  }) => {
    // Extract component data from block or direct props
    let componentName: string;
    let props: Record<string, unknown>;
    let style: Record<string, unknown> | undefined;
    let children: ComponentData[] | undefined;
    
    if (block) {
      const meta = block.meta as { type: 'component'; name: string; props: Record<string, unknown> };
      if (meta.name) {
        componentName = meta.name;
        props = meta.props || {};
      } else {
        const extracted = extractComponentData(block.content);
        componentName = extracted.name;
        props = extracted.props;
        style = extracted.style;
        children = extracted.children;
      }
    } else {
      componentName = directName ?? '';
      props = directProps ?? {};
      style = directStyle;
      children = directChildren;
    }
    
    // No component name yet (still streaming) - render nothing
    // The component will appear once we have enough to show its skeleton
    if (!componentName) {
      return null;
    }
    
    // No registry provided
    if (!componentRegistry) {
      return renderComponentError(theme, '⚠️ No component registry provided');
    }
    
    // Component not found
    const componentDef = componentRegistry.get(componentName);
    if (!componentDef) {
      return renderComponentError(theme, `⚠️ Unknown component: ${componentName}`);
    }
    
    // Render children recursively if present, passing style for layout
    const renderedChildren = children?.length ? (
      children.map((child, index) => (
        <ComponentBlock
          key={index}
          theme={theme}
          componentRegistry={componentRegistry}
          componentName={child.name}
          props={child.props}
          style={child.style}
          children={child.children}
          isStreaming={isStreaming}
        />
      ))
    ) : undefined;
    
    // Merge props.style (component config) with layout style (positioning)
    // props.style = component-specific config (e.g., Canvas gridTemplateColumns)
    // style = layout positioning in parent (e.g., gridColumn: "span 2")
    const mergedStyle = { ...(props.style as object), ...style };
    
    // When streaming, prefer skeleton component if available
    if (isStreaming && componentDef.skeletonComponent) {
      const SkeletonComponent = componentDef.skeletonComponent;
      return (
        <View style={{ marginBottom: theme.spacing.block }}>
          <SkeletonComponent {...props} style={mergedStyle} _isStreaming={true}>
            {renderedChildren}
          </SkeletonComponent>
        </View>
      );
    }
    
    // Render the main component
    const Component = componentDef.component;
    return (
      <View style={{ marginBottom: theme.spacing.block }}>
        <Component {...props} style={mergedStyle} _isStreaming={isStreaming}>
          {renderedChildren}
        </Component>
      </View>
    );
  },
  (prev, next) => {
    if (prev.block && next.block) {
      return prev.block.contentHash === next.block.contentHash;
    }
    return (
      prev.componentName === next.componentName &&
      prev.isStreaming === next.isStreaming &&
      JSON.stringify(prev.props) === JSON.stringify(next.props) &&
      JSON.stringify(prev.children) === JSON.stringify(next.children)
    );
  }
);

ComponentBlock.displayName = 'ComponentBlock';

// ============================================================================
// Exports
// ============================================================================

/**
 * Render a complete MDAST tree (for testing)
 */
export function renderAST(
  nodes: Content[],
  theme: ThemeConfig,
  componentRegistry?: ComponentRegistry,
  isStreaming = false,
  selectable = false,
  onLinkPress?: (url: string) => void
): ReactNode {
  return nodes.map((node, index) => renderNode(node, theme, componentRegistry, isStreaming, selectable, onLinkPress, index));
}
