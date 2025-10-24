/**
 * Simple Markdown Renderer for StreamdownRN
 * 
 * Clean, basic markdown rendering with proper theming
 */

import React from 'react';
import Markdown from 'react-native-markdown-display';

interface MarkdownRendererProps {
  children: string;
  theme?: 'dark' | 'light';
  style?: any;
  rules?: any;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  style,
  rules = {},
}) => {
  return (
    <Markdown
      style={style}
      rules={rules}
    >
      {children}
    </Markdown>
  );
};

export default MarkdownRenderer;