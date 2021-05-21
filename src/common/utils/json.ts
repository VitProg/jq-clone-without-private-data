

export function safeJsonParse<T>(json: any): T | undefined {
  if (!json || typeof json !== 'string') {
    return undefined
  }

  try {
    return JSON.parse(json)
  } catch {
    return undefined
  }
}
