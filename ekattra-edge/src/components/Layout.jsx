import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { company } from '../data/content.js'

const links = [
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/industries', 'Who we work with'],
  ['/contact', 'Contact'],
]

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <Link to="/" className="brand">Ekattra <span>Edge</span></Link>
        <nav aria-label="Main">
          {/* {links.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))} */}
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/industries">Who we work with</Link>
            <Link to="/contact">Contact</Link>
        </nav>
      </header>
      <main id="main"><Outlet /></main>
      <footer className="footer">
        <p className="footer-line">{company.closing}</p>
        <div className="footer-cols">
          <p>{company.tagline}</p>
          <p>{company.location}</p>
          <p><a href={`mailto:${company.email}`}>{company.email}</a></p>
          <p><a href={`tel:${company.phone.replace(/-/g, '')}`}>{company.phone}</a></p>
        </div>
      </footer>
    </>
  )
}
