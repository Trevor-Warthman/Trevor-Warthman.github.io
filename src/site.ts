export type SiteNode = {
  id: string
  label: string[]
  href: string
  parent?: string
  group: 'home' | 'portfolio' | 'projects' | 'personal'
  x: number
  y: number
  external?: boolean
}

export const siteNodes: SiteNode[] = [
  { id: 'home', label: ['Trevor', 'Warthman'], href: '/', group: 'home', x: 500, y: 340 },

  { id: 'portfolio', label: ['Portfolio'], href: '/portfolio', parent: 'home', group: 'portfolio', x: 245, y: 205 },
  { id: 'resume', label: ['Résumé'], href: '/portfolio#resume', parent: 'portfolio', group: 'portfolio', x: 75, y: 82 },
  { id: 'experience', label: ['Experience'], href: '/portfolio#experience', parent: 'portfolio', group: 'portfolio', x: 235, y: 54 },
  { id: 'professional-projects', label: ['Professional', 'projects'], href: '/portfolio#projects', parent: 'portfolio', group: 'portfolio', x: 405, y: 91 },

  { id: 'projects', label: ['Personal', 'projects'], href: '/projects', parent: 'home', group: 'projects', x: 775, y: 205 },
  { id: 'pensieve', label: ['Pensieve'], href: '/projects/pensieve', parent: 'projects', group: 'projects', x: 615, y: 58 },
  { id: 'chef', label: ['Chef'], href: '/projects/chef', parent: 'projects', group: 'projects', x: 790, y: 52 },
  { id: 'chrome', label: ['Chrome group', 'default page'], href: '/projects/chrome-group-default-page', parent: 'projects', group: 'projects', x: 940, y: 112 },

  { id: 'personal', label: ['Personal'], href: '/personal', parent: 'home', group: 'personal', x: 500, y: 545 },
  { id: 'about', label: ['About'], href: '/about', parent: 'personal', group: 'personal', x: 240, y: 650 },
  { id: 'kitchen', label: ['Kitchen'], href: '/kitchen', parent: 'personal', group: 'personal', x: 430, y: 680 },
  { id: 'castle', label: ['Infinity Castle', 'Saga'], href: 'https://pensieve.click/winking-skeever', parent: 'personal', group: 'personal', x: 660, y: 675, external: true },
  { id: 'dylan', label: ['Dylan Ecker'], href: 'https://dylanecker.space', parent: 'personal', group: 'personal', x: 875, y: 610, external: true },
]

export const siteEdges = siteNodes
  .filter((node) => node.parent)
  .map((node) => ({
    id: `${node.parent}-${node.id}`,
    source: siteNodes.find((candidate) => candidate.id === node.parent)!,
    target: node,
    group: node.group,
  }))

export function currentNodeId(pathname: string, hash: string) {
  const exact = siteNodes.find((node) => !node.external && node.href === `${pathname}${hash}`)
  if (exact) return exact.id

  const route = siteNodes.find((node) => !node.external && !node.href.includes('#') && node.href === pathname)
  if (route) return route.id

  if (pathname.startsWith('/projects/')) return siteNodes.find((node) => node.href === pathname)?.id ?? 'projects'
  return 'home'
}

