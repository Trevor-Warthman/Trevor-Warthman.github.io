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

export type EarlierProject = {
  name: string
  summary: string
  repository: string
  stack: string[]
}

export const projects: Project[] = [
  {
    slug: 'pensieve',
    name: 'Pensieve',
    eyebrow: 'Publishing system',
    summary: 'A self-hosted publishing tool that turns an Obsidian vault into a public website.',
    status: 'Active',
    stack: ['JavaScript', 'Obsidian', 'Static publishing'],
    repository: 'https://github.com/Trevor-Warthman/pensieve',
    live: 'https://pensieve.click/winking-skeever',
    problem: 'Publishing selected Obsidian notes required either a paid service or a separate authoring workflow.',
    approach: 'Use the vault as the authoring source and generate a public reading interface from selected notes.',
    outcome: 'Pensieve hosts public material, including the Infinity Castle Saga campaign notes.',
    media: [{ type: 'image', alt: 'Pensieve interface preview to be added' }],
  },
  {
    slug: 'chef',
    name: 'Chef',
    eyebrow: 'Recipe service',
    summary: 'A TypeScript service for storing and working with recipes.',
    status: 'Evolving',
    stack: ['TypeScript', 'Service design', 'Recipes'],
    repository: 'https://github.com/Trevor-Warthman/Chef',
    problem: 'Recipe bookmarks and notes were stored in different places and formats.',
    approach: 'Model recipes in a service that other cooking tools can use.',
    outcome: 'The repository contains the initial service implementation.',
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
    problem: 'Restored tab groups opened to a blank page instead of the page used to start that work.',
    approach: 'Assign a default destination to each tab group, such as a code review or project page.',
    outcome: 'The extension provides a reusable default-page workflow for restored tab groups.',
    media: [{ type: 'video', alt: 'Extension walkthrough to be added' }],
  },
]

export const earlierProjects: EarlierProject[] = [
  {
    name: 'Recipe App',
    summary: 'A TypeScript recipe application built before the Chef service.',
    repository: 'https://github.com/Trevor-Warthman/recipe-app',
    stack: ['TypeScript'],
  },
  {
    name: 'Turtle Reviews',
    summary: 'A TypeScript food review site.',
    repository: 'https://github.com/Trevor-Warthman/turtle-reviews',
    stack: ['TypeScript'],
  },
  {
    name: 'Blog Posts',
    summary: 'A Vue site for personal learning entries.',
    repository: 'https://github.com/Trevor-Warthman/blog-posts',
    stack: ['Vue'],
  },
  {
    name: 'Roman Numeral Calculator',
    summary: 'A small web calculator for Roman numerals.',
    repository: 'https://github.com/Trevor-Warthman/RomanNumeralCalculator',
    stack: ['HTML', 'JavaScript'],
  },
  {
    name: 'DiagnOSU',
    summary: 'A COVID-19 medical chatbot project.',
    repository: 'https://github.com/Trevor-Warthman/DiagnOSU',
    stack: ['JavaScript'],
  },
  {
    name: 'DiagnOSU Twitter Bot',
    summary: 'A bot experiment that generated posts from the DiagnOSU project.',
    repository: 'https://github.com/Trevor-Warthman/DiagnOSUTwitterBot',
    stack: ['Python', 'Jupyter'],
  },
]
