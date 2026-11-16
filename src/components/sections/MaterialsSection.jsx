import React from 'react'
import { COLOR_ALLOCATION, MATERIAL_PALETTE } from '../../data/raddasData'

/**
 * Section 05 — Cloth Weights & Atelier Color Ratios showcase.
 */
function MaterialsSection() {
  return (
    <section
      id="materials"
      className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
            05 • Cloth Weights &amp; Atelier Color Ratios
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
            Materials Built for{' '}
            <span className="italic">Wine &amp; Off-White</span>
          </h2>
        </div>
        <span className="font-mono-spec text-xs text-[#1C1618]/80">
          60-15-15-5-3-2 Atelier Palette
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {MATERIAL_PALETTE.map((mat) => (
          <div
            key={mat.code}
            className={`p-6 rounded-[8px] border-2 ${mat.surface} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono-spec text-xs tracking-[0.14em] ${mat.accent}`}>
                  {mat.code}
                </span>
                <span
                  className="w-5 h-5 rounded-full border border-[#1C1618]/30"
                  style={{ backgroundColor: mat.swatch }}
                />
              </div>
              <h3 className="font-serif-display text-2xl font-semibold mb-2">
                {mat.title}
              </h3>
              <p className="font-sans-ui text-xs leading-relaxed opacity-90">
                {mat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F2ECE1] editorial-border p-5 md:p-6">
        <div className="flex h-5 w-full rounded-sm overflow-hidden border border-[#1C1618]/30 mb-5">
          {COLOR_ALLOCATION.map((c) => (
            <div
              key={c.hex}
              style={{ width: `${c.share}%`, backgroundColor: c.hex }}
              title={`${c.name} (${c.share}%)`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {COLOR_ALLOCATION.map((c) => (
            <div key={c.hex} className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-[#1C1618]/30 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-mono-spec text-xs font-medium text-[#1C1618]">
                  {c.share}% {c.hex}
                </span>
              </div>
              <div className="font-serif-display text-base font-semibold text-[#5B0E24]">
                {c.name}
              </div>
              <p className="font-sans-ui text-xs text-[#1C1618]/75 leading-snug">
                {c.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default React.memo(MaterialsSection)
