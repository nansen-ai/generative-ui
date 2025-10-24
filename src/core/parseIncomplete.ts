/**
 * Incomplete Markdown Parser
 * 
 * Handles incomplete markdown gracefully during streaming.
 * Inspired by Streamdown's approach but adapted for React Native.
 */

import { IncompletePatterns } from './types';

/**
 * Patterns for detecting incomplete markdown blocks
 */
const INCOMPLETE_PATTERNS: IncompletePatterns = {
  // Bold: **text without closing ** (match only if text doesn't already end with **)
  unClosedBold: /\*\*([^*]+(?:\*[^*])*[^*])$/,
  
  // Italic: *text without closing *
  unClosedItalic: /(?<!\*)\*([^*]+)$/,
  
  // Inline code: `code without closing `
  unClosedCode: /`([^`]+)$/,
  
  // Code block: ```language\ncode without closing ```
  unClosedCodeBlock: /```(\w+)?\n([\s\S]+)$/,
  
  // Link: [text](url without closing )
  unClosedLink: /\[([^\]]+)\]\(([^)]+)$/,
  
  // List item: - item without proper spacing
  unClosedList: /^(\s*[-*+]\s+.*)$/m,
  
  // Heading: # heading without proper spacing
  unClosedHeading: /^(#{1,6}\s+.*)$/m,
};

/**
 * Fix incomplete markdown by completing partial syntax
 */
export function fixIncompleteMarkdown(text: string): string {
  if (!text || text.length === 0) {
    return text;
  }

  let processedText = text;

  // Fix incomplete bold text - but only if it's truly incomplete
  // Check if the text has unmatched ** at the beginning
  processedText = fixIncompleteBold(processedText);

  // Fix incomplete italic text
  processedText = processedText.replace(
    INCOMPLETE_PATTERNS.unClosedItalic,
    '*$1*'
  );

  // Fix incomplete inline code
  processedText = processedText.replace(
    INCOMPLETE_PATTERNS.unClosedCode,
    '`$1`'
  );

  // Fix incomplete code blocks
  processedText = processedText.replace(
    INCOMPLETE_PATTERNS.unClosedCodeBlock,
    '```$1\n$2\n```'
  );

  // Fix incomplete links
  processedText = processedText.replace(
    INCOMPLETE_PATTERNS.unClosedLink,
    '[$1]($2)'
  );

  // Handle incomplete lists - ensure proper line breaks
  processedText = fixIncompleteList(processedText);

  // Handle incomplete headings - ensure proper line breaks
  processedText = fixIncompleteHeadings(processedText);

  return processedText;
}

/**
 * Fix incomplete bold text by checking for truly unmatched ** pairs
 */
function fixIncompleteBold(text: string): string {
  // Find all ** occurrences
  const boldMarkers = [];
  let index = 0;
  while ((index = text.indexOf('**', index)) !== -1) {
    boldMarkers.push(index);
    index += 2;
  }
  
  // If we have an odd number of **, the last one is unclosed
  if (boldMarkers.length % 2 === 1) {
    // Get the position of the last unclosed **
    const lastMarkerPos = boldMarkers[boldMarkers.length - 1];
    const textAfterLastMarker = text.substring(lastMarkerPos + 2);
    
    // Only fix if there's actual content after the last **
    if (textAfterLastMarker.trim().length > 0) {
      return text + '**';
    }
  }
  
  return text;
}

/**
 * Fix incomplete list formatting
 */
function fixIncompleteList(text: string): string {
  const lines = text.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if this is a list item
    const listMatch = line.match(/^(\s*)([-*+])(\s+)(.+)$/);
    
    if (listMatch) {
      processedLines.push(line);
      
      // If next line exists and is not a list item or empty, add spacing
      if (nextLine !== undefined && 
          !nextLine.match(/^(\s*)([-*+])(\s+)/) && 
          nextLine.trim() !== '') {
        // Add an empty line after the list if the next line is not part of the list
        if (i === lines.length - 1 || !nextLine.match(/^(\s*)([-*+])(\s+)/)) {
          processedLines.push('');
        }
      }
    } else {
      processedLines.push(line);
    }
  }

  return processedLines.join('\n');
}

/**
 * Fix incomplete heading formatting
 */
function fixIncompleteHeadings(text: string): string {
  const lines = text.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if this is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      processedLines.push(line);
      
      // Ensure proper spacing after headings
      if (nextLine !== undefined && nextLine.trim() !== '') {
        processedLines.push('');
      }
    } else {
      processedLines.push(line);
    }
  }

  return processedLines.join('\n');
}

/**
 * Check if markdown appears to be incomplete (still streaming)
 */
export function isMarkdownIncomplete(text: string): boolean {
  if (!text || text.length === 0) {
    return false;
  }

  // Check for common incomplete patterns
  const patterns = [
    INCOMPLETE_PATTERNS.unClosedBold,
    INCOMPLETE_PATTERNS.unClosedItalic,
    INCOMPLETE_PATTERNS.unClosedCode,
    INCOMPLETE_PATTERNS.unClosedCodeBlock,
    INCOMPLETE_PATTERNS.unClosedLink,
  ];

  return patterns.some(pattern => pattern.test(text));
}

/**
 * Sanitize markdown for safe rendering
 */
export function sanitizeMarkdown(text: string): string {
  // Remove potentially dangerous HTML tags while preserving markdown
  const dangerousTags = /<(script|iframe|object|embed|form|input)[^>]*>.*?<\/\1>/gi;
  return text.replace(dangerousTags, '');
}

/**
 * Optimize markdown for performance during rapid updates
 */
export function optimizeForStreaming(text: string): string {
  // For very long texts, we might want to limit processing to recent changes
  const MAX_PROCESSING_LENGTH = 10000;
  
  if (text.length > MAX_PROCESSING_LENGTH) {
    // Process only the last portion that's likely to contain incomplete markdown
    const recentText = text.slice(-MAX_PROCESSING_LENGTH);
    const beforeText = text.slice(0, -MAX_PROCESSING_LENGTH);
    
    return beforeText + fixIncompleteMarkdown(recentText);
  }
  
  return fixIncompleteMarkdown(text);
}
