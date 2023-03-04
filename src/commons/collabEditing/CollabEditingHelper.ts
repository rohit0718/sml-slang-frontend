export function getSessionUrl(_sessionId: string, _ws?: boolean): string {
  return '';
}

export async function checkSessionIdExists(sessionId: string): Promise<boolean> {
  const resp = await fetch(getSessionUrl(sessionId));

  return resp && resp.ok;
}

export async function createNewSession(_initial: string): Promise<string> {
  throw new Error('Feature disabled for this demo deployment');
}
