import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_FITTING_GARMENT, UI_EASE } from '../../constants/storageKeys'
import { FITTING_CHANNELS, HOME_FITTING } from '../../constants/fittingChannels'
import { CURVED_GALLERY_ITEMS } from '../../data/raddasData'
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
    city: FITTING_CHANNELS[0],
    address: '',
    chest: measurements?.chest || '',
    shoulder: measurements?.shoulder || '',
    sleeve: measurements?.sleeve || '',
    notes: '',
  })
  const { id, error, pending, submit } = useRequestSubmission('fittings')
  const look = CURVED_GALLERY_ITEMS.find(item =>
    bespokeForm.garment.includes(item.sku) || bespokeForm.garment === item.title
  )
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
        className="fitting-invitation"
      >
        <header className="fitting-cover">
          <img src={look?.image || '/lookbook/atelier-craft.jpg'} alt={look?.alt || 'The Victoria Island workroom'} />
          <div>
            <h2 className="font-serif-display">Private <em>fitting</em></h2>
            {look && <p>{look.title}</p>}
          </div>
        </header>
        <button type="button" className="fitting-close" data-dialog-initial-focus
          aria-label="Close fitting" aria-disabled={pending} onClick={close}>×</button>
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
              const { address, ...request } = bespokeForm
              void submit(request.city === HOME_FITTING ? { ...request, address } : request)
            }}
            className="fitting-form"
          >
            <fieldset disabled={pending} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="fitting-label">
                    Client Full Name
                  </span>
                  <input
                    required
                    type="text"
                    value={bespokeForm.clientName}
                    onChange={(e) =>
                      setBespokeForm((f) => ({ ...f, clientName: e.target.value }))
                    }
                    autoComplete="name"
                    className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="fitting-label">
                    Email Address
                  </span>
                  <input
                    required
                    type="email"
                    value={bespokeForm.email}
                    onChange={(e) =>
                      setBespokeForm((f) => ({ ...f, email: e.target.value }))
                    }
                    autoComplete="email"
                    className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="fitting-label">
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
                  <span className="fitting-label">
                    Fitting Channel
                  </span>
                  <select
                    value={bespokeForm.city}
                    onChange={(e) =>
                      setBespokeForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                  >
                    {FITTING_CHANNELS.map(channel => <option key={channel}>{channel}</option>)}
                  </select>
                </label>
              </div>

              <p className="text-sm text-[#5B0E24]">An additional fee applies to home-service fittings.</p>
              {bespokeForm.city === HOME_FITTING && (
                <label className="block">
                  <span className="fitting-label">Home fitting address</span>
                  <textarea required maxLength={500} rows={2} autoComplete="street-address"
                    className="w-full px-3 py-2" value={bespokeForm.address}
                    onChange={event => setBespokeForm({ ...bespokeForm, address: event.target.value })} />
                </label>
              )}

              <div className="fitting-measures grid grid-cols-3 gap-3">
                <p className="col-span-3 font-serif-display text-xl">Tape measurements</p>
                {[
                  ['chest', 'Chest'],
                  ['shoulder', 'Shoulder'],
                  ['sleeve', 'Sleeve'],
                ].map(([k, lbl]) => (
                  <label key={k} className="block">
                    <span className="fitting-label">
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
                <span className="fitting-label">
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
