import { evaluate } from 'sml-slang/interpreter/interpreter';
import { parseExp } from 'sml-slang/parser/parser';
import * as Sml from 'sml-slang/sml';
import { SourceError } from 'sml-slang/types';
import { Context, Result } from 'sml-slang/types';

export function run(code: string, context: Context): Result {
  console.log(code)
  try {
    const program = parseExp(code)
    // TODO: type checking, error handling etc.
    const result = evaluate(program);

    return {
      value: Sml.valueToString(result),
      type: undefined,
      status: 'finished'
    };
  } catch (error) {
    return { status: 'errored', error: error as SourceError };
  }
}
