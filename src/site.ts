export type GraphGroup = 'home' | 'career' | 'coding' | 'personal'
export type NodeKind = 'home' | 'category' | 'page' | 'project' | 'external'
export type EdgeKind = 'ownership' | 'mention' | 'affinity'

export type SiteNode = {
  id: string
  label: string
  shortLabel?: string
  href?: string
  group: GraphGroup
  kind: NodeKind
  featured?: boolean
  external?: boolean
}

export type SiteEdge = {
  id: string
  source: string
  target: string
  kind: EdgeKind
}

export const siteNodes: SiteNode[] = [
  { id: 'home', label: 'Trevor Warthman', shortLabel: 'Trevor', href: '/', group: 'home', kind: 'home' },

  { id: 'career', label: 'Career', group: 'career', kind: 'category' },
  { id: 'resume', label: 'Résumé', href: '/resume', group: 'career', kind: 'page', featured: true },
  { id: 'experience', label: 'Experience', href: '/experience', group: 'career', kind: 'page', featured: true },
  { id: 'professional-work', label: 'Professional work', shortLabel: 'Work', href: '/work', group: 'career', kind: 'page', featured: true },

  { id: 'coding', label: 'Coding', group: 'coding', kind: 'category' },
  { id: 'projects', label: 'Projects', href: '/projects', group: 'coding', kind: 'page', featured: true },
  { id: 'pensieve', label: 'Pensieve', href: '/projects/pensieve', group: 'coding', kind: 'project', featured: true },
  { id: 'chef', label: 'Chef', href: '/projects/chef', group: 'coding', kind: 'project', featured: true },
  { id: 'chrome', label: 'Chrome Group Default Page', shortLabel: 'Chrome groups', href: '/projects/chrome-group-default-page', group: 'coding', kind: 'project', featured: true },
  { id: 'earlier-work', label: 'Earlier work', href: '/projects#earlier-work', group: 'coding', kind: 'page', featured: true },

  { id: 'personal', label: 'Personal', group: 'personal', kind: 'category' },
  { id: 'about', label: 'About', href: '/about', group: 'personal', kind: 'page', featured: true },
  { id: 'kitchen', label: 'Kitchen', href: '/kitchen', group: 'personal', kind: 'page', featured: true },
  { id: 'castle', label: 'Infinity Castle Saga', shortLabel: 'Infinity Castle', href: 'https://pensieve.click/winking-skeever', group: 'personal', kind: 'external', featured: true, external: true },
  { id: 'dylan', label: 'Dylan Ecker', href: 'https://dylanecker.space', group: 'personal', kind: 'external', featured: true, external: true },
]

export const siteEdges: SiteEdge[] = [
  { id: 'home-career', source: 'home', target: 'career', kind: 'ownership' },
  { id: 'home-coding', source: 'home', target: 'coding', kind: 'ownership' },
  { id: 'home-personal', source: 'home', target: 'personal', kind: 'ownership' },
  { id: 'career-resume', source: 'career', target: 'resume', kind: 'ownership' },
  { id: 'career-experience', source: 'career', target: 'experience', kind: 'ownership' },
  { id: 'career-work', source: 'career', target: 'professional-work', kind: 'ownership' },
  { id: 'resume-experience', source: 'resume', target: 'experience', kind: 'mention' },
  { id: 'resume-work', source: 'resume', target: 'professional-work', kind: 'mention' },
  { id: 'coding-projects', source: 'coding', target: 'projects', kind: 'ownership' },
  { id: 'coding-pensieve', source: 'coding', target: 'pensieve', kind: 'ownership' },
  { id: 'coding-chef', source: 'coding', target: 'chef', kind: 'ownership' },
  { id: 'coding-chrome', source: 'coding', target: 'chrome', kind: 'ownership' },
  { id: 'coding-earlier', source: 'coding', target: 'earlier-work', kind: 'ownership' },
  { id: 'personal-about', source: 'personal', target: 'about', kind: 'ownership' },
  { id: 'personal-kitchen', source: 'personal', target: 'kitchen', kind: 'ownership' },
  { id: 'personal-castle', source: 'personal', target: 'castle', kind: 'ownership' },
  { id: 'personal-dylan', source: 'personal', target: 'dylan', kind: 'ownership' },
  { id: 'pensieve-castle', source: 'pensieve', target: 'castle', kind: 'mention' },
  { id: 'chef-kitchen', source: 'chef', target: 'kitchen', kind: 'mention' },
  { id: 'about-dylan', source: 'about', target: 'dylan', kind: 'mention' },
]

export function currentNodeId(pathname: string, hash: string) {
  if (pathname === '/portfolio') return 'experience'
  if (pathname === '/projects' && hash === '#earlier-work') return 'earlier-work'
  const exact = siteNodes.find((node) => !node.external && node.href === `${pathname}${hash}`)
  if (exact) return exact.id
  const route = siteNodes.find((node) => !node.external && node.href === pathname)
  return route?.id ?? 'home'
}

export function neighborIds(id: string) {
  return siteEdges.flatMap((edge) => {
    if (edge.source === id) return [edge.target]
    if (edge.target === id) return [edge.source]
    return []
  })
}
