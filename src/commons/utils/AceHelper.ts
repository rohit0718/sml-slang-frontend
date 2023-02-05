import { ModeSelector } from 'calc-slang/dist/editors/ace/modes/source';
import { Chapter, Variant } from 'calc-slang/dist/types';

import { HighlightRulesSelector_native } from '../../features/fullJS/fullJSHighlight';
import { Documentation } from '../documentation/Documentation';
/**
 * This _modifies global state_ and defines a new Ace mode globally, if it does not already exist.
 *
 * You can call this directly in render functions.
 */
export const selectMode = (chapter: Chapter, variant: Variant, library: string) => {
  if (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof ace.define.modules[`ace/mode/${getModeString(chapter, variant, library)}`]?.Mode ===
    'function'
  ) {
    return;
  }

  HighlightRulesSelector_native(
    chapter,
    variant,
    library,
    Documentation.externalLibraries[library]
  );
  ModeSelector(chapter, variant, library);
};

export const getModeString = (chapter: Chapter, variant: Variant, library: string) => {
  return `source${chapter}${variant}${library}`;
};
