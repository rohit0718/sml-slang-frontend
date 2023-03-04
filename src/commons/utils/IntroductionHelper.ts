import { Links } from './Constants';

const MAIN_INTRODUCTION = `
Welcome to the SMLSlang playground!

The language [_SMLSlang_](${'https://github.com/sebastiantoh/sml-slang'}) is an adaptation of the language [_SML_](${'https://www.smlnj.org/sml.html/'}). `;

const HOTKEYS_INTRODUCTION = `

In the editor on the left, you can use the [_Ace keyboard shortcuts_](${Links.aceHotkeys}) 
and also the [_Source Academy keyboard shortcuts_](${Links.sourceHotkeys}).

`;

export const generateSourceIntroduction = () => {
  return MAIN_INTRODUCTION + HOTKEYS_INTRODUCTION;
};
