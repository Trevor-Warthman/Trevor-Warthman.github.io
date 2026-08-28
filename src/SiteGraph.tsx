import { KeyboardEvent, MouseEvent } from 'react'
import { currentNodeId, siteEdges, siteNodes } from './site'
import { navigate } from './router'

type SiteGraphProps = {
  pathname: string
  hash: string
  compact?: boolean
  onNavigate?: () => void
}

const compactPositions: Record<string, { x: number; y: number }> = {
  home: { x: 500, y: 650 },
  portfolio: { x: 210, y: 405 },
  resume: { x: 40, y: 185 },
  experience: { x: 210, y: 90 },
  'professional-projects': { x: 380, y: 185 },
  projects: { x: 790, y: 405 },
  pensieve: { x: 620, y: 185 },
  chef: { x: 790, y: 90 },
  chrome: { x: 960, y: 185 },
  personal: { x: 500, y: 900 },
  about: { x: 60, y: 1135 },
  kitchen: { x: 350, y: 1210 },
  castle: { x: 650, y: 1210 },
  dylan: { x: 940, y: 1135 },
}

export function SiteGraph({ pathname, hash, compact = false, onNavigate }: SiteGraphProps) {
  const activeId = currentNodeId(pathname, hash)
  const positionFor = (id: string, x: number, y: number) => compact ? compactPositions[id] : { x, y }

  const followNode = (href: string, external?: boolean) => {
    onNavigate?.()
    if (external) window.open(href, '_blank', 'noopener,noreferrer')
    else navigate(href)
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    onNavigate?.()
    if (external || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(href)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    followNode(href, external)
  }

  return (
    <div className={`site-graph ${compact ? 'site-graph--compact' : ''}`}>
      <svg viewBox={compact ? '0 0 1000 1320' : '0 0 1000 720'} role="navigation" aria-label="Site map">
        <g className="graph-edges" aria-hidden="true">
          {siteEdges.map((edge) => {
            const source = positionFor(edge.source.id, edge.source.x, edge.source.y)
            const target = positionFor(edge.target.id, edge.target.x, edge.target.y)
            return <line key={edge.id} className={`graph-edge graph-edge--${edge.group}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
          })}
        </g>
        <g className="graph-nodes">
          {siteNodes.map((node) => {
            const isHub = !node.parent || node.parent === 'home'
            const isActive = activeId === node.id
            const position = positionFor(node.id, node.x, node.y)
            return (
              <a
                key={node.id}
                className="graph-node-link"
                href={node.href}
                target={node.external ? '_blank' : undefined}
                rel={node.external ? 'noreferrer' : undefined}
                aria-label={`${node.label.join(' ')}${node.external ? ', external site' : ''}${isActive ? ', current page' : ''}`}
                onClick={(event) => handleClick(event, node.href, node.external)}
                onKeyDown={(event) => handleKeyDown(event, node.href, node.external)}
              >
                <g
                  className={`graph-node graph-node--${node.group} ${isHub ? 'graph-node--hub' : 'graph-node--leaf'} ${isActive ? 'is-active' : ''}`}
                  transform={`translate(${position.x} ${position.y})`}
                >
                  <circle className="graph-node__hit" r={isHub ? 43 : 32} />
                  <circle className="graph-node__ring" r={isHub ? 22 : 12} />
                  <circle className="graph-node__core" r={isHub ? 8 : 5} />
                  <text className="graph-node__label" textAnchor="middle" y={isHub ? 48 : 35}>
                    {node.label.map((line, index) => (
                      <tspan key={line} x="0" dy={index === 0 ? 0 : compact ? (isHub ? 34 : 27) : 15}>{line}{node.external && index === node.label.length - 1 ? ' ↗' : ''}</tspan>
                    ))}
                  </text>
                </g>
              </a>
            )
          })}
        </g>
      </svg>
      <div className="graph-list" aria-label="Site map list">
        {siteNodes.filter((node) => node.id !== 'home').map((node) => (
          <a
            key={node.id}
            className={`graph-list__link graph-list__link--${node.group} ${activeId === node.id ? 'is-active' : ''}`}
            href={node.href}
            target={node.external ? '_blank' : undefined}
            rel={node.external ? 'noreferrer' : undefined}
            onClick={(event) => {
              if (node.external) return
              event.preventDefault()
              followNode(node.href)
            }}
          >
            <span>{node.label.join(' ')}</span>
            <small>{node.external ? 'External ↗' : 'Open →'}</small>
          </a>
        ))}
      </div>
    </div>
  )
}
