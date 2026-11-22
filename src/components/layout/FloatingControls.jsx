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

  if (!scrolledPastFold) return null

  return (
    <motion.button
      type="button"
      onClick={handleScrollTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className="return-glass"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
    >
      <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12M12 20V8m-5 5 5-5 5 5" />
      </svg>
    </motion.button>
  )
})
