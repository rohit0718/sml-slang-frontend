import { parseTypeCheckAndEvaluateExp } from 'sml-slang';
import { SourceError } from 'sml-slang/types';
import { Context, Result } from 'sml-slang/types';

export function run(code: string, context: Context): Result {
  try {
    return parseTypeCheckAndEvaluateExp(code, true);
  } catch (error) {
    return { status: 'errored', error: error as SourceError };
  }
}
