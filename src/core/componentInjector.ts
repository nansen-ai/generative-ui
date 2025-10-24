/**
 * Component Injector
 * 
 * Parses and injects dynamic components from markdown using the existing registry pattern.
 * Supports the {{component: "Name", props: {...}}} syntax.
 */

import { ComponentRegistry, ComponentInstance, ProcessedMarkdown, ComponentError } from './types';

/**
 * Extract balanced JSON from a string starting at a given position
 * Handles nested braces properly
 */
function extractBalancedJSON(str: string, startIndex: number): { json: string; endIndex: number } | null {
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let jsonStart = -1;

  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      if (braceCount === 0) jsonStart = i;
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && jsonStart !== -1) {
        return {
          json: str.substring(jsonStart, i + 1),
          endIndex: i + 1
        };
      }
    }
  }

  return null;
}

/**
 * Extract and process components from markdown
 */
export function extractComponents(
  markdown: string,
  registry?: ComponentRegistry,
  onError?: (error: ComponentError) => void
): ProcessedMarkdown {
  if (!registry) {
    return { markdown, components: [] };
  }

  const components: ComponentInstance[] = [];
  let processedMarkdown = markdown;

  // Pattern to find component start: {{component: "Name", props: 
  const componentStartPattern = /\{\{component:\s*"([^"]+)",\s*props:\s*/g;
  
  let match;
  while ((match = componentStartPattern.exec(markdown)) !== null) {
    const componentName = match[1];
    const propsStartIndex = match.index + match[0].length;
    
    // Extract balanced JSON for props
    const jsonResult = extractBalancedJSON(markdown, propsStartIndex);
    if (!jsonResult) {
      console.warn(`Failed to extract props JSON for component '${componentName}'`);
      continue;
    }

    // Check for closing }}
    const afterPropsIndex = jsonResult.endIndex;
    if (markdown.substring(afterPropsIndex, afterPropsIndex + 2) !== '}}') {
      console.warn(`Missing closing }} for component '${componentName}'`);
      continue;
    }

    const fullMatch = markdown.substring(match.index, afterPropsIndex + 2);
    const propsJson = jsonResult.json;
    
    try {
      // Get component from registry
      const componentDef = registry.get(componentName);
      if (!componentDef) {
        console.warn(`Component '${componentName}' not found in registry`);
        continue;
      }

      // Parse props
      let props;
      try {
        props = JSON.parse(propsJson);
      } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        const error: ComponentError = {
          componentName,
          error: new Error(`Invalid JSON props: ${errorMessage}`),
          props: propsJson,
        };
        onError?.(error);
        console.warn('Failed to parse component props:', parseError);
        continue;
      }

      // Validate props against schema
      const validation = registry.validate(componentName, props);
      if (!validation.valid) {
        const error: ComponentError = {
          componentName,
          error: new Error(`Props validation failed: ${validation.errors.join(', ')}`),
          props,
        };
        onError?.(error);
        console.warn('Component props validation failed:', validation.errors);
        continue;
      }

      // Create component instance
      const componentId = `component-${components.length}`;
      const componentInstance: ComponentInstance = {
        id: componentId,
        name: componentName,
        component: componentDef.component,
        props,
        originalText: fullMatch,
      };

      components.push(componentInstance);

      // Replace component syntax with placeholder
      processedMarkdown = processedMarkdown.replace(
        fullMatch,
        `\n\n{{COMPONENT_PLACEHOLDER_${componentId}}}\n\n`
      );

    } catch (error) {
      const componentError: ComponentError = {
        componentName,
        error: error instanceof Error ? error : new Error(String(error)),
        props: propsJson,
      };
      onError?.(componentError);
      console.error('Error processing component:', error);
    }
  }

  return {
    markdown: processedMarkdown,
    components,
  };
}

/**
 * Inject component placeholders back into processed markdown
 * This is used by the renderer to know where to place components
 * 
 * We use a special marker that won't conflict with regular text
 * Note: Using inline code backticks to prevent markdown from processing the marker
 */
export function injectComponentPlaceholders(
  markdown: string,
  components: ComponentInstance[]
): string {
  let result = markdown;

  components.forEach((component) => {
    const placeholder = `{{COMPONENT_PLACEHOLDER_${component.id}}}`;
    // Use inline code to prevent markdown processing, but backticks will be stripped
    const componentMarker = `\`__COMPONENT__${component.id}__${component.name}__\``;
    
    // CRITICAL: Remove newlines around placeholders to ensure inline rendering
    // The AI might put component syntax on separate lines, but we want them inline
    const placeholderPatterns = [
      `\n\n${placeholder}\n\n`, // Blank lines before and after
      `\n${placeholder}\n`,     // Single newlines
      `\n\n${placeholder}`,     // Blank lines before only
      `${placeholder}\n\n`,     // Blank lines after only
      `\n${placeholder}`,       // Single newline before
      `${placeholder}\n`,       // Single newline after
      placeholder               // No newlines (fallback)
    ];
    
    let replaced = false;
    for (const pattern of placeholderPatterns) {
      if (result.includes(pattern)) {
        // Replace with marker that has NO surrounding newlines
        result = result.replace(pattern, componentMarker);
        replaced = true;
        console.log(`🔧 Injecting component marker (stripped newlines): ${componentMarker}`);
        break;
      }
    }
    
    if (!replaced) {
      // Fallback: just replace the placeholder directly
      result = result.replace(placeholder, componentMarker);
      console.log(`🔧 Injecting component marker (no newlines found): ${componentMarker}`);
    }
  });
  
  console.log('📄 Final markdown with placeholders:', result.substring(0, 500));
  console.log('📄 Full final markdown:', result);

  return result;
}

/**
 * Extract component placeholders from processed markdown
 * Returns array of component IDs in order of appearance
 */
export function extractComponentOrder(markdown: string): string[] {
  const componentMarkerPattern = /<COMPONENT id="([^"]+)" name="[^"]+" \/>/g;
  const componentIds: string[] = [];
  
  let match;
  while ((match = componentMarkerPattern.exec(markdown)) !== null) {
    componentIds.push(match[1]);
  }
  
  return componentIds;
}

/**
 * Remove component markers from markdown (for text-only rendering)
 */
export function removeComponentMarkers(markdown: string): string {
  return markdown.replace(/<COMPONENT[^>]+\/>/g, '');
}

/**
 * Validate component syntax without processing
 * Useful for debugging and development
 */
export function validateComponentSyntax(markdown: string): {
  valid: boolean;
  errors: string[];
  components: string[];
} {
  const errors: string[] = [];
  const components: string[] = [];
  
  const componentStartPattern = /\{\{component:\s*"([^"]+)",\s*props:\s*/g;
  
  let match;
  while ((match = componentStartPattern.exec(markdown)) !== null) {
    const componentName = match[1];
    components.push(componentName);
    
    const propsStartIndex = match.index + match[0].length;
    const jsonResult = extractBalancedJSON(markdown, propsStartIndex);
    
    if (!jsonResult) {
      errors.push(`Component '${componentName}': Failed to extract props JSON`);
      continue;
    }
    
    // Validate JSON syntax
    try {
      JSON.parse(jsonResult.json);
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      errors.push(`Component '${componentName}': Invalid JSON props - ${errorMessage}`);
    }
    
    // Check for closing }}
    const afterPropsIndex = jsonResult.endIndex;
    if (markdown.substring(afterPropsIndex, afterPropsIndex + 2) !== '}}') {
      errors.push(`Component '${componentName}': Missing closing }}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    components,
  };
}

/**
 * Get component statistics from markdown
 */
export function getComponentStats(markdown: string): {
  totalComponents: number;
  uniqueComponents: string[];
  componentCounts: Record<string, number>;
} {
  const componentCounts: Record<string, number> = {};
  const uniqueComponents: string[] = [];
  let totalComponents = 0;
  
  const componentStartPattern = /\{\{component:\s*"([^"]+)",\s*props:\s*/g;
  
  let match;
  while ((match = componentStartPattern.exec(markdown)) !== null) {
    const componentName = match[1];
    totalComponents++;
    
    if (!componentCounts[componentName]) {
      componentCounts[componentName] = 0;
      uniqueComponents.push(componentName);
    }
    componentCounts[componentName]++;
  }
  
  return {
    totalComponents,
    uniqueComponents,
    componentCounts,
  };
}
