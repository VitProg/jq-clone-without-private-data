const isLinkRule = /^(https?)?:\/\//

export function isExternalLink(link?: string) {
  return !!link && isLinkRule.test(link)
}

const trimProtocolRule = /^(https?:|mailto:)?\/\//
export function trimLinkSchema(link: string) {
   return link.trim().replace(trimProtocolRule, '')
}
