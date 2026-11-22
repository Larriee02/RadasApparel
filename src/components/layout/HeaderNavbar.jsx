import React, { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from '../../constants/storageKeys'

import { CURVED_GALLERY_ITEMS } from '../../data/raddasData'

const featuredLooks = CURVED_GALLERY_ITEMS.slice(0, 3)

function HeaderNavbar({ onOpenOutfit, activePage, bagCount, onOpenPage, onNavClick, onBookFitting, onOpenBag }) {
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
    <header ref={header} className="floating-nav" data-open={open}>
      <div className="floating-nav-surface">
        <div className="floating-nav-bar">
          <div className="nav-tools">
            <button aria-label={`Open cart (${bagCount})`} onClick={() => { setOpen(false); onOpenBag() }}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M2 3h3l3 12h11l3-9H6" />
                <circle cx="9" cy="20" r="1.25" /><circle cx="18" cy="20" r="1.25" />
              </svg>
            </button>
            <button ref={toggle} aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open} aria-controls="house-menu" onClick={() => setOpen(!open)}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d={open ? 'M5 5l14 14M19 5L5 19' : 'M3 5h18M3 12h18M3 19h18'} />
              </svg>
            </button>
          </div>
          <button className="floating-brand" aria-label="Radas Apparel home"
            onClick={() => { setOpen(false); onOpenPage('home') }}>
            <img src="/monogram-gold.png" alt="" />
          </button>
        </div>
        <div id="house-menu" inert={!open} aria-hidden={!open}>
          <div className="nav-reveal">
            <nav aria-label="Primary navigation">
              <div className="nav-looks">
                {featuredLooks.map((look) => (
                  <button key={look.id} aria-label={look.title} onClick={() => {
                    setOpen(false)
                    toggle.current.focus()
                    onOpenOutfit(look.id)
                  }}>
                    <img src={look.image} alt="" />
                    <span>{look.silhouette}</span>
                  </button>
                ))}
              </div>
              {NAV_ITEMS.map(({ id, label }) => (
                <button key={id} aria-current={activePage === id ? 'page' : undefined}
                  onClick={() => navigate(id)}>{label}</button>
              ))}
              <button className="nav-fitting" onClick={() => { toggle.current.focus(); setOpen(false); onBookFitting() }}>
                Book Fitting
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default React.memo(HeaderNavbar)
