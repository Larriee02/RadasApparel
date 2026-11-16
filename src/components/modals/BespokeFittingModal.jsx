import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DEFAULT_FITTING_GARMENT, UI_EASE } from '../../constants/storageKeys'
import { CoutureTailorSeal } from '../AtelierVisuals'

/**
 * Custom menswear fitting & measurement modal with isolated form state,
 * Escape-key closing, and backdrop click dismissal.
 */
function BespokeFittingModal({
  open,
  initialGarment,
  measurements,
  shouldReduceMotion,
  onClose,
}) {
  const [bespokeForm, setBespokeForm] = useState({
    clientName: '',
    email: '',
    garment: DEFAULT_FITTING_GARMENT,
    city: 'Lagos Atelier Fitting',
    chest: '42"',
    shoulder: '18.5"',
    sleeve: '25.5"',
    notes: '',
  })
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    setBespokeForm((prev) => ({
      ...prev,
      garment: initialGarment || prev.garment || DEFAULT_FITTING_GARMENT,
      chest: measurements?.chest || prev.chest,
      shoulder: measurements?.shoulder || prev.shoulder,
      sleeve: measurements?.sleeve || prev.sleeve,
    }))
    setBookingConfirmed(false)

    if (typeof window === 'undefined') return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, initialGarment, measurements, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Book Private Fitting Commission"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1618]/75 backdrop-blur-xs"
        >
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.99 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }
            }
            transition={{ duration: 0.26, ease: UI_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#FAF7F2] editorial-border p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#C8A97E]">
              <div>
                <span className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
                  Custom Menswear Portal
                </span>
                <h3 className="font-serif-display text-3xl font-semibold text-[#1C1618]">
                  Book Private Fitting Commission
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[38px] px-3 py-1 border border-[#1C1618] font-mono-spec text-xs hover:bg-[#1C1618] hover:text-[#FAF7F2] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-4">
                <CoutureTailorSeal
                  size="lg"
                  variant="wine"
                  label="COMMISSION REGISTERED • RADAS • "
                />
                <h4 className="font-serif-display text-3xl text-[#5B0E24]">
                  Fitting Request Logged
                </h4>
                <p className="font-sans-ui text-sm text-[#1C1618]/85 max-w-md mx-auto">
                  Head cutter assigned for <strong>{bespokeForm.garment}</strong> (
                  {bespokeForm.city}). Tape profile:{' '}
                  <span className="font-mono-spec text-xs">
                    Chest {bespokeForm.chest} / Shoulder {bespokeForm.shoulder} /
                    Sleeve {bespokeForm.sleeve}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-6 py-3 bg-[#5B0E24] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
                >
                  Return to Lookbook
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setBookingConfirmed(true)
                }}
                className="mt-5 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Client Full Name
                    </span>
                    <input
                      required
                      type="text"
                      value={bespokeForm.clientName}
                      onChange={(e) =>
                        setBespokeForm((f) => ({ ...f, clientName: e.target.value }))
                      }
                      placeholder="Full Name"
                      className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Email Address
                    </span>
                    <input
                      required
                      type="email"
                      value={bespokeForm.email}
                      onChange={(e) =>
                        setBespokeForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="client@domain.example"
                      className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Selected Garment
                    </span>
                    <input
                      type="text"
                      value={bespokeForm.garment}
                      onChange={(e) =>
                        setBespokeForm((f) => ({ ...f, garment: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 font-mono-spec text-xs"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Fitting Channel
                    </span>
                    <select
                      value={bespokeForm.city}
                      onChange={(e) =>
                        setBespokeForm((f) => ({ ...f, city: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                    >
                      <option>Lagos Atelier Fitting</option>
                      <option>London Mayfair Fitting</option>
                      <option>Live Video Tape Consultation</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-[#F2ECE1] p-3.5 border border-[#C8A97E]">
                  {[
                    ['chest', 'Chest'],
                    ['shoulder', 'Shoulder'],
                    ['sleeve', 'Sleeve'],
                  ].map(([k, lbl]) => (
                    <label key={k} className="block">
                      <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                        {lbl}
                      </span>
                      <input
                        type="text"
                        value={bespokeForm[k]}
                        onChange={(e) =>
                          setBespokeForm((f) => ({ ...f, [k]: e.target.value }))
                        }
                        className="w-full px-2.5 py-2 bg-[#FAF7F2] border border-[#1C1618]/40 font-mono-spec text-xs"
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                    Embroidery / Monogram Notes
                  </span>
                  <textarea
                    rows={2}
                    value={bespokeForm.notes}
                    onChange={(e) =>
                      setBespokeForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Cuff initials, lapel width, or ceremony date..."
                    className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                >
                  Confirm Fitting Appointment →
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(BespokeFittingModal)
