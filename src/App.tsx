import { ReactNode, useEffect, useRef, useState } from 'react'
import { projects } from './projects'
import { SiteGraph } from './SiteGraph'
import { SiteLink, useLocation } from './router'

const Arrow = () => <span aria-hidden="true">↗</span>

const careerRoles = [
  {
    company: 'Mitratech AssureHire',
    role: 'Senior AI Full Stack Engineer',
    dates: 'March 2026 — Present',
    summary: 'Work across AI initiatives, AWS infrastructure, CI/CD, observability, security, and software-development process improvements.',
  },
  {
    company: 'Ellucian RaiseMe',
    role: 'Senior Software Engineer · Software Engineer II',
    dates: 'August 2022 — March 2026',
    summary: 'Worked in a Rails and React TypeScript monolith and in Go, Python, and Node services. Responsibilities included AWS infrastructure, testing, mentoring, and technical planning.',
  },
  {
    company: 'MoreSteam',
    role: 'Software Engineer · Software Developer',
    dates: 'January 2021 — August 2022',
    summary: 'Built and deployed software across more than seven SaaS products, managed Azure infrastructure, led projects, and mentored junior engineers and interns.',
  },
  {
    company: 'Arcos LLC',
    role: 'QA / IT Intern',
    dates: 'June 2019 — October 2019',
    summary: 'Worked in quality assurance and information technology.',
  },
]

const professionalProjects = [
  { title: 'Observability', detail: 'Centralized application, infrastructure, request, and log monitoring with New Relic.' },
  { title: 'CI/CD modernization', detail: 'Planned lower environments, test automation, deployment changes, and AWS infrastructure as code.' },
  { title: 'Golang Lambda services', detail: 'Consolidated four microservices into testable AWS Lambda services and established a reusable delivery pipeline.' },
  { title: 'Internal REST API', detail: 'Designed and implemented the first 20-plus endpoints of a C# REST API replacing part of a legacy monolith.' },
]

function ConventionalNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="fallback-nav" aria-label="Primary navigation">
      <SiteLink href="/" onClick={onNavigate}>Home</SiteLink>
      <SiteLink href="/portfolio" onClick={onNavigate}>Portfolio</SiteLink>
      <SiteLink href="/projects" onClick={onNavigate}>Projects</SiteLink>
      <SiteLink href="/about" onClick={onNavigate}>About</SiteLink>
    </nav>
  )
}

function HomePage({ pathname, hash }: { pathname: string; hash: string }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <span className="home-mark">TW</span>
        <ConventionalNav />
        <a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
      </header>
      <main id="main" className="home-main">
        <div className="home-intro">
          <p className="eyebrow">Software engineer · Columbus, Ohio</p>
          <h1>Trevor<br />Warthman</h1>
          <p>Choose an area.</p>
        </div>
        <SiteGraph pathname={pathname} hash={hash} />
      </main>
      <footer className="home-footer">
        <span>Portfolio and personal site</span>
        <div>
          <a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        </div>
      </footer>
    </div>
  )
}

function InternalLayout({ pathname, hash, children }: { pathname: string; hash: string; children: ReactNode }) {
  const [mapOpen, setMapOpen] = useState(false)
  const mapButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeMap = () => {
    setMapOpen(false)
    window.requestAnimationFrame(() => mapButtonRef.current?.focus())
  }

  useEffect(() => setMapOpen(false), [pathname, hash])
  useEffect(() => {
    if (!mapOpen) return
    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMap()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [mapOpen])

  return (
    <div className="internal-layout">
      <header className="mobile-header">
        <SiteLink className="mobile-wordmark" href="/">Trevor Warthman</SiteLink>
        <button ref={mapButtonRef} type="button" aria-expanded={mapOpen} aria-controls="mobile-map" onClick={() => setMapOpen(true)}>Open map</button>
      </header>
      <aside className="site-rail" aria-label="Site navigation">
        <SiteLink className="rail-wordmark" href="/"><span>Trevor</span><strong>Warthman</strong></SiteLink>
        <SiteGraph pathname={pathname} hash={hash} compact />
        <ConventionalNav />
      </aside>
      <div id="mobile-map" className={`mobile-map ${mapOpen ? 'is-open' : ''}`} aria-hidden={!mapOpen}>
        <div className="mobile-map__header">
          <strong>Site map</strong>
          <button ref={closeButtonRef} type="button" onClick={closeMap}>Close</button>
        </div>
        <SiteGraph pathname={pathname} hash={hash} onNavigate={closeMap} />
        <ConventionalNav onNavigate={closeMap} />
      </div>
      <main id="main" className="page-content">{children}</main>
    </div>
  )
}

function PageHeader({ label, title, intro, children }: { label: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="page-intro">{intro}</p>
      {children}
    </header>
  )
}

function PortfolioPage() {
  return (
    <>
      <PageHeader label="Professional" title="Portfolio" intro="Professional experience, selected engineering work, and résumé.">
        <nav className="section-nav" aria-label="Portfolio sections">
          <a href="#experience">Experience</a><a href="#projects">Selected work</a><a href="#resume">Résumé</a>
        </nav>
      </PageHeader>
      <section className="content-section portfolio-summary">
        <p className="section-label">Overview</p>
        <p className="large-copy">I build and operate SaaS systems across application code, cloud infrastructure, security, delivery pipelines, and observability.</p>
        <div className="tag-list" aria-label="Technologies">
          {['React & TypeScript', 'Ruby on Rails', 'Go & Python', 'AWS & Azure', 'CI/CD & Terraform', 'Security & observability'].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>
      <section className="content-section" id="experience">
        <div className="section-heading-row"><div><p className="section-label">Experience</p><h2>Work history</h2></div><span>2019 — Present</span></div>
        <ol className="career-list">
          {careerRoles.map((job) => (
            <li key={`${job.company}-${job.role}`}>
              <p className="career-date">{job.dates}</p>
              <div><h3>{job.company}</h3><p className="role-title">{job.role}</p><p>{job.summary}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <section className="content-section" id="projects">
        <div className="section-heading-row"><div><p className="section-label">Professional projects</p><h2>Selected work</h2></div><p>Public details are limited to information included in the résumé.</p></div>
        <div className="work-grid">
          {professionalProjects.map((project) => <article key={project.title}><h3>{project.title}</h3><p>{project.detail}</p></article>)}
        </div>
      </section>
      <section className="content-section resume-section" id="resume">
        <div><p className="section-label">Résumé · July 2026</p><h2>Full résumé</h2><p>Three pages covering experience, selected engineering work, technologies, education, and certifications.</p></div>
        <div className="button-row">
          <a className="button button--solid" href="/resume/Trevor-Warthman-Resume-July-2026.pdf" target="_blank" rel="noreferrer">View résumé <Arrow /></a>
          <a className="button" href="/resume/Trevor-Warthman-Resume-July-2026.pdf" download>Download PDF ↓</a>
        </div>
      </section>
      <section className="content-section detail-grid">
        <div><p className="section-label">Education</p><h3>The Ohio State University</h3><p>B.S. Computer and Information Science<br />Artificial Intelligence specialization<br />Chinese Language and Culture minor</p><small>August 2016 — December 2020</small></div>
        <div><p className="section-label">Credentials</p><ul className="plain-list"><li>AWS Certified Cloud Practitioner</li><li>Lean Six Sigma Yellow Belt</li><li>Eagle Scout</li></ul></div>
        <div><p className="section-label">Profiles</p><div className="stacked-links"><a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a></div></div>
      </section>
    </>
  )
}

function ProjectsPage() {
  return (
    <>
      <PageHeader label="Outside work" title="Personal projects" intro="Software projects I maintain or use myself." />
      <section className="content-section project-index-list">
        {projects.map((project, index) => (
          <SiteLink className="project-index-card" href={`/projects/${project.slug}`} key={project.slug}>
            <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
            <div><p className="section-label">{project.eyebrow} · {project.status}</p><h2>{project.name}</h2><p>{project.summary}</p></div>
            <span className="project-arrow" aria-hidden="true">→</span>
          </SiteLink>
        ))}
      </section>
    </>
  )
}

function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <NotFoundPage />
  return (
    <>
      <PageHeader label={`${project.eyebrow} · ${project.status}`} title={project.name} intro={project.summary}>
        <div className="button-row">
          <a className="button button--solid" href={project.repository} target="_blank" rel="noreferrer">GitHub repository <Arrow /></a>
          {project.live && <a className="button" href={project.live} target="_blank" rel="noreferrer">Visit project <Arrow /></a>}
        </div>
      </PageHeader>
      <section className="content-section project-case-study">
        <dl><div><dt>Problem</dt><dd>{project.problem}</dd></div><div><dt>Approach</dt><dd>{project.approach}</dd></div><div><dt>Current state</dt><dd>{project.outcome}</dd></div></dl>
        <div><p className="section-label">Technology</p><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
      </section>
      <section className="content-section media-section">
        <p className="section-label">Project media</p>
        <div className="project-media-grid">
          {project.media.map((media, index) => (
            <figure className={`project-media ${media.src ? '' : 'project-media--empty'}`} key={`${media.type}-${index}`}>
              {media.src && media.type === 'image' && <img src={media.src} alt={media.alt} />}
              {media.src && media.type === 'video' && <video src={media.src} controls preload="metadata" aria-label={media.alt} />}
              {!media.src && <div>{media.type === 'video' ? 'No project video yet.' : 'No project image yet.'}</div>}
              {media.src && <figcaption>{media.alt}</figcaption>}
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

function PersonalPage() {
  const items = [
    { label: 'About', title: 'About Trevor', description: 'Background, interests, and contact links.', href: '/about', external: false },
    { label: 'Campaign notes', title: 'Infinity Castle Saga', description: 'Campaign notes hosted on Pensieve.', href: 'https://pensieve.click/winking-skeever', external: true },
    { label: 'Cooking', title: 'Kitchen', description: 'Recipes and cooking notes.', href: '/kitchen', external: false },
    { label: 'External site', title: 'Dylan Ecker', description: 'Dylan Ecker’s website.', href: 'https://dylanecker.space', external: true },
  ]
  return (
    <>
      <PageHeader label="Personal" title="Outside work" intro="Cooking, tabletop campaign notes, and links to other personal sites." />
      <section className="content-section directory-grid">
        {items.map((item) => (
          <SiteLink key={item.title} className="directory-card" href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
            <p className="section-label">{item.label}</p><h2>{item.title}</h2><p>{item.description}</p><span>{item.external ? 'Visit ↗' : 'Open →'}</span>
          </SiteLink>
        ))}
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHeader label="About" title="Trevor Warthman" intro="Software engineer based in Columbus, Ohio." />
      <section className="content-section about-grid">
        <div className="portrait-frame"><img src="/portrait.jpg" alt="Trevor Warthman outdoors with a black Labrador" /></div>
        <div className="about-copy"><p className="large-copy">I work across application code, cloud infrastructure, delivery pipelines, security, and observability.</p><p>Outside work, I build personal software, cook, and maintain tabletop campaign notes.</p><div className="stacked-links"><a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a></div></div>
      </section>
    </>
  )
}

function KitchenPage() {
  return (
    <>
      <PageHeader label="Personal" title="Kitchen" intro="Recipes and cooking notes will live here." />
      <section className="content-section empty-state"><p className="section-label">No recipes published yet</p><h2>This section is ready for its first entry.</h2><p>Each recipe can include ingredients, steps, revisions, photos, and notes about what changed.</p></section>
    </>
  )
}

function NotFoundPage() {
  return <section className="not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p>The requested page does not exist.</p><SiteLink className="button button--solid" href="/">Return home</SiteLink></section>
}

function routeTitle(pathname: string) {
  if (pathname === '/') return 'Trevor Warthman — Software Engineer'
  if (pathname === '/portfolio') return 'Portfolio — Trevor Warthman'
  if (pathname === '/projects') return 'Personal Projects — Trevor Warthman'
  if (pathname.startsWith('/projects/')) return 'Project — Trevor Warthman'
  if (pathname === '/personal') return 'Personal — Trevor Warthman'
  if (pathname === '/about') return 'About — Trevor Warthman'
  if (pathname === '/kitchen') return 'Kitchen — Trevor Warthman'
  return 'Page not found — Trevor Warthman'
}

function App() {
  const location = useLocation()
  useEffect(() => { document.title = routeTitle(location.pathname) }, [location.pathname])
  if (location.pathname === '/') return <HomePage {...location} />

  let page: ReactNode
  if (location.pathname === '/portfolio') page = <PortfolioPage />
  else if (location.pathname === '/projects') page = <ProjectsPage />
  else if (location.pathname.startsWith('/projects/')) page = <ProjectPage slug={location.pathname.split('/').pop()!} />
  else if (location.pathname === '/personal') page = <PersonalPage />
  else if (location.pathname === '/about') page = <AboutPage />
  else if (location.pathname === '/kitchen') page = <KitchenPage />
  else page = <NotFoundPage />
  return <InternalLayout {...location}>{page}</InternalLayout>
}

export default App
