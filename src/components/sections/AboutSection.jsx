import React from 'react'
import { ABOUT_METRICS } from '../../data/raddasData'

/**
 * Section 06 (and standalone About Us route) — House heritage & tailoring metrics.
 */
function AboutSection({ isStandalone = false, onBookFitting, onOpenPage }) {
  return (
    <section
      id="about"
      className={`scroll-mt-32 md:scroll-mt-24 ${
        isStandalone
          ? 'bg-[#FAF7F2] py-10 sm:py-14'
          : 'bg-[#F2ECE1]/75 border-y border-[#C8A97E]/45 py-12 sm:py-16 md:py-24'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5">
            <figure>
              <img className="house-portrait" src="/lookbook/atelier-craft.jpg" alt="Tailor marking wine velvet in the Victoria Island workroom" />
              <figcaption>Victoria Island workroom, Lagos</figcaption>
            </figure>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
                {isStandalone
                  ? 'Our workroom'
                  : '06 • About Radas Apparel'}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1 leading-tight">
                {isStandalone ? (
                  <>
                    Lagos Heritage,{' '}
                    <span className="italic">Cut in Victoria Island.</span>
                  </>
                ) : (
                  <>
                    The House of Radas:{' '}
                    <span className="italic">Made in Lagos.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="space-y-4 font-sans-ui text-sm md:text-base text-[#1C1618]/85 leading-relaxed">
              <p>
                Based in Victoria Island, Lagos, Radas Apparel cuts formal
                Nigerian ceremonial robes and modern menswear suiting under one roof. Every
                garment starts from high-twist European wool, 380gsm Italian velvet, or
                hand-loomed Aso-Oke milled specifically for warm coastal evenings and
                black-tie halls.
              </p>
              <p>
                Whether selecting a ready-to-wear Senator tunic in sizes S to 3XL for
                48-hour courier dispatch or commissioning a 3-piece Agbada drafted from 28
                body measurements, each seam is finished inside with breathable Bemberg
                Cupro satin piping.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {ABOUT_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="border-t border-[#5B0E24]/35 pt-4"
                >

                  <div className="font-serif-display text-3xl font-bold text-[#5B0E24]">
                    {metric.figure}
                  </div>
                  <div className="font-mono-spec text-xs uppercase tracking-wider text-[#1C1618] mt-1 font-medium">
                    {metric.label}
                  </div>
                  <p className="font-sans-ui text-xs text-[#1C1618]/75 mt-1.5 leading-snug">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onBookFitting('New Custom Measurement Profile')}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Book Salon Consultation
              </button>
              <button
                type="button"
                onClick={() => onOpenPage('contact')}
                className="min-h-[44px] inline-flex items-center px-6 py-2.5 rounded-full border border-[#5B0E24] text-[#5B0E24] hover:bg-[#5B0E24] hover:text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Contact the Workroom
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(AboutSection)
