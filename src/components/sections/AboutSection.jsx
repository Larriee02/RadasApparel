import React from 'react'
import { ABOUT_METRICS } from '../../data/raddasData'
import {
  CoutureTailorSeal,
  ExoticFiligreeCorners,
  GarmentVisual,
  Tilt3DCard,
} from '../AtelierVisuals'

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
            <Tilt3DCard intensity={6}>
              <div className="relative bg-[#3A0716] velvet-damask-bg editorial-border p-4 sm:p-5 pb-0 card-3d-shadow">
                <ExoticFiligreeCorners variant="gold" size={18} />
                <div
                  className="relative h-72 sm:h-96 overflow-hidden border-t-2 border-x-2 border-[#C8A97E] shadow-2xl"
                  style={{
                    borderTopLeftRadius: '140px',
                    borderTopRightRadius: '140px',
                  }}
                >
                  <GarmentVisual
                    image="/lookbook/atelier-craft.jpg"
                    alt="Radas master tailor cutting wine velvet cloth at the Victoria Island cutting table"
                    silhouette="agbada"
                    tone="wine"
                    zoomOnHover
                    eager
                    className="w-full h-full"
                  />
                </div>
                <div className="py-4 px-2 flex items-center justify-between gap-3 text-[#FAF7F2]">
                  <div>
                    <div className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#C8A97E]">
                      Victoria Island Workroom
                    </div>
                    <div className="font-serif-display text-lg font-medium">
                      Pattern Cutting &amp; Hand Zari Embroidery
                    </div>
                  </div>
                  <CoutureTailorSeal
                    size="sm"
                    variant="gold"
                    label="RADAS • ESTABLISHED IN LAGOS • "
                  />
                </div>
              </div>
            </Tilt3DCard>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
                {isStandalone
                  ? 'House Heritage & Tailoring Standards'
                  : '06 • About Radas Apparel'}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1 leading-tight">
                {isStandalone ? (
                  <>
                    Lagos Heritage,{' '}
                    <span className="italic">Mayfair Pattern Precision.</span>
                  </>
                ) : (
                  <>
                    The House of Radas:{' '}
                    <span className="italic">Lagos Heritage, Mayfair Precision.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="space-y-4 font-sans-ui text-sm md:text-base text-[#1C1618]/85 leading-relaxed">
              <p>
                Founded between Victoria Island and Mayfair, Radas Apparel cuts formal
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
                  className="relative bg-[#FAF7F2] editorial-border p-4 card-3d-shadow"
                >
                  <ExoticFiligreeCorners variant="wine" size={14} />
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
                Contact Our Salons
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(AboutSection)
