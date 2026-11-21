import React from 'react'
import { CoutureTailorSeal } from '../AtelierVisuals'

/**
 * Aged Burgundy footer shared consistently across Home, About Us, Contact, and Gallery views.
 */
function AtelierFooter({ onBookFitting, onCookieSettings }) {
  return (
    <footer className="bg-[#3A0716] text-[#FAF7F2] border-t-2 border-[#C8A97E]/50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/monogram-gold.png"
                alt="Radas Apparel Seal"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="font-serif-display text-2xl font-semibold tracking-[0.06em] text-[#FAF7F2]">
                  RADAS APPAREL
                </div>
                <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#C8A97E]">
                  Men&apos;s Fashion &bull; Custom Cut &amp; Ready-to-Wear
                </div>
              </div>
            </div>
            <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/85 max-w-md leading-relaxed">
              Hand-cut Agbadas, Senator kaftans, black-tie tuxedos, and resort
              two-pieces sewn in Lagos and fitted across London.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#C8A97E]">
              Salons &amp; Fitting Inquiries
            </div>
            <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/90">
              Adeola Odeku Street, Victoria Island, Lagos
            </p>
            <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/90">
              Mount Street, Mayfair, London
            </p>
            <p className="font-mono-spec text-xs text-[#C8A97E] pt-1">
              concierge@radasapparel.example
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between gap-4">
            <CoutureTailorSeal
              size="md"
              variant="gold"
              label="RADAS MENSWEAR • LAGOS & LONDON • "
            />
            <button
              type="button"
              onClick={() => onBookFitting()}
              className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#1C1618] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
            >
              Schedule Private Fitting
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#C8A97E]/25 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-spec text-xs text-[#F2ECE1]/70 uppercase tracking-[0.12em]">
          <span>© 2026 Radas Apparel • Lagos &amp; London</span>
          <button type="button" onClick={onCookieSettings} className="cursor-pointer underline">
            Cookie Settings
          </button>
          <span>All Pricing Displayed in Nigerian Naira (₦)</span>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(AtelierFooter)
