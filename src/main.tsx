import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhVariable();
window.addEventListener('resize', setVhVariable);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <SpeedInsights />
    <Home />
  </StrictMode>,
)
