import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Admin from './pages/Admin.tsx'
import DynamicPage from './pages/DynamicPage.tsx'

function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhVariable();
window.addEventListener('resize', setVhVariable);

// Simple hash-based routing
function Router() {
  const path = window.location.pathname;
  
  // Login route - only accessible via direct URL
  if (path === '/login') {
    return <Login />;
  }
  
  // Admin route
  if (path === '/admin') {
    return <Admin />;
  }
  
  // Dynamic page routes (blog posts, project details, etc.)
  if (path.startsWith('/p/') || path.startsWith('/blog/') || path.startsWith('/project/')) {
    const slug = path.split('/')[2];
    return <DynamicPage slug={slug} />;
  }
  
  // Default to home
  return <Home />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
