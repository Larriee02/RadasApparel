import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SALON_LOCATIONS } from '../../data/raddasData'
import {
  CoutureTailorSeal,
  ExoticFiligreeCorners,
  Tilt3DCard,
} from '../AtelierVisuals'

/**
 * Section 07 (and standalone Contact route) — Salons & isolated Concierge inquiry form.
 */
function ContactSection({ isStandalone = false, shouldReduceMotion }) {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    salon: 'Lagos Flagship Salon',
    subject: 'Private Fitting Inquiry',
    message: '',
  })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  return (
    <section
      id="contact"
      className={`scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 ${
        isStandalone ? 'py-10 sm:py-14' : 'py-12 sm:py-16 md:py-24'
      }`}
    >
      {!isStandalone && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#C8A97E]/50 mb-8 sm:mb-10">
          <div>
            <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
              07 • Contact Us &amp; Fitting Appointments
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
              Visit Our Salons or{' '}
              <span className="italic">Message the Workroom.</span>
            </h2>
          </div>
          <span className="font-mono-spec text-xs text-[#1C1618]/80">
            concierge@radasapparel.example
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {SALON_LOCATIONS.map((loc) => (
            <Tilt3DCard key={loc.city} intensity={5}>
              <div className="relative h-full bg-[#3A0716] velvet-damask-bg text-[#FAF7F2] editorial-border p-6 card-3d-shadow flex flex-col justify-between">
                <ExoticFiligreeCorners variant="gold" size={16} />
                <div className="relative z-10 space-y-2">
                  <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#C8A97E]">
                    Radas Apparel Salon
                  </span>
                  <h3 className="font-serif-display text-2xl font-semibold text-[#FAF7F2]">
                    {loc.city}
                  </h3>
                  <p className="font-sans-ui text-sm text-[#F2ECE1]/90">{loc.address}</p>
                  <div className="pt-2 border-t border-[#C8A97E]/25 font-mono-spec text-xs text-[#C8A97E]">
                    {loc.hours}
                  </div>
                  <p className="font-sans-ui text-xs text-[#F2ECE1]/80 leading-relaxed">
                    {loc.services}
                  </p>
                </div>
              </div>
            </Tilt3DCard>
          ))}

          <div className="bg-[#F2ECE1] editorial-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24]">
                Direct Client Desk
              </div>
              <div className="font-mono-spec text-xs text-[#1C1618] mt-0.5">
                concierge@radasapparel.example
              </div>
              <div className="font-mono-spec text-xs text-[#1C1618]/75">
                fittings@radasapparel.example
              </div>
            </div>
            <CoutureTailorSeal
              size="sm"
              variant="wine"
              label="LAGOS • LONDON • CONCIERGE • "
            />
          </div>
        </div>

        <div className="relative lg:col-span-7 bg-[#F2ECE1] editorial-border p-6 md:p-8 card-3d-shadow flex flex-col justify-between">
          <ExoticFiligreeCorners variant="wine" size={18} />
          <div className="relative z-10">
            <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
              Client Concierge Dispatch
            </div>
            <h3 className="font-serif-display text-3xl font-semibold text-[#1C1618] mt-1">
              Send an Outfit or Fitting Inquiry
            </h3>
            <p className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/80 mt-1.5">
              Write to our cutters for wedding group orders, custom cloth swatches, or size
              guidance before ordering in Naira (₦).
            </p>

            {contactSubmitted ? (
              <div className="my-8 p-6 bg-[#FAF7F2] border-2 border-[#5B0E24] text-center space-y-3">
                <CoutureTailorSeal
                  size="md"
                  variant="wine"
                  label="MESSAGE LOGGED • RADAS • "
                />
                <h4 className="font-serif-display text-2xl font-semibold text-[#5B0E24]">
                  Inquiry Received for {contactForm.salon}
                </h4>
                <p className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/85 max-w-md mx-auto">
                  Thank you, {contactForm.fullName || 'Client'}. Your note regarding{' '}
                  <strong>{contactForm.subject}</strong> has been logged for response
                  within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false)
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
                  setContactSubmitted(true)
                }}
                className="mt-5 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Your Name
                    </span>
                    <input
                      required
                      type="text"
                      value={contactForm.fullName}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, fullName: e.target.value }))
                      }
                      placeholder="Full Name"
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Email Address
                    </span>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="client@domain.example"
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Preferred Salon
                    </span>
                    <select
                      value={contactForm.salon}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, salon: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    >
                      <option>Lagos Flagship Salon</option>
                      <option>London Private Fitting Suite</option>
                      <option>Worldwide Online Order Desk</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Inquiry Subject
                    </span>
                    <select
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    >
                      <option>Private Fitting Inquiry</option>
                      <option>Wedding Party &amp; Aso-Ebi Menswear</option>
                      <option>Ready-to-Wear Size Guidance</option>
                      <option>International Courier Dispatch</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
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
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                  />
                </label>

                <motion.button
                  type="submit"
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  className="w-full min-h-[46px] py-3.5 px-6 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                >
                  Send Message to Radas Workroom &rarr;
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(ContactSection)
