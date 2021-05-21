
const rule = /^(\d+)([smhdw])/

const muls: Record<string, number> = {
  's': 1,
  'm': 60,
  'h': 60 * 60,
  'd': 60 * 60 * 24,
  'w': 60 * 60 * 24 * 7,
}

export function convertSimpleExpiresToSeconds(expires: string) : number | undefined {
  const match = rule.exec(expires)

  if (!match || match.length !== 3) {
    return undefined
  }

  const [, time, type] = match;

  return parseInt(time, 10) * muls[type];
}
