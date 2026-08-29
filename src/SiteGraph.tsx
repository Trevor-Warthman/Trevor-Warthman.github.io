import { KeyboardEvent, MouseEvent, useMemo, useState } from 'react'
import { currentNodeId, neighborIds, siteEdges, siteNodes, SiteNode } from './site'
import { navigate } from './router'

type SiteGraphProps = {
  pathname: string
  hash: string
  full?: boolean
}

type Point = { x: number; y: number; depth: number }
type TransitionMap = Record<string, number>

const groupAngles = { career: -150, coding: -30, personal: 90, home: 180 }
const storageKey = 'tw.graphTransitions.v1'

function readTransitions(): TransitionMap {
  try { return JSON.parse(window.localStorage.getItem(storageKey) ?? '{}') }
  catch { return {} }
}

function recordTransition(source: string, target: string) {
  if (source === target) return
  try {
    const transitions = readTransitions()
    const key = `${source}>${target}`
    transitions[key] = Math.min((transitions[key] ?? 0) + 1, 20)
    window.localStorage.setItem(storageKey, JSON.stringify(transitions))
  } catch { /* Navigation still works when storage is unavailable. */ }
}

function contextualNodes(activeId: string, full: boolean, expandedGroups: string[]) {
  if (full) {
    return siteNodes.filter((node) => (
      node.id === 'home' || node.kind === 'category' ||
      (node.featured && expandedGroups.includes(node.group))
    ))
  }
  const visible = new Set([activeId, ...neighborIds(activeId)])
  for (const id of [...visible]) neighborIds(id).forEach((neighbor) => visible.add(neighbor))
  for (const group of expandedGroups) {
    siteNodes.filter((node) => node.group === group && node.featured).forEach((node) => visible.add(node.id))
  }
  return siteNodes.filter((node) => visible.has(node.id)).slice(0, 12)
}

function positionsFor(nodes: SiteNode[], activeId: string, full: boolean) {
  const points: Record<string, Point> = { [activeId]: { x: 500, y: 315, depth: 0 } }
  if (full && activeId === 'home') {
    const categories = nodes.filter((node) => node.kind === 'category')
    categories.forEach((category) => {
      const angle = groupAngles[category.group] * Math.PI / 180
      points[category.id] = { x: 500 + Math.cos(angle) * 185, y: 315 + Math.sin(angle) * 175, depth: 1 }
      const children = nodes.filter((node) => node.group === category.group && node.kind !== 'category')
      children.forEach((child, index) => {
        const spread = children.length === 1 ? 0 : (index / (children.length - 1) - .5) * 74
        const childAngle = (groupAngles[category.group] + spread) * Math.PI / 180
        points[child.id] = { x: 500 + Math.cos(childAngle) * 345, y: 315 + Math.sin(childAngle) * 270, depth: 2 }
      })
    })
    return points
  }

  const direct = new Set(neighborIds(activeId).filter((id) => nodes.some((node) => node.id === id)))
  const ringOne = nodes.filter((node) => direct.has(node.id))
  const ringTwo = nodes.filter((node) => node.id !== activeId && !direct.has(node.id))
  ringOne.forEach((node, index) => {
    const angle = (-90 + index * 360 / Math.max(ringOne.length, 1)) * Math.PI / 180
    points[node.id] = { x: 500 + Math.cos(angle) * 185, y: 315 + Math.sin(angle) * 165, depth: 1 }
  })
  ringTwo.forEach((node, index) => {
    const angle = (-72 + index * 360 / Math.max(ringTwo.length, 1)) * Math.PI / 180
    points[node.id] = { x: 500 + Math.cos(angle) * 335, y: 315 + Math.sin(angle) * 255, depth: 2 }
  })
  return points
}

function NodeShape({ node, active }: { node: SiteNode; active: boolean }) {
  if (node.kind === 'category') return <polygon className="graph-node__shape" points="0,-25 22,-12 22,12 0,25 -22,12 -22,-12" />
  if (node.kind === 'external') return <rect className="graph-node__shape" x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
  if (node.kind === 'project') return <rect className="graph-node__shape" x="-18" y="-18" width="36" height="36" rx="8" />
  return <circle className="graph-node__shape" r={active ? 25 : 18} />
}

export function SiteGraph({ pathname, hash, full = false }: SiteGraphProps) {
  const activeId = currentNodeId(pathname, hash)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => (
    full && !window.matchMedia('(max-width: 620px)').matches ? ['career', 'coding', 'personal'] : []
  ))
  const [transitions, setTransitions] = useState<TransitionMap>(() => readTransitions())
  const nodes = useMemo(() => contextualNodes(activeId, full, expandedGroups), [activeId, full, expandedGroups])
  const positions = useMemo(() => positionsFor(nodes, activeId, full), [nodes, activeId, full])
  const visibleIds = new Set(nodes.map((node) => node.id))
  const baseEdges = siteEdges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
  const basePairs = new Set(baseEdges.map((edge) => [edge.source, edge.target].sort().join('>')))
  const affinityEdges = Object.entries(transitions).flatMap(([key]) => {
    const [source, target] = key.split('>')
    const pair = [source, target].sort().join('>')
    if (!visibleIds.has(source) || !visibleIds.has(target) || basePairs.has(pair)) return []
    return [{ id: `affinity-${pair}`, source, target, kind: 'affinity' as const }]
  })
  const edges = [...baseEdges, ...affinityEdges]

  const followNode = (node: SiteNode) => {
    if (node.kind === 'category') {
      setExpandedGroups((current) => current.includes(node.id) ? current.filter((id) => id !== node.id) : [...current, node.id])
      return
    }
    if (!node.href) return
    recordTransition(activeId, node.id)
    setTransitions(readTransitions())
    if (node.external) window.open(node.href, '_blank', 'noopener,noreferrer')
    else navigate(node.href)
  }

  const handleClick = (event: MouseEvent<Element>, node: SiteNode) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    followNode(node)
  }

  const handleKeyDown = (event: KeyboardEvent<Element>, node: SiteNode) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    followNode(node)
  }

  return (
    <div className={`site-graph ${full ? 'site-graph--full' : 'site-graph--context'}`}>
      <svg viewBox="0 0 1000 630" role="navigation" aria-label={full ? 'Site graph' : 'Related pages graph'}>
        <g aria-hidden="true">
          {edges.map((edge) => {
            const source = positions[edge.source]
            const target = positions[edge.target]
            if (!source || !target) return null
            const visits = (transitions[`${edge.source}>${edge.target}`] ?? 0) + (transitions[`${edge.target}>${edge.source}`] ?? 0)
            const baseWidth = edge.kind === 'ownership' ? 2 : edge.kind === 'mention' ? 1.7 : 1.5
            const visitWidth = Math.min(visits, 8) * (edge.kind === 'affinity' ? 0.55 : 0.45)
            return <line key={edge.id} className={`graph-edge graph-edge--${edge.kind}`} style={{ strokeWidth: baseWidth + visitWidth }} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
          })}
        </g>
        <g>
          {nodes.map((node) => {
            const point = positions[node.id]
            if (!point) return null
            const active = node.id === activeId
            const content = (
              <g className={`graph-node graph-node--${node.group} graph-node--${node.kind} ${active ? 'is-active' : ''} graph-node--depth-${point.depth}`} transform={`translate(${point.x} ${point.y})`}>
                <circle className="graph-node__hit" r="48" />
                {active && <circle className="graph-node__active-ring" r="34" />}
                <NodeShape node={node} active={active} />
                <text className="graph-node__label" textAnchor="middle" y="49">{node.shortLabel ?? node.label}{node.external ? ' ↗' : ''}</text>
              </g>
            )
            if (node.kind === 'category') {
              return <g key={node.id} role="button" tabIndex={0} aria-pressed={expandedGroups.includes(node.id)} aria-label={`${node.label} category, ${expandedGroups.includes(node.id) ? 'collapse' : 'expand'}`} className="graph-category-control" onClick={(event) => handleClick(event, node)} onKeyDown={(event) => handleKeyDown(event, node)}>{content}</g>
            }
            return <a key={node.id} className="graph-node-link" href={node.href} target={node.external ? '_blank' : undefined} rel={node.external ? 'noreferrer' : undefined} aria-label={`${node.label}${node.external ? ', external site' : ''}${active ? ', current page' : ''}`} onClick={(event) => handleClick(event, node)} onKeyDown={(event) => handleKeyDown(event, node)}>{content}</a>
          })}
        </g>
      </svg>

      <div className="graph-legend" aria-label="Graph legend">
        <span><i className="legend-node legend-node--category" /> Category</span>
        <span><i className="legend-node" /> Page</span>
        <span><i className="legend-node legend-node--external" /> External</span>
        <span><i className="legend-line legend-line--owns" /> Contains</span>
        <span><i className="legend-line legend-line--mentions" /> Mentions</span>
        <span><i className="legend-line legend-line--visited" /> Visited path</span>
      </div>

      <details className="graph-directory">
        <summary>Directory</summary>
        <div className="graph-directory__groups">
          {(['career', 'coding', 'personal'] as const).map((group) => (
            <section className={`directory-group directory-group--${group}`} key={group}>
              <h3>{group[0].toUpperCase() + group.slice(1)}</h3>
              {siteNodes.filter((node) => node.group === group && node.href).map((node) => (
                <a key={node.id} href={node.href} target={node.external ? '_blank' : undefined} rel={node.external ? 'noreferrer' : undefined} onClick={(event) => {
                  recordTransition(activeId, node.id)
                  if (node.external) return
                  event.preventDefault()
                  setTransitions(readTransitions())
                  navigate(node.href!)
                }}>{node.label}{node.external ? ' ↗' : ''}</a>
              ))}
            </section>
          ))}
        </div>
      </details>
    </div>
  )
}
