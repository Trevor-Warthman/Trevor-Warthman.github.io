import { useState } from 'react'
import { projects } from './projects'

const Arrow = () => <span aria-hidden="true">↗</span>

const careerRoles = [
  {
    company: 'Mitratech AssureHire',
    role: 'Senior AI Full Stack Engineer',
    dates: 'March 2026 — Present',
    summary: 'Senior leadership across AI initiatives, AWS infrastructure, CI/CD, observability, security, and software-development process improvement.',
  },
  {
    company: 'Ellucian RaiseMe',
    role: 'Senior Software Engineer · Software Engineer II',
    dates: 'August 2022 — March 2026',
    summary: 'Owned work across a Rails and React TypeScript monolith, Go, Python, and Node microservices, AWS infrastructure, testing, mentoring, and technical planning.',
  },
  {
    company: 'MoreSteam',
    role: 'Software Engineer · Software Developer',
    dates: 'January 2021 — August 2022',
    summary: 'Designed and deployed software across seven-plus SaaS products, managed Azure infrastructure, led projects, and mentored junior engineers and interns.',
  },
  {
    company: 'Arcos LLC',
    role: 'QA / IT Intern',
    dates: 'June 2019 — October 2019',
    summary: 'Early professional experience in quality assurance and information technology.',
  },
]

const engineeringHighlights = [
  ['Observability', 'Centralized application, infrastructure, request, and log monitoring with New Relic.'],
  ['CI/CD modernization', 'Planned lower environments, testing automation, deployment modernization, and AWS infrastructure as code.'],
  ['Golang Lambdas', 'Consolidated four microservices into testable AWS Lambda services and established a reusable delivery pipeline.'],
  ['Core internal API', 'Designed and implemented the first 20-plus endpoints of a modern C# REST API replacing a legacy monolith.'],
]

function LivingMap() {
  const [active, setActive] = useState('work')
  const nodes = [
    { id: 'work', label: 'Work', x: 53, y: 20, href: '#work' },
    { id: 'projects', label: 'Projects', x: 78, y: 48, href: '#projects' },
    { id: 'notes', label: 'Second brain', x: 62, y: 79, href: '#personal' },
    { id: 'kitchen', label: 'Kitchen', x: 25, y: 72, href: '#personal' },
    { id: 'about', label: 'About', x: 20, y: 32, href: '#about' },
  ]

  return (
    <div className="map-shell" aria-label="Explore Trevor's living systems map">
      <svg className="map-lines" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M53 20 L78 48 L62 79 L25 72 L20 32 Z" />
        <path d="M53 20 L62 79 M20 32 L78 48 M25 72 L53 20" />
      </svg>
      <div className="map-core" aria-hidden="true"><span>TW</span></div>
      {nodes.map((node) => (
        <a
          key={node.id}
          className={`map-node ${active === node.id ? 'is-active' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          href={node.href}
          onMouseEnter={() => setActive(node.id)}
          onFocus={() => setActive(node.id)}
        >
          <span className="node-dot" />
          <span>{node.label}</span>
        </a>
      ))}
    </div>
  )
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Trevor Warthman, home">
          <span>Trevor</span> Warthman
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Career</a>
          <a href="#projects">Projects</a>
          <a href="#personal">Personal</a>
        </nav>
        <a className="header-link" href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="kicker"><span className="status-dot" /> Senior AI full-stack engineer · Columbus, Ohio</p>
            <h1>I build useful systems for <em>work, thought,</em> and everyday life.</h1>
            <p className="hero-lede">Full-stack engineering, deliberate interfaces, and an enduring curiosity about how tools fit together.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">See selected work <span aria-hidden="true">↓</span></a>
              <a className="button button-quiet" href="#work">Career overview</a>
            </div>
          </div>
          <LivingMap />
          <aside className="hero-note">
            <span>Currently mapping</span>
            <strong>A public second brain</strong>
            <p>Projects, career, kitchen experiments, and campaign worlds—connected without being flattened.</p>
          </aside>
        </section>

        <section className="section career" id="work">
          <div className="section-heading">
            <p className="kicker">Career</p>
            <h2>Engineering across the seam between people and systems.</h2>
          </div>
          <div className="career-grid">
            <div className="portrait-frame">
              <img src="/portrait.jpg" alt="Trevor Warthman outdoors with a black Labrador" />
              <span>Columbus, Ohio</span>
            </div>
            <div className="career-copy">
              <p className="large-copy">I own SaaS systems end-to-end: architecture, cloud infrastructure, security, CI/CD, application code, and observability.</p>
              <p>Across more than five years in software engineering, I’ve led projects, reviewed architecture, mentored developers, and traced issues through distributed systems while collaborating with clients and external teams.</p>
              <div className="capabilities" aria-label="Areas of practice">
                {['React & TypeScript', 'Ruby on Rails', 'Go & Python', 'AWS & Azure', 'CI/CD & Terraform', 'Security & observability'].map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="resume-callout">
                <div>
                  <p className="utility">Résumé · July 2026</p>
                  <strong>Full career record</strong>
                  <p>Three pages covering experience, selected engineering work, technologies, education, and certifications.</p>
                </div>
                <a className="resume-download" href="/resume/Trevor-Warthman-Resume-July-2026.pdf" download>Download PDF <Arrow /></a>
              </div>
              <div className="inline-links">
                <a href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
                <a href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              </div>
            </div>
          </div>

          <div className="resume-details" aria-label="Résumé details">
            <div className="career-history">
              <div className="subsection-heading">
                <p className="kicker">Experience</p>
                <h3>A record of ownership.</h3>
              </div>
              <ol>
                {careerRoles.map((job) => (
                  <li key={`${job.company}-${job.role}`}>
                    <div className="role-marker" aria-hidden="true" />
                    <div>
                      <p className="utility">{job.dates}</p>
                      <h4>{job.company}</h4>
                      <strong>{job.role}</strong>
                      <p>{job.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="career-sidebar">
              <div>
                <p className="kicker">Selected outcomes</p>
                <dl className="outcome-list">
                  {engineeringHighlights.map(([title, detail]) => (
                    <div key={title}><dt>{title}</dt><dd>{detail}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="education-card">
                <p className="kicker">Education</p>
                <h4>The Ohio State University</h4>
                <p>B.S. Computer and Information Science · Artificial Intelligence specialization · Chinese Language and Culture minor</p>
                <span>August 2016 — December 2020</span>
              </div>
              <div className="credentials">
                <p className="kicker">Credentials</p>
                <span>AWS Certified Cloud Practitioner</span>
                <span>Lean Six Sigma Yellow Belt</span>
                <span>Eagle Scout</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="section-heading split-heading">
            <div>
              <p className="kicker">Selected projects</p>
              <h2>Tools built from a real itch.</h2>
            </div>
            <p>Each entry has room to grow into a full case study: context, architecture, decisions, media, outcome, and source.</p>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.slug}>
                <div className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                <div className="project-summary">
                  <p className="utility">{project.eyebrow} · {project.status}</p>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
                <div className="project-details">
                  <dl>
                    <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                    <div><dt>Approach</dt><dd>{project.approach}</dd></div>
                    <div><dt>Current outcome</dt><dd>{project.outcome}</dd></div>
                  </dl>
                  <div className="project-links">
                    <a href={project.repository} target="_blank" rel="noreferrer">Repository <Arrow /></a>
                    {project.live && <a href={project.live} target="_blank" rel="noreferrer">Visit project <Arrow /></a>}
                  </div>
                </div>
                <div className="media-slot" role="img" aria-label={project.media[0].alt}>
                  <span>{project.media[0].type === 'video' ? 'Video' : 'Image'} slot</span>
                  <small>Project media coming next</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section personal" id="personal">
          <div className="section-heading">
            <p className="kicker">Beyond the résumé</p>
            <h2>The other systems I keep alive.</h2>
          </div>
          <div className="personal-grid">
            <article className="personal-card notes-card">
              <span className="card-symbol" aria-hidden="true">⌁</span>
              <p className="utility">Second brain</p>
              <h3>Notes that become places</h3>
              <p>I’m interested in knowledge systems that stay useful over time—and in publishing the parts worth sharing.</p>
              <a href="https://pensieve.click/winking-skeever" target="_blank" rel="noreferrer">Enter the Infinity Castle Saga <Arrow /></a>
            </article>
            <article className="personal-card kitchen-card">
              <span className="card-symbol" aria-hidden="true">◒</span>
              <p className="utility">Kitchen notes</p>
              <h3>Recipes as working documents</h3>
              <p>Cooking notes, iterations, and tools for remembering what actually made a dish work. The shelf is being stocked.</p>
              <span className="muted-link">Collection coming soon</span>
            </article>
            <article className="personal-card people-card">
              <span className="card-symbol" aria-hidden="true">↔</span>
              <p className="utility">Good people on the web</p>
              <h3>Dylan Ecker</h3>
              <p>A measured pointer to another corner of the personal web.</p>
              <a href="https://dylanecker.space" target="_blank" rel="noreferrer">Visit dylanecker.space <Arrow /></a>
            </article>
          </div>
        </section>

        <section className="section contact" id="about">
          <p className="kicker">Keep in touch</p>
          <h2>Have a system worth untangling?</h2>
          <p>Follow the work, inspect the source, or connect professionally.</p>
          <div className="contact-links">
            <a className="button button-light" href="https://www.linkedin.com/in/trevor-warthman" target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a>
            <a className="button button-outline" href="https://github.com/Trevor-Warthman" target="_blank" rel="noreferrer">Explore GitHub <Arrow /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>Trevor Warthman</span>
        <span>Built as a living system · {new Date().getFullYear()}</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  )
}

export default App
