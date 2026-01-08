declare const __DEV__: boolean | undefined;

// Disabled debug logging to reduce console spam
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logDebug = (..._args: unknown[]) => {
  // Intentionally disabled - streamdown-rn logs too verbose for dev
  return;
};

export const logStateSnapshot = (
  label: string,
  registry: import('../types').BlockRegistry
) => {
  logDebug(label, {
    stableBlocks: registry.blocks.map((block) => ({
      id: block.id,
      type: block.type,
      length: block.content.length,
      preview: block.content.slice(0, 40),
    })),
    activeBlock: registry.activeBlock
      ? {
          type: registry.activeBlock.type,
          length: registry.activeBlock.content.length,
          preview: registry.activeBlock.content.slice(0, 60),
        }
      : null,
  });
};

