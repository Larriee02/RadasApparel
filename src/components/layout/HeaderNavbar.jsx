import React from 'react'
import { motion } from 'framer-motion'
import { NAV_ITEMS } from '../../constants/storageKeys'

/**
 * Sticky frosted-glass navigation bar with clickable Radas Apparel logo,
 * 4-item route switcher (desktop capsule & mobile 4-column bar), and Bag/Fitting actions.
 */
function HeaderNavbar({
  activePage,
  bagCount,
  shouldReduceMotion,
  onOpenPage,
  onNavClick,
  onBookFitting,
  onOpenBag,
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#38232A] text-[#FAF7F2] border-b border-[#FAF7F2]/15">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 md:px-10 py-2 md:py-3">
        {/* Primary Top Bar: Brand Left, 4 Links Center (Desktop), Book Fitting & Cart Top-Right */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Top-Left Clickable Brand Logo -> Returns to Home Page */}
          <button
            type="button"
            onClick={() => onOpenPage('home')}
            aria-label="Radas Apparel — Return to Home Page"
            className="flex items-center gap-2 sm:gap-3 shrink-0 text-left cursor-pointer focus-visible:outline-[#C8A97E] min-h-[40px]"
          >
            <img
              src="/monogram-gold.png"
              alt="Radas Apparel Gold Monogram"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
            />
            <div>
              <span className="font-serif-display text-base sm:text-lg font-semibold tracking-[0.04em] text-[#FAF7F2] block leading-none">
                Radas Apparel
              </span>

            </div>
          </button>

          {/* Center Navigation (Home, About Us, Contact, Gallery) — Desktop/Tablet Frosted Glass Capsule */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center justify-center gap-1 lg:gap-1.5 px-2 py-1 "
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavClick(item.id)}
                  className={`px-3.5 py-1.5 rounded-full font-sans-ui text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#C8A97E]/90 text-[#1C1618] shadow-sm'
                      : 'text-[#FAF7F2]/90 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/15'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Top-Right Actions: Book Fitting & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onBookFitting()}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-pill border border-[#C8A97E]/75 font-sans-ui text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#FAF7F2] hover:bg-[#C8A97E] hover:text-[#1C1618] transition-colors cursor-pointer whitespace-nowrap"
            >
              Book Fitting
            </button>
            <motion.button
              type="button"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              onClick={onOpenBag}
              className="min-h-[36px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#C8A97E]/95 text-[#1C1618] hover:bg-[#FAF7F2] font-sans-ui text-[10px] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Cart ({bagCount})
            </motion.button>
          </div>
        </div>

        {/* Mobile-Only Clean 4-Link Frosted Glass Row (Home, About Us, Contact, Gallery) */}
        <nav
          aria-label="Mobile Navigation"
          className="grid grid-cols-4 gap-1.5 pt-1.5 mt-1.5 border-t border-[#FAF7F2]/15 md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={`mob-${item.id}`}
                type="button"
                onClick={() => onNavClick(item.id)}
                className={`min-h-[34px] px-1.5 py-1 rounded-full font-sans-ui text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C8A97E]/90 text-[#1C1618] shadow-sm'
                    : 'glass-pill border border-[#FAF7F2]/15 text-[#FAF7F2] hover:bg-[#FAF7F2]/20'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default React.memo(HeaderNavbar)
