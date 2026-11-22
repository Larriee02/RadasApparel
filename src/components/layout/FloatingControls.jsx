import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { UI_EASE } from '../../constants/storageKeys'

/**
 * Floating cookie consent pop-up that disappears once preferences are accepted or saved.
 */
export const CookieConsentPopup = React.memo(function CookieConsentPopup({
  open,
  onDismiss,
  cookiePrefs,
  onChangePrefs,
  onPersist,
  shouldReduceMotion,
}) {
  return (
    <AnimatePresence>
      {open && (
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
          className="preference-card"
        >
          <header className="preference-heading">
            <h2 className="font-serif-display">Cookie preferences</h2>
            <button type="button" onClick={onDismiss} aria-label="Dismiss cookie pop-up">×</button>
          </header>
          <p>Your bag is saved on this device. Choose whether to keep your measurements here for your next fitting.</p>
          <label className="measurement-choice">
            <span>
              <strong>Remember my measurements</strong>
              <small>Chest, shoulder and sleeve</small>
            </span>
            <input type="checkbox" checked={cookiePrefs.measurements}
              onChange={event => onChangePrefs({ ...cookiePrefs, measurements: event.target.checked })} />
          </label>
          <button type="button" className="preference-save" onClick={() => onPersist(cookiePrefs)}>
            Save preferences <span aria-hidden="true">→</span>
          </button>
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
