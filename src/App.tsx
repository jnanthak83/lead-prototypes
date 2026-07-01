import { useEffect, useState } from 'react'
import { Home } from './components/Home'
import { prototypes } from './prototypes/registry'

/** Read the current prototype slug from the URL hash (#/premium-tiers). */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#\/?/, '')
}

export function App() {
  const slug = useHashRoute()
  const active = prototypes.find((p) => p.slug === slug)
  if (!active) return <Home />
  const { Component } = active
  return <Component />
}
