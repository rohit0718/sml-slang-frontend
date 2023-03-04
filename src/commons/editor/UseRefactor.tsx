import { Ace, Range } from 'ace-builds';
import * as React from 'react';

import { EditorHook } from './Editor';

// EditorHook structure:
// EditorHooks grant access to 4 things:
// inProps are provided by the parent component
// outProps go into the underlying React-Ace
// keyBindings allow exporting new hotkeys
// reactAceRef is the underlying reactAce instance for hooking.

const useRefactor: EditorHook = (inProps, outProps, keyBindings, reactAceRef) => {
  const refactor = React.useCallback(() => {
    const editor = reactAceRef.current!.editor;
    if (!editor) {
      return;
    }
    const sourceLocations: Ace.Range[] = [];

    const selection = editor.getSelection();
    const ranges = sourceLocations.map(
      loc => new Range(loc.start.row - 1, loc.start.column, loc.end.row - 1, loc.end.column)
    );
    ranges.forEach(range => selection.addRange(range));
  }, [reactAceRef]);

  keyBindings.refactor = refactor;
};

export default useRefactor;
