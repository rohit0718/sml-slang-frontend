import { Variant } from 'src/sml-integration';

/* tslint:disable */

/**
 * Source Mode for Ace Editor
 * (Modified from javascript mode in default brace package)
 * The link to the original JavaScript mode can be found here:
 * https://github.com/ajaxorg/ace-builds/blob/master/src/mode-javascript.js
 *
 * Changes includes:
 * 1) change code styles so that it passes tslint test
 * 2) refactor some code to ES2015 class syntax
 * 3) Encapsulate the orginal mode and higlightrules in two selectors so as to change according to source chapter
 * 4) changed regex to mark certain operators in pink
 * 5) use SourceDocumentation to include all library functions and constants from source
 * 6) include all external libraries
 */

export function HighlightRulesSelector(
  id: number,
  variant: Variant,
  external: String = 'NONE',
  externalLibraries: (
    | {
        caption: string;
        value: string;
        meta: any;
        docHTML: any;
      }
    | {
        caption: string;
        value: string;
        meta: string;
        docHTML?: undefined;
      }
  )[] = []
) {
  function _SourceHighlightRules(acequire: any, exports: any, _module: any) {
    const oop = acequire('../lib/oop');
    // const DocCommentHighlightRules = acequire('./doc_comment_highlight_rules')
    //   .DocCommentHighlightRules;
    const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;
    // const identifierRegex = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*';

    const SourceHighlightRules = function (this: any, options: any) {
      const keywordControls = 'if|then|else|let|in|end|case|of|val|fun|local|andalso|orelse';

      const storageType = 'int|float|string|char|bool|unit';

      const storageModifiers = 'rec';

      const keywordOperators = '+|+.|-|-.|/|/.|*|*.|mod|==|!=|<=|<|>|>=|=|<>|^';

      const builtinConstants = 'true|false';

      const keywordMapper = (this.$keywords = this.createKeywordMapper(
        {
          'keyword.control': keywordControls,
          'storage.type': storageType,
          'storage.modifiers': storageModifiers,
          'keyword.operator': keywordOperators,
          'variable.language': 'this',
          'constant.language': builtinConstants
        },
        'identifier'
      ));

      const decimalInteger = '(?:(?:[1-9]\\d*)|(?:0))';
      const octInteger = '(?:0[oO]?[0-7]+)';
      const hexInteger = '(?:0[xX][\\dA-Fa-f]+)';
      const binInteger = '(?:0[bB][01]+)';
      const integer =
        '(?:' + decimalInteger + '|' + octInteger + '|' + hexInteger + '|' + binInteger + ')';

      const exponent = '(?:[eE][+-]?\\d+)';
      const fraction = '(?:\\.\\d+)';
      const intPart = '(?:\\d+)';
      const pointFloat = '(?:(?:' + intPart + '?' + fraction + ')|(?:' + intPart + '\\.))';
      const exponentFloat = '(?:(?:' + pointFloat + '|' + intPart + ')' + exponent + ')';
      const floatNumber = '(?:' + exponentFloat + '|' + pointFloat + ')';

      this.$rules = {
        start: [
          {
            token: 'comment',
            regex: '\\(\\*.*?\\*\\)\\s*?$'
          },
          {
            token: 'comment',
            regex: '\\(\\*.*',
            next: 'comment'
          },
          {
            token: 'string', // single line
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
          },
          {
            token: 'string', // single char
            regex: "'.'"
          },
          {
            token: 'string', // " string
            regex: '"',
            next: 'qstring'
          },
          {
            token: 'constant.numeric', // imaginary
            regex: '(?:' + floatNumber + '|\\d+)[jJ]\\b'
          },
          {
            token: 'constant.numeric', // float
            regex: floatNumber
          },
          {
            token: 'constant.numeric', // integer
            regex: integer + '\\b'
          },
          {
            token: keywordMapper,
            regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
          },
          {
            token: 'keyword.operator',
            regex:
              '\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|=|:'
          },
          {
            token: 'paren.lparen',
            regex: '[[({]'
          },
          {
            token: 'paren.rparen',
            regex: '[\\])}]'
          },
          {
            token: 'text',
            regex: '\\s+'
          }
        ],
        comment: [
          {
            token: 'comment', // closing comment
            regex: '\\*\\)',
            next: 'start'
          },
          {
            defaultToken: 'comment'
          }
        ],

        qstring: [
          {
            token: 'string',
            regex: '"',
            next: 'start'
          },
          {
            token: 'string',
            regex: '.+'
          }
        ]
      };

      /*
      // @ts-ignore
      this.embedRules(DocCommentHighlightRules, 'doc-', [
        DocCommentHighlightRules.getEndRule('no_regex')
      ]);
      // @ts-ignore
      this.normalizeRules();
      */
    };
    oop.inherits(SourceHighlightRules, TextHighlightRules);
    exports.SourceHighlightRules = SourceHighlightRules;
  }

  const name = variant;

  ace.define(
    'ace/mode/source_highlight_rules' + name,
    [
      'require',
      'exports',
      'module',
      'ace/lib/oop',
      'ace/mode/doc_comment_highlight_rules',
      'ace/mode/text_highlight_rules'
    ],
    _SourceHighlightRules
  );
}

export function ModeSelector(id: number, variant: Variant, external: string = 'NONE') {
  const name = variant;

  function _Mode(acequire: any, exports: any, _module: any) {
    const oop = acequire('../lib/oop');
    const TextMode = acequire('./text').Mode;
    const SourceHighlightRules = acequire('./source_highlight_rules' + name).SourceHighlightRules;
    const MatchingBraceOutdent = acequire('./matching_brace_outdent').MatchingBraceOutdent;
    // For JSHint background worker
    // const WorkerClient = acequire('../worker/worker_client').WorkerClient
    const CstyleBehaviour = acequire('./behaviour/cstyle').CstyleBehaviour;
    const CStyleFoldMode = acequire('./folding/cstyle').FoldMode;

    const Mode = function (this: any) {
      this.HighlightRules = SourceHighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, TextMode);
    (function (this: any) {
      this.lineCommentStart = '//';
      this.blockComment = { start: '/*', end: '*/' };
      this.$quotes = { '"': '"', "'": "'", '`': '`' };

      this.getNextLineIndent = function (state: any, line: any, tab: any) {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;
        const endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length - 1].type === 'comment') {
          return indent;
        }

        if (state === 'start' || state === 'no_regex') {
          const match = line.match(/^.*(?:\bcase\b.*:|[{([])\s*$/);
          if (match) {
            indent += tab;
          }
        } else if (state === 'doc-start') {
          if (endState === 'start' || endState === 'no_regex') {
            return '';
          }
          const match = line.match(/^\s*(\/?)\*/);
          if (match) {
            if (match[1]) {
              indent += ' ';
            }
            indent += '* ';
          }
        }

        return indent;
      };

      this.checkOutdent = function (state: any, line: any, input: any) {
        return this.$outdent.checkOutdent(line, input);
      };

      this.autoOutdent = function (state: any, doc: any, row: any) {
        this.$outdent.autoOutdent(doc, row);
      };

      // This is the JSHint background worker. Disabled because it is of little
      // utility to Source, and produced many false positives.
      // If this is ever enabled again: the *frontend* needs to provide the URL of
      // the worker to Ace:
      //
      // import jsWorkerUrl from "file-loader!ace-builds/src-noconflict/javascript_worker";
      // ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl)
      //
      // Note: some lint disabling may be needed for the above

      // // @ts-ignore
      // this.createWorker = function (session) {
      //   const worker = new WorkerClient(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
      //   worker.attachToDocument(session.getDocument())
      //
      //   // @ts-ignore
      //   worker.on('annotate', function (results) {
      //     session.setAnnotations(results.data)
      //   })
      //
      //   worker.on('terminate', function () {
      //     session.clearAnnotations()
      //   })
      //
      //   return worker
      // }

      this.$id = 'ace/mode/source' + name;
    }.call(Mode.prototype));

    exports.Mode = Mode;
  }

  ace.define(
    'ace/mode/source' + name,
    [
      'require',
      'exports',
      'module',
      'ace/lib/oop',
      'ace/mode/text',
      'ace/mode/source_highlight_rules1',
      'ace/mode/matching_brace_outdent',
      'ace/worker/worker_client',
      'ace/mode/behaviour/cstyle',
      'ace/mode/folding/cstyle'
    ],
    _Mode
  );
}
