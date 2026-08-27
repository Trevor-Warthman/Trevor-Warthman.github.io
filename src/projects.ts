export type Project = {
  slug: string
  name: string
  eyebrow: string
  summary: string
  status: string
  stack: string[]
  repository: string
  live?: string
  problem: string
  approach: string
  outcome: string
  media: { type: 'image' | 'video'; src?: string; alt: string }[]
}

export const projects: Project[] = [
  {
    slug: 'pensieve',
    name: 'Pensieve',
    eyebrow: 'Publishing system',
    summary: 'A self-hosted Obsidian Publish alternative for turning a personal vault into a readable public site.',
    status: 'Active',
    stack: ['JavaScript', 'Obsidian', 'Static publishing'],
    repository: 'https://github.com/Trevor-Warthman/pensieve',
    live: 'https://pensieve.click/winking-skeever',
    problem: 'Personal knowledge should be easy to publish without handing the whole system to a paid platform.',
    approach: 'Keep the authoring workflow close to the vault and produce a public reading experience from it.',
    outcome: 'Pensieve now hosts public material, including the Infinity Castle Saga campaign notes.',
    media: [{ type: 'image', alt: 'Pensieve interface preview to be added' }],
  },
  {
    slug: 'chef',
    name: 'Chef',
    eyebrow: 'Recipe service',
    summary: 'A TypeScript service for recipes, built as part of a longer-running interest in useful cooking software.',
    status: 'Evolving',
    stack: ['TypeScript', 'Service design', 'Recipes'],
    repository: 'https://github.com/Trevor-Warthman/Chef',
    problem: 'Recipes need structure that can support more than a pile of bookmarks and disconnected notes.',
    approach: 'Model the recipe domain as a service that other cooking tools can build upon.',
    outcome: 'The repository establishes the service foundation; fuller architecture notes and media are next.',
    media: [{ type: 'image', alt: 'Chef project preview to be added' }],
  },
  {
    slug: 'chrome-group-default-page',
    name: 'Chrome Group Default Page',
    eyebrow: 'Browser extension',
    summary: 'A small TypeScript extension that gives restored Chrome tab groups a useful starting page.',
    status: 'Utility',
    stack: ['TypeScript', 'Chrome extensions', 'Workflow'],
    repository: 'https://github.com/Trevor-Warthman/ChromeGroupDefaultPage',
    problem: 'Restored tab groups opened to a blank page instead of the tool that anchored the work.',
    approach: 'Give each group a dependable default destination—for example, code review or the current project page.',
    outcome: 'A focused personal fix turned a recurring browser annoyance into a reusable tool.',
    media: [{ type: 'video', alt: 'Extension walkthrough to be added' }],
  },
]
