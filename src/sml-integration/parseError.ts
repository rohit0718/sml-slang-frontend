import { SourceError } from 'sml-slang/types';

export function parseError(errors: SourceError[]): string {
  const errorMessagesArr = errors.map(error => {
    const line = error.location ? error.location.start.line : '<unknown>';
    const column = error.location ? error.location.start.column : '<unknown>';
    const explanation = error.explain ? error.explain() : '<unknown>';

    console.error(error);
    if (line === '<unknown>' || column === '<unknown>') {
      return `Unexpected error :(\n`;
    }
    if (error.explain === undefined) {
      return `Line ${line}, Column ${column}: Unexpected error :(\n`;
    }
    return `Line ${line}, Column ${column}: ${explanation}`;
  });
  return errorMessagesArr.join('\n');
}
