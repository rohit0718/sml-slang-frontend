import { SourceError } from 'sml-slang/types';

const verboseErrors = false;
export function parseError(errors: SourceError[], verbose: boolean = verboseErrors): string {
  const errorMessagesArr = errors.map(error => {
    // TODO: add explanations etc.
    const line = error.location ? error.location.start.line : '<unknown>';
    const column = error.location ? error.location.start.column : '<unknown>';
    return `Line ${line}, column ${column}`;
  });
  return errorMessagesArr.join('\n');
}
