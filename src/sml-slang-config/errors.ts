import { SourceError } from 'sml-slang/dist/types';

const verboseErrors = false;
export function parseError(errors: SourceError[], verbose: boolean = verboseErrors): string {
  const errorMessagesArr = errors.map(error => {
    const line = error.location ? error.location.start.line : '<unknown>';
    const column = error.location ? error.location.start.column : '<unknown>';
    const explanation = error.explain();
    if (verbose) {
      const elaboration = error.elaborate();
      return `Line ${line}, Column ${column}: ${explanation}\n${elaboration}\n`;
    } else {
      return `Line ${line}: ${explanation}`;
    }
  });
  return errorMessagesArr.join('\n');
}
