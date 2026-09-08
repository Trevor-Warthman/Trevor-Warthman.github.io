import { MouseEvent, useMemo, useState } from 'react'
import { currentNodeId, graphDistances, siteEdges, siteNodes, SiteEdge, SiteNode } from './site'
import { navigate } from './router'

type SiteGraphProps = { pathname: string; hash: string; full?: boolean }
type Point = { x: number; y: number; distance: number; importance: number }
type TransitionMap = Record<string, number>

const storageKey = 'tw.graphTransitions.v2'
const center = { x: 500, y: 305 }

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

function edgeImportance(edge: SiteEdge, activeId: string) {
  if (edge.kind === 'mention') return .62
  if (edge.source === activeId || edge.target === activeId) return 1
  return .46
}

function nodeImportance(node: SiteNode, activeId: string, distance: number) {
  if (node.id === activeId) return 1
  const directEdges = siteEdges.filter((edge) => (
    (edge.source === activeId && edge.target === node.id) ||
    (edge.target === activeId && edge.source === node.id)
  ))
  if (directEdges.length) return Math.max(...directEdges.map((edge) => edgeImportance(edge, activeId)))
  return distance === 2 ? .42 : .24
}

function positionsFor(activeId: string) {
  const distances = graphDistances(activeId)
  const points: Record<string, Point> = { [activeId]: { ...center, distance: 0, importance: 1 } }
  const rings = new Map<number, SiteNode[]>()
  siteNodes.filter((node) => node.id !== activeId).forEach((node) => {
    const distance = Math.min(distances[node.id] ?? 3, 3)
    rings.set(distance, [...(rings.get(distance) ?? []), node])
  })
  const radii = { 1: { x: 205, y: 145 }, 2: { x: 335, y: 235 }, 3: { x: 440, y: 278 } }
  const offsets = { 1: -92, 2: -72, 3: -84 }
  for (const [distance, ringNodes] of rings) {
    const sorted = [...ringNodes].sort((a, b) => nodeImportance(b, activeId, distance) - nodeImportance(a, activeId, distance) || siteNodes.indexOf(a) - siteNodes.indexOf(b))
    sorted.forEach((node, index) => {
      const angle = (offsets[distance as 1 | 2 | 3] + index * 360 / sorted.length) * Math.PI / 180
      const radius = radii[distance as 1 | 2 | 3]
      points[node.id] = {
        x: center.x + Math.cos(angle) * radius.x,
        y: center.y + Math.sin(angle) * radius.y,
        distance,
        importance: nodeImportance(node, activeId, distance),
      }
    })
  }
  return points
}

function relationshipClass(edge: SiteEdge, activeId: string) {
  if (edge.kind === 'mention' || edge.kind === 'affinity') return edge.kind
  if (edge.target === activeId) return 'parent'
  return 'child'
}

function nodeRadius(node: SiteNode, point: Point) {
  if (point.distance === 0) return 20
  if (point.distance === 1) return node.kind === 'category' ? 15 : 13
  if (point.distance === 2) return node.kind === 'category' ? 9 : 7
  return 5
}

function NodeShape({ node, point }: { node: SiteNode; point: Point }) {
  const radius = nodeRadius(node, point)
  if (node.kind === 'external') return <rect className="graph-node__shape" x={-radius * .78} y={-radius * .78} width={radius * 1.56} height={radius * 1.56} transform="rotate(45)" />
  return <circle className="graph-node__shape" r={radius} />
}

export function SiteGraph({ pathname, hash, full = false }: SiteGraphProps) {
  const activeId = currentNodeId(pathname, hash)
  const [transitions, setTransitions] = useState<TransitionMap>(() => readTransitions())
  const positions = useMemo(() => positionsFor(activeId), [activeId])
  const basePairs = new Set(siteEdges.map((edge) => [edge.source, edge.target].sort().join('>')))
  const affinityEdges: SiteEdge[] = Object.keys(transitions).flatMap((key) => {
    const [source, target] = key.split('>')
    const pair = [source, target].sort().join('>')
    if (!positions[source] || !positions[target] || basePairs.has(pair)) return []
    return [{ id: `affinity-${pair}`, source, target, kind: 'affinity' }]
  })
  const edges = [...siteEdges, ...affinityEdges]

  const followNode = (node: SiteNode) => {
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

  return (
    <div className={`site-graph ${full ? 'site-graph--full' : 'site-graph--context'}`}>
      <svg viewBox="0 0 1000 610" role="navigation" aria-label="Site navigation graph">
        <g aria-hidden="true">
          {edges.map((edge) => {
            const source = positions[edge.source]
            const target = positions[edge.target]
            if (!source || !target) return null
            const visits = (transitions[`${edge.source}>${edge.target}`] ?? 0) + (transitions[`${edge.target}>${edge.source}`] ?? 0)
            const activeEdge = edge.source === activeId || edge.target === activeId
            const baseWidth = activeEdge ? 2.8 : edge.kind === 'mention' ? 1.2 : .8
            return <line key={edge.id} className={`graph-edge graph-edge--${relationshipClass(edge, activeId)} ${activeEdge ? 'is-direct' : ''}`} style={{ strokeWidth: baseWidth + Math.min(visits, 8) * .28 }} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
          })}
        </g>
        <g>
          {siteNodes.map((node) => {
            const point = positions[node.id]
            const active = node.id === activeId
            const labelOffset = nodeRadius(node, point) + (point.distance <= 1 ? 19 : 16)
            const content = <g className={`graph-node graph-node--${node.group} graph-node--${node.kind} graph-node--distance-${point.distance} ${active ? 'is-active' : ''}`} style={{ opacity: Math.max(.32, point.importance) }} transform={`translate(${point.x} ${point.y})`}><circle className="graph-node__hit" r="62" />{active && <circle className="graph-node__active-ring" r="29" />}<NodeShape node={node} point={point} /><text className="graph-node__label" textAnchor="middle" y={labelOffset}>{node.shortLabel ?? node.label}{node.external ? ' ↗' : ''}</text></g>
            if (!node.href) {
              const destination = siteNodes.find((candidate) => candidate.group === node.group && candidate.href)
              return <g key={node.id} role="link" tabIndex={0} aria-label={`${node.label}, section`} onClick={() => destination && followNode(destination)} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && destination) followNode(destination) }}>{content}</g>
            }
            return <a key={node.id} href={node.href} target={node.external ? '_blank' : undefined} rel={node.external ? 'noreferrer' : undefined} aria-label={`${node.label}${node.external ? ', external site' : ''}${active ? ', current page' : ''}`} onClick={(event) => handleClick(event, node)}>{content}</a>
          })}
        </g>
      </svg>
      <div className="graph-legend" aria-label="Relationship legend"><span><i className="legend-line legend-line--parent" /> Parent</span><span><i className="legend-line legend-line--child" /> Child</span><span><i className="legend-line legend-line--mention" /> Mention</span></div>
    </div>
  )
}
