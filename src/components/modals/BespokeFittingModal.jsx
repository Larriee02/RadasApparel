import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_FITTING_GARMENT, UI_EASE } from '../../constants/storageKeys'
import { CoutureTailorSeal } from '../AtelierVisuals'
import useRequestSubmission from '../../hooks/useRequestSubmission'
import ModalDialog from './ModalDialog'

/**
 * Custom menswear fitting & measurement modal with isolated form state,
 * Escape-key closing, and backdrop click dismissal.
 */
function BespokeFittingModal({
  initialGarment,
  measurements,
  shouldReduceMotion,
  onClose,
}) {
  const [bespokeForm, setBespokeForm] = useState({
    clientName: '',
    email: '',
    garment: initialGarment || DEFAULT_FITTING_GARMENT,
    city: 'Lagos Atelier Fitting',
    chest: measurements?.chest || '',
    shoulder: measurements?.shoulder || '',
    sleeve: measurements?.sleeve || '',
    notes: '',
  })
  const { id, error, pending, submit } = useRequestSubmission('fittings')
  function close() {
    if (!pending) onClose()
  }

  return (
    <ModalDialog
      label="Book Private Fitting Commission"
      onClose={close}
      className="flex items-center justify-center bg-[#1C1618]/75 p-4 backdrop-blur-xs"
    >
      <motion.div
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.99 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.26, ease: UI_EASE }}
        className="w-full max-w-xl bg-[#FAF7F2] p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="dialog-heading flex items-start justify-between gap-4">
          <div>
            <span className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
              Radas Atelier
            </span>
            <h3 className="font-serif-display text-3xl font-semibold text-[#FAF7F2]">
              Book Private Fitting Commission
            </h3>
          </div>
          <button
            type="button"
            data-dialog-initial-focus
            aria-disabled={pending}
            onClick={close}
            className="min-h-[38px] px-3 py-1 border border-[#1C1618] font-mono-spec text-xs hover:bg-[#1C1618] hover:text-[#FAF7F2] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {id ? (
          <div className="py-8 text-center space-y-4">
            <CoutureTailorSeal
              size="lg"
              variant="wine"
              label="COMMISSION REGISTERED • RADAS • "
            />
            <h4 className="font-serif-display text-3xl text-[#5B0E24]">
              Fitting Request Logged
            </h4>
            <p role="status" className="font-sans-ui text-sm">
              The workroom received your fitting request. Reference {id}.
            </p>
            <button
              type="button"
              autoFocus
              onClick={close}
              className="min-h-[44px] px-6 py-3 bg-[#5B0E24] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
            >
              Return to Lookbook
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void submit(bespokeForm)
            }}
            className="mt-5 space-y-4"
          >
            <fieldset disabled={pending} className="space-y-4">
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

              {error && <p role="alert" className="text-sm text-[#5B0E24]">{error}</p>}
              <button
                type="submit"
                className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                {pending ? 'Sending…' : 'Send Fitting Request →'}
              </button>
            </fieldset>
          </form>
        )}
      </motion.div>
    </ModalDialog>
  )
}

export default React.memo(BespokeFittingModal)
