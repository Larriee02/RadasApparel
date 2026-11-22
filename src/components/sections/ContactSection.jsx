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
function ContactSection({ isStandalone = false, shouldReduceMotion }) {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    salon: 'Lagos Flagship Salon',
    subject: 'Private Fitting Inquiry',
    message: '',
  })
  const { id, error, pending, submit, reset } = useRequestSubmission('concierge')

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
              Visit Our Lagos Salon or{' '}
              <span className="italic">Message the Workroom.</span>
            </h2>
          </div>
          <span className="font-mono-spec text-xs text-[#1C1618]/80">
            concierge@radasapparel.example
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <aside className="salon-directory lg:col-span-5">
          <h2>Visit the Lagos workroom</h2>
          {SALON_LOCATIONS.map((salon) => (
            <article key={salon.city}>
              <h3>{salon.city}</h3>
              <p>{salon.address}</p>
              <p>{salon.hours}</p>
              <small>{salon.services}</small>
            </article>
          ))}
        </aside>
        <div className="lg:col-span-7 bg-white border border-[#5B0E24]/15 p-6 md:p-10">
          <div className="relative z-10">
            <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
              Concierge
            </div>
            <h3 className="font-serif-display text-3xl font-semibold text-[#1C1618] mt-1">
              Message the workroom
            </h3>
            <p className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/80 mt-1.5">
              Write to our cutters for wedding group orders, custom cloth swatches, or size
              guidance before ordering in Naira (₦).
            </p>

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
                        Contact destination
                      </span>
                      <select
                        value={contactForm.salon}
                        onChange={(e) =>
                          setContactForm((f) => ({ ...f, salon: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                      >
                        <option>Lagos Flagship Salon</option>
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

                  {error && <p role="alert" className="text-sm text-[#5B0E24]">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={pending}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    className="w-full min-h-[46px] py-3.5 px-6 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                  >
                    {pending ? 'Sending…' : 'Send Message to Radas Workroom →'}
                  </motion.button>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(ContactSection)
