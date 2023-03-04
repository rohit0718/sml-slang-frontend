import { HighlightRulesSelector, ModeSelector } from 'src/commons/editor/ace/mode';
import { Variant } from 'src/sml-integration';

/**
 * This _modifies global state_ and defines a new Ace mode globally, if it does not already exist.
 *
 * You can call this directly in render functions.
 */
export const selectMode = (variant: Variant) => {
  if (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof ace.define.modules[`ace/mode/${getModeString(variant)}`]?.Mode === 'function'
  ) {
    return;
  }

  HighlightRulesSelector(0, variant, undefined, []);
  ModeSelector(0, variant, undefined);
};

export const getModeString = (variant: Variant) => `source${variant}`;
