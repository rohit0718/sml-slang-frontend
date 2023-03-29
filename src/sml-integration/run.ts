import { evaluateExp } from 'sml-slang/interpreter/interpreter';
import { Expression } from 'sml-slang/parser/ast';
import { parseExp } from 'sml-slang/parser/parser';
import * as Sml from 'sml-slang/sml'
import { hindleyMilner } from 'sml-slang/typechecker';
import {
  createInitialTypeEnvironment,
  substituteIntoType,
  unify
} from 'sml-slang/typechecker/environment';
import { stringifyType } from 'sml-slang/typechecker/utils';
import { SourceError } from 'sml-slang/types';
import { Context, Result } from 'sml-slang/types';

const INIT_ENV = createInitialTypeEnvironment();

export function run(code: string, context: Context): Result {
  try {
    const exp = parseExp(code) as Expression;

    const [type, typeConstraints] = hindleyMilner(INIT_ENV, exp);
    const S = unify(typeConstraints);
    const res = evaluateExp(exp)
    return {
      value: `${Sml.valueToString(res)} : ${stringifyType(substituteIntoType(type, S))}`,
      type: undefined,
      status: 'finished'
    };
  } catch (error) {
    return { status: 'errored', error: error as SourceError };
  }
}
