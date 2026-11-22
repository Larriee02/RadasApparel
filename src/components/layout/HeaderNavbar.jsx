import React, { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from '../../constants/storageKeys'

function HeaderNavbar({ activePage, bagCount, onOpenPage, onNavClick, onBookFitting, onOpenBag }) {
  const [open, setOpen] = useState(false)
  const header = useRef(null)
  const toggle = useRef(null)

  useEffect(() => {
    if (!open) return
    function dismiss(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current.focus()
      }
    }
    function outside(event) {
      if (!header.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', dismiss)
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    return () => {
      document.removeEventListener('keydown', dismiss)
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
    }
  }, [open])

  function navigate(id) {
    setOpen(false)
    toggle.current.focus()
    onNavClick(id)
  }

  return (
    <header ref={header} className="floating-nav">
      <div className="floating-nav-surface">
        <div className="floating-nav-bar">
          <button className="floating-brand" onClick={() => { setOpen(false); onOpenPage('home') }}>
            <img src="/monogram-gold.png" alt="" /> Radas Apparel
          </button>
          <button ref={toggle} aria-expanded={open} aria-controls="house-menu"
            onClick={() => setOpen(!open)} className="menu-trigger">
            <span aria-hidden="true">{open ? '×' : '☰'}</span> {open ? 'Close' : 'Menu'}
          </button>
          <button className="nav-fitting" onClick={() => { setOpen(false); onBookFitting() }}>Book Fitting</button>
          <button className="nav-cart" onClick={() => { setOpen(false); onOpenBag() }}>Cart ({bagCount})</button>
        </div>
        <nav id="house-menu" aria-label="Primary navigation" hidden={!open}>
          {NAV_ITEMS.map(({ id, label }) => (
            <button key={id} aria-current={activePage === id ? 'page' : undefined}
              onClick={() => navigate(id)}>{label}</button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default React.memo(HeaderNavbar)
