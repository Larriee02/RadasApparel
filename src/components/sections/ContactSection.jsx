import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useRequestSubmission from '../../hooks/useRequestSubmission'
import { SALON_LOCATIONS } from '../../data/raddasData'
import {
  CoutureTailorSeal,
} from '../AtelierVisuals'

/**
 * Section 07 (and standalone Contact route) — Salons & isolated Concierge inquiry form.
 */
function ContactSection({ onBookFitting, shouldReduceMotion }) {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    salon: 'Lagos Flagship Salon',
    subject: 'Private Fitting Inquiry',
    message: '',
  })
  const { id, error, pending, submit, reset } = useRequestSubmission('concierge')

  return (
    <section id="contact" className="workroom-contact">
      <div className="contact-visit">
        <header className="contact-portrait">
          <img src="/lookbook/atelier-craft.jpg" alt="A tailor hand-stitching wine fabric in the Lagos workroom" />
          <h1 className="font-serif-display">The Lagos<br /><em>workroom</em></h1>
        </header>
        {SALON_LOCATIONS.map(salon => (
          <div className="contact-address" key={salon.city}>
            <h2 className="font-serif-display">{salon.city}</h2>
            <address>{salon.address}</address>
            <p>{salon.hours}</p>
            <p>{salon.services}</p>
            <button onClick={onBookFitting}>Book a fitting <span aria-hidden="true">↗</span></button>
          </div>
        ))}
      </div>
      <div className="contact-letter">
        <h2 className="font-serif-display">Write to the atelier</h2>
        <p>Ask our cutters about wedding orders, cloth swatches, or the fit of a garment.</p>
        {id ? (
          <div className="my-8 p-6 bg-[#FAF7F2] border-2 border-[#5B0E24] text-center space-y-3">
            <CoutureTailorSeal
              size="md"
              variant="wine"
              label="MESSAGE LOGGED • RADAS • "
            />
            <h4 className="font-serif-display text-2xl font-semibold text-[#5B0E24]">
              Inquiry Received for {contactForm.salon}
            </h4>
            <p role="status" className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/85 max-w-md mx-auto">
              Thank you, {contactForm.fullName}. The workroom received your message.
              Reference {id}.
            </p>
            <button
              type="button"
              onClick={() => {
                reset()
                setContactForm((f) => ({ ...f, message: '' }))
              }}
              className="min-h-[40px] px-5 py-2 bg-[#5B0E24] text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider cursor-pointer"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void submit(contactForm)
            }}
            className="mt-5 space-y-4"
          >
            <fieldset disabled={pending} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="contact-label">
                    Your Name
                  </span>
                  <input
                    required
                    type="text"
                    value={contactForm.fullName}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    autoComplete="name"
                    className="contact-field"
                  />
                </label>
                <label className="block">
                  <span className="contact-label">
                    Email Address
                  </span>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, email: e.target.value }))
                    }
                    autoComplete="email"
                    className="contact-field"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="contact-label">
                    Contact destination
                  </span>
                  <select
                    value={contactForm.salon}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, salon: e.target.value }))
                    }
                    className="contact-field"
                  >
                    <option>Lagos Flagship Salon</option>
                    <option>Worldwide Online Order Desk</option>
                  </select>
                </label>
                <label className="block">
                  <span className="contact-label">
                    Inquiry Subject
                  </span>
                  <select
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="contact-field"
                  >
                    <option>Private Fitting Inquiry</option>
                    <option>Wedding Party &amp; Aso-Ebi Menswear</option>
                    <option>Ready-to-Wear Size Guidance</option>
                    <option>International Courier Dispatch</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="contact-label">
                  Message
                </span>
                <textarea
                  required
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Share garment SKU, ceremony date, or fitting preference..."
                  className="contact-field"
                />
              </label>

              {error && <p role="alert" className="text-sm text-[#5B0E24]">{error}</p>}
              <motion.button
                type="submit"
                disabled={pending}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                className="w-full min-h-[46px] py-3.5 px-6 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                {pending ? 'Sending…' : 'Send message →'}
              </motion.button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  )
}

export default React.memo(ContactSection)
