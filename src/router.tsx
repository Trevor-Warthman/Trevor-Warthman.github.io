import { AnchorHTMLAttributes, MouseEvent, ReactNode, useEffect, useState } from 'react'

export type LocationState = {
  pathname: string
  hash: string
}

export function useLocation(): LocationState {
  const [location, setLocation] = useState<LocationState>(() => ({
    pathname: normalizePath(window.location.pathname),
    hash: window.location.hash,
  }))

  useEffect(() => {
    const update = () => setLocation({ pathname: normalizePath(window.location.pathname), hash: window.location.hash })
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('hashchange', update)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.route = location.pathname
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null
    window.requestAnimationFrame(() => {
      if (target) target.scrollIntoView()
      else window.scrollTo({ top: 0 })
    })
  }, [location])

  return location
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function navigate(href: string) {
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: ReactNode
}

export function SiteLink({ href, children, onClick, ...props }: SiteLinkProps) {
  const external = /^https?:\/\//.test(href)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented || external || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return

    event.preventDefault()
    navigate(href)
  }

  return <a href={href} onClick={handleClick} {...props}>{children}</a>
}

