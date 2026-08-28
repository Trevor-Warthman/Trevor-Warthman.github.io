import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const redirectedPath = window.sessionStorage.getItem('github-pages-path')
if (redirectedPath) {
  window.sessionStorage.removeItem('github-pages-path')
  window.history.replaceState({}, '', redirectedPath)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
