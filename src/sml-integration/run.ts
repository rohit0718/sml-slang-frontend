import { evaluateExp } from 'sml-slang/interpreter/interpreter';
import { Expression } from 'sml-slang/parser/ast';
import { parseExp } from 'sml-slang/parser/parser';
import { SourceError } from 'sml-slang/types';
import { Context, Result } from 'sml-slang/types';

export function run(code: string, context: Context): Result {
  try {
    const exp = parseExp(code) as Expression;
    return evaluateExp(exp, true);
  } catch (error) {
    return { status: 'errored', error: error as SourceError };
  }
}
