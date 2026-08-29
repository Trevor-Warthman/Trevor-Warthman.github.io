import { ReactNode, useEffect } from 'react'
import { earlierProjects, projects } from './projects'
import { SiteGraph } from './SiteGraph'
import { navigate, SiteLink, useLocation } from './router'

const Arrow = () => <span aria-hidden="true">↗</span>

const careerRoles = [
  {
    company: 'Mitratech AssureHire',
    role: 'Senior AI Full Stack Engineer',
    dates: 'March 2026 — Present',
    summary: 'AI initiatives, AWS infrastructure, CI/CD, observability, security, and software-development process improvements.',
  },
  {
    company: 'Ellucian RaiseMe',
    role: 'Senior Software Engineer · Software Engineer II',
    dates: 'August 2022 — March 2026',
    summary: 'Rails and React TypeScript application work alongside Go, Python, and Node services. AWS infrastructure, testing, mentoring, and technical planning.',
  },
  {
    company: 'MoreSteam',
    role: 'Software Engineer · Software Developer',
    dates: 'January 2021 — August 2022',
    summary: 'Software delivery across more than seven SaaS products, Azure infrastructure, project leadership, and developer mentoring.',
  },
  {
    company: 'Arcos LLC',
    role: 'QA / IT Intern',
    dates: 'June 2019 — October 2019',
    summary: 'Quality assurance and information technology.',
  },
]

const professionalProjects = [
  {
    title: 'Observability',
    employer: 'AssureHire',
    detail: 'Integrated New Relic to centralize application, infrastructure, request, and log monitoring.',
  },
  {
    title: 'CI/CD modernization',
    employer: 'AssureHire',
    detail: 'Planned lower environments, test automation, deployment changes, and AWS infrastructure managed with Terraform.',
  },
  {
    title: 'Golang Lambda services',
    employer: 'RaiseMe',
    detail: 'Consolidated four microservices into testable AWS Lambda services and added two services using the standardized pipeline and Docker setup.',
  },
  {
    title: 'iOS and Android rollout',
    employer: 'RaiseMe',
    detail: 'Integrated the existing React application with Ionic so web, iOS, and Android could ship from the same codebase.',
  },
  {
    title: 'Critical library upgrades',
    employer: 'RaiseMe',
    detail: 'Upgraded Webpack, Rails, Puma, ESLint, Bootstrap, React, and other core dependencies.',
  },
  {
    title: 'Internal REST API',
    employer: 'MoreSteam',
    detail: 'Designed routes and resource collections and implemented the first 20-plus endpoints of a C# API replacing part of a legacy monolith.',
  },
  {
    title: 'Core database admin',
    employer: 'MoreSteam',
    detail: 'Built the Vue frontend architecture for an internal tool managing users, client organizations, and course offerings.',
  },
  {
    title: 'Architecture modernization',
    employer: 'MoreSteam',
    detail: 'Introduced npm, linting, end-to-end testing, unit and integration testing, and standardized CI/CD and cloud practices.',
  },
]

function ConventionalNav() {
  return (
    <nav className="fallback-nav" aria-label="Primary navigation">
      <SiteLink href="/resume">Résumé</SiteLink>
      <SiteLink href="/experience">Experience</SiteLink>
      <SiteLink href="/work">Work</SiteLink>
      <SiteLink href="/projects">Projects</SiteLink>
      <SiteLink href="/about">About</SiteLink>
    </nav>
  )
}

function SiteHeader() {
  return (
    <header className="site-header">
      <SiteLink className="site-wordmark" href="/" aria-label="Trevor Warthman, home">TW</SiteLink>
      <ConventionalNav />
      <a className="header-github" href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
    </header>
  )
}

function HomePage({ pathname, hash }: { pathname: string; hash: string }) {
  return (
    <div className="home-page">
      <SiteHeader />
      <main id="main" className="home-main">
        <div className="home-intro">
          <p className="eyebrow">Software engineer · Columbus, Ohio</p>
          <h1>Trevor<br />Warthman</h1>
          <p>Career, coding, and personal work.</p>
        </div>
        <SiteGraph pathname={pathname} hash={hash} full />
      </main>
      <SiteFooter />
    </div>
  )
}

function InternalLayout({ pathname, hash, children }: { pathname: string; hash: string; children: ReactNode }) {
  return (
    <div className="internal-layout">
      <SiteHeader />
      <section className="context-graph" aria-labelledby="context-graph-title">
        <div className="context-graph__intro">
          <p className="eyebrow">Current location</p>
          <h2 id="context-graph-title">Related pages</h2>
          <p>The current page is centered. Gold lines contain pages; dashed teal lines show references.</p>
        </div>
        <SiteGraph pathname={pathname} hash={hash} />
      </section>
      <main id="main" className="page-content">{children}</main>
      <SiteFooter />
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Trevor Warthman</span>
      <div>
        <a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
        <a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
      </div>
    </footer>
  )
}

function PageHeader({ label, title, intro, children }: { label: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{label}</p>
      <h1 tabIndex={-1}>{title}</h1>
      <p className="page-intro">{intro}</p>
      {children}
    </header>
  )
}

function ResumePage() {
  return (
    <>
      <PageHeader label="Career" title="Résumé" intro="Experience, education, credentials, and the current PDF.">
        <div className="button-row">
          <a className="button button--solid" href="/resume/Trevor-Warthman-Resume-July-2026.pdf" target="_blank" rel="noreferrer">View PDF <Arrow /></a>
          <a className="button" href="/resume/Trevor-Warthman-Resume-July-2026.pdf" download>Download PDF ↓</a>
        </div>
      </PageHeader>
      <section className="content-section resume-summary">
        <div>
          <p className="section-label">Current role</p>
          <h2>Senior AI Full Stack Engineer</h2>
          <p>Mitratech AssureHire · March 2026 — Present</p>
        </div>
        <div className="tag-list" aria-label="Technologies">
          {['React & TypeScript', 'Ruby on Rails', 'Go & Python', 'AWS & Azure', 'CI/CD & Terraform', 'Security & observability'].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>
      <section className="content-section detail-grid">
        <div><p className="section-label">Education</p><h3>The Ohio State University</h3><p>B.S. Computer and Information Science<br />Artificial Intelligence specialization<br />Chinese Language and Culture minor</p><small>August 2016 — December 2020</small></div>
        <div><p className="section-label">Credentials</p><ul className="plain-list"><li>AWS Certified Cloud Practitioner</li><li>Lean Six Sigma Yellow Belt</li><li>Eagle Scout</li></ul></div>
        <div><p className="section-label">More detail</p><div className="stacked-links"><SiteLink href="/experience">Experience →</SiteLink><SiteLink href="/work">Professional work →</SiteLink></div></div>
      </section>
    </>
  )
}

function ExperiencePage() {
  return (
    <>
      <PageHeader label="Career" title="Experience" intro="Professional history from 2019 to the present." />
      <section className="content-section">
        <ol className="career-list">
          {careerRoles.map((job) => (
            <li key={`${job.company}-${job.role}`}>
              <p className="career-date">{job.dates}</p>
              <div><h2>{job.company}</h2><p className="role-title">{job.role}</p><p>{job.summary}</p></div>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

function WorkPage() {
  return (
    <>
      <PageHeader label="Career" title="Professional work" intro="Selected projects from the current résumé. Public details stay within what the résumé discloses." />
      <section className="content-section work-grid">
        {professionalProjects.map((project) => (
          <article key={project.title}>
            <p className="section-label">{project.employer}</p>
            <h2>{project.title}</h2>
            <p>{project.detail}</p>
          </article>
        ))}
      </section>
    </>
  )
}

function ProjectsPage() {
  return (
    <>
      <PageHeader label="Coding" title="Projects" intro="Current projects and earlier public repositories." />
      <section className="content-section project-index-list">
        <p className="section-label">Featured</p>
        {projects.map((project, index) => (
          <SiteLink className="project-index-card" href={`/projects/${project.slug}`} key={project.slug}>
            <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
            <div><p className="section-label">{project.eyebrow} · {project.status}</p><h2>{project.name}</h2><p>{project.summary}</p></div>
            <span className="project-arrow" aria-hidden="true">→</span>
          </SiteLink>
        ))}
      </section>
      <section className="content-section earlier-work" id="earlier-work">
        <div className="section-heading-row"><div><p className="section-label">Public repositories</p><h2>Earlier work</h2></div><p>Smaller and older projects remain linked instead of being hidden.</p></div>
        <div className="earlier-work-grid">
          {earlierProjects.map((project) => (
            <a href={project.repository} target="_blank" rel="noreferrer" key={project.name}>
              <div><h3>{project.name}</h3><p>{project.summary}</p></div>
              <span>{project.stack.join(' · ')} ↗</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <NotFoundPage />
  return (
    <>
      <PageHeader label={`Coding · ${project.status}`} title={project.name} intro={project.summary}>
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
              {!media.src && <div>{media.type === 'video' ? 'Video not added.' : 'Image not added.'}</div>}
              {media.src && <figcaption>{media.alt}</figcaption>}
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHeader label="Personal" title="About" intro="Software engineer based in Columbus, Ohio." />
      <section className="content-section about-grid">
        <div className="portrait-frame"><img src="/portrait.jpg" alt="Trevor Warthman outdoors with a black Labrador" /></div>
        <div className="about-copy"><p className="large-copy">I work across application code, cloud infrastructure, delivery pipelines, security, and observability.</p><p>Outside work, I build personal software, cook, and maintain tabletop campaign notes.</p><div className="stacked-links"><a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href="https://dylanecker.space" target="_blank" rel="noreferrer">Dylan Ecker <Arrow /></a></div></div>
      </section>
    </>
  )
}

function KitchenPage() {
  return (
    <>
      <PageHeader label="Personal" title="Kitchen" intro="Recipes and cooking notes." />
      <section className="content-section empty-state"><p className="section-label">No entries yet</p><h2>Recipes will be added here.</h2><p>Entries can include ingredients, steps, photos, revisions, and notes.</p></section>
    </>
  )
}

function NotFoundPage() {
  return <section className="not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p>The requested page does not exist.</p><SiteLink className="button button--solid" href="/">Return home</SiteLink></section>
}

function routeTitle(pathname: string) {
  if (pathname === '/') return 'Trevor Warthman — Software Engineer'
  if (pathname === '/resume') return 'Résumé — Trevor Warthman'
  if (pathname === '/experience') return 'Experience — Trevor Warthman'
  if (pathname === '/work') return 'Professional Work — Trevor Warthman'
  if (pathname === '/projects') return 'Projects — Trevor Warthman'
  if (pathname.startsWith('/projects/')) return 'Project — Trevor Warthman'
  if (pathname === '/about') return 'About — Trevor Warthman'
  if (pathname === '/kitchen') return 'Kitchen — Trevor Warthman'
  return 'Page not found — Trevor Warthman'
}

function App() {
  const location = useLocation()
  const legacyTarget = location.pathname === '/portfolio' ? '/experience' : location.pathname === '/personal' ? '/about' : undefined
  const pathname = legacyTarget ?? location.pathname
  const effectiveLocation = { ...location, pathname }
  useEffect(() => {
    document.title = routeTitle(pathname)
    if (legacyTarget) window.history.replaceState({}, '', legacyTarget)
  }, [legacyTarget, pathname])
  if (pathname === '/') return <HomePage {...effectiveLocation} />

  let page: ReactNode
  if (pathname === '/resume') page = <ResumePage />
  else if (pathname === '/experience') page = <ExperiencePage />
  else if (pathname === '/work') page = <WorkPage />
  else if (pathname === '/projects') page = <ProjectsPage />
  else if (pathname.startsWith('/projects/')) page = <ProjectPage slug={pathname.split('/').pop()!} />
  else if (pathname === '/about') page = <AboutPage />
  else if (pathname === '/kitchen') page = <KitchenPage />
  else page = <NotFoundPage />
  return <InternalLayout {...effectiveLocation}>{page}</InternalLayout>
}

export default App
