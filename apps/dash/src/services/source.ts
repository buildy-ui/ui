// Deferred: fetching code by URL and chunking will be implemented later.
export async function fetchCodeByUrl(url: string): Promise<string> {
  throw new Error('fetchCodeByUrl is disabled for now. Code snippets should come from Qdrant payloads.');
}

export function chunkText(text: string, _maxChars = 4000): string[] {
  return [text];
}


