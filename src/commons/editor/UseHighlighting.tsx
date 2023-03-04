import { Ace, Range as AceRange } from 'ace-builds';
import * as React from 'react';

import { EditorHook } from './Editor';

const useHighlighting: EditorHook = (inProps, outProps, keyBindings, reactAceRef) => {
  const propsRef = React.useRef(inProps);
  propsRef.current = inProps;
  const markerIdsRef = React.useRef<Array<number>>([]);

  const handleVariableHighlighting = React.useCallback(() => {
    // using Ace Editor's way of highlighting as seen here: https://github.com/ajaxorg/ace/blob/master/lib/ace/editor.js#L497
    // We use async blocks so we don't block the browser during editing

    setTimeout(() => {
      if (!reactAceRef.current) {
        return;
      }
      const editor = reactAceRef.current.editor;
      const session: Ace.EditSession = editor.session;
      if (!session || !(session as any).bgTokenizer) {
        return;
      }
      markerIdsRef.current.forEach(id => {
        session.removeMarker(id);
      });
      const ranges: Ace.Range[] = [];

      const markerType = 'ace_variable_highlighting';
      markerIdsRef.current = ranges.map(range => {
        // returns the marker ID for removal later
        return session.addMarker(range, markerType, 'text');
      });
    }, 10);
  }, [reactAceRef]);

  const handleHighlightScope = React.useCallback(() => {
    if (!reactAceRef.current) {
      return;
    }
    const editor = reactAceRef.current.editor;

    const ranges: Ace.Range[] = [];

    if (ranges.length !== 0) {
      ranges.forEach(range => {
        // Highlight the scope ranges
        markerIdsRef.current.push(
          editor.session.addMarker(
            new AceRange(
              range.start.row - 1,
              range.start.column,
              range.end.row - 1,
              range.end.column
            ),
            'ace_selection',
            'text'
          )
        );
      });
    }
  }, [reactAceRef]);

  const { onChange: prevOnChange, onCursorChange: prevOnCursorChange } = outProps;
  outProps.onChange = React.useCallback(
    (v, e) => {
      handleVariableHighlighting();
      prevOnChange && prevOnChange(v, e);
    },
    [handleVariableHighlighting, prevOnChange]
  );
  outProps.onCursorChange = React.useCallback(
    (v, e) => {
      handleVariableHighlighting();
      prevOnCursorChange && prevOnCursorChange(v, e);
    },
    [handleVariableHighlighting, prevOnCursorChange]
  );
  keyBindings.highlightScope = handleHighlightScope;
};

export default useHighlighting;
