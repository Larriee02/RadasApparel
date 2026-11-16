import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DEFAULT_COOKIE_PREFS, UI_EASE } from '../../constants/storageKeys'

/**
 * Floating cookie consent pop-up that disappears once preferences are accepted or saved.
 */
export const CookieConsentPopup = React.memo(function CookieConsentPopup({
  cookiesSaved,
  cookiePrefs,
  onChangePrefs,
  onPersist,
  shouldReduceMotion,
}) {
  return (
    <AnimatePresence>
      {!cookiesSaved && (
        <motion.aside
          aria-label="Radas Cookie Preferences"
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
          }
          transition={{ duration: 0.24, ease: UI_EASE }}
          className="fixed bottom-3 sm:bottom-4 left-3 sm:left-5 z-50 w-[calc(100vw-6.5rem)] max-w-[360px] bg-[#3A0716]/96 backdrop-blur-md text-[#FAF7F2] border-2 border-[#C8A97E] rounded-[14px] p-2.5 sm:p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 pb-1.5 sm:pb-2 border-b border-[#C8A97E]/30">
            <div className="flex items-center gap-2">
              <img
                src="/monogram-gold.png"
                alt="Radas Cookie Mark"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[#C8A97E] font-semibold">
                Radas Cookie Settings
              </span>
            </div>
            <button
              type="button"
              onClick={() => onPersist(cookiePrefs)}
              aria-label="Dismiss cookie pop-up"
              className="px-2 py-0.5 text-[11px] font-mono-spec border border-[#C8A97E]/50 rounded-full hover:bg-[#5B0E24] cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="font-sans-ui text-[11px] sm:text-xs text-[#F2ECE1]/90 mt-1.5 sm:mt-2 leading-snug sm:leading-relaxed">
            Browser cookies keep your cart items, 28-point tape measurements, and
            lookbook position saved across pages.
          </p>

          <div className="mt-2 sm:mt-2.5 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[8px] bg-[#5B0E24]/70 border border-[#C8A97E]/35">
              <div>
                <div className="font-mono-spec text-[11px] text-[#FAF7F2] font-semibold">
                  Essential Cart &amp; Session
                </div>
                <div className="font-sans-ui text-[10px] text-[#F2ECE1]/70">
                  Active for cart &amp; checkout
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#C8A97E] text-[#1C1618] font-mono-spec text-[10px] font-bold">
                ON
              </span>
            </div>

            {[
              {
                key: 'measurements',
                label: 'Tape Memory',
                sub: 'Saves Chest, Shoulder & Sleeve entries',
              },
              {
                key: 'analytics',
                label: 'Lookbook Stage State',
                sub: 'Saves preferred 3D view',
              },
            ].map((opt) => {
              const checked = Boolean(cookiePrefs[opt.key])
              return (
                <label
                  key={opt.key}
                  className="flex items-center justify-between gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[8px] bg-[#1C1618]/40 border border-[#C8A97E]/30 cursor-pointer hover:border-[#C8A97E]"
                >
                  <div>
                    <div className="font-mono-spec text-[11px] text-[#FAF7F2]">
                      {opt.label}
                    </div>
                    <div className="font-sans-ui text-[10px] text-[#F2ECE1]/70">
                      {opt.sub}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      onChangePrefs((prev) => ({
                        ...prev,
                        [opt.key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#C8A97E] cursor-pointer shrink-0"
                  />
                </label>
              )
            })}
          </div>

          <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onPersist(DEFAULT_COOKIE_PREFS)}
              className="min-h-[34px] sm:min-h-[38px] px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full bg-[#C8A97E] hover:bg-[#FAF7F2] text-[#1C1618] font-sans-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
            >
              Accept Cookies
            </button>
            <button
              type="button"
              onClick={() => onPersist(cookiePrefs)}
              className="min-h-[34px] sm:min-h-[38px] px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full border border-[#C8A97E]/75 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
            >
              Save Cookies
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
})

/**
 * Isolated Scroll-to-Top button keeping scroll listener state out of the App root tree.
 */
export const ScrollToTopButton = React.memo(function ScrollToTopButton({
  shouldReduceMotion,
}) {
  const [scrolledPastFold, setScrolledPastFold] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onScroll = () => {
      const next = window.scrollY > 180
      setScrolledPastFold((prev) => (prev === next ? prev : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleScrollTop}
      aria-label="Scroll to top"
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className={`fixed bottom-4 right-3 sm:right-5 z-40 min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full bg-[#5B0E24]/95 hover:bg-[#3A0716] text-[#FAF7F2] border-2 border-[#C8A97E] shadow-xl flex items-center gap-1.5 font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.1em] transition-opacity cursor-pointer ${
        scrolledPastFold ? 'opacity-100' : 'opacity-85 hover:opacity-100'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        className="w-3.5 h-3.5 text-[#C8A97E] shrink-0"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
      </svg>
      <span>Top</span>
    </motion.button>
  )
})
