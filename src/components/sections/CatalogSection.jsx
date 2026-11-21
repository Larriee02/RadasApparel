import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DEPARTMENT_PILLARS,
  GARMENTS,
  formatNaira,
} from '../../data/raddasData'
import { UI_EASE } from '../../constants/storageKeys'
import {
  ExoticFiligreeCorners,
  GarmentVisual,
  Tilt3DCard,
} from '../AtelierVisuals'

/**
 * Section 02 — Menswear Department Catalog (RTW & Bespoke) with localized filtering.
 */
function CatalogSection({ shouldReduceMotion, onAddToBag, onBookFitting }) {
  const [activePillar, setActivePillar] = useState('All')
  const [cardModes, setCardModes] = useState({})

  const filteredGarments = useMemo(
    () =>
      activePillar === 'All'
        ? GARMENTS
        : GARMENTS.filter((g) => g.pillar === activePillar),
    [activePillar]
  )

  return (
    <section
      id="collections"
      className="scroll-mt-32 md:scroll-mt-24 bg-[#F2ECE1]/65 border-y border-[#C8A97E]/40 py-12 sm:py-16 md:py-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
              02 • Ready-to-Wear &amp; Made-to-Measure Menswear
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
              The Menswear <span className="italic">House Catalog</span>
            </h2>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {DEPARTMENT_PILLARS.map((pillar) => {
              const active = pillar === activePillar
              return (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => setActivePillar(pillar)}
                  className={`relative min-h-[40px] px-4 py-2 rounded-full font-sans-ui text-xs font-semibold transition-colors cursor-pointer border ${
                    active
                      ? 'text-[#FAF7F2] border-[#5B0E24]'
                      : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/25 hover:border-[#5B0E24]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dept-filter-pill"
                      transition={{ duration: 0.25, ease: UI_EASE }}
                      className="absolute inset-0 rounded-full bg-[#5B0E24]"
                    />
                  )}
                  <span className="relative z-10">{pillar}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3D Tilt Pointer-Interactive Garment Cards with Royal Arched Framing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredGarments.map((item) => {
            const mode = cardModes[item.id] || 'rtw'
            const price = mode === 'rtw' ? item.rtwPrice : item.bespokePrice

            return (
              <Tilt3DCard key={item.id} intensity={7}>
                <article className="bg-[#F2ECE1] editorial-border h-full flex flex-col justify-between card-3d-shadow">
                  {/* Exotic Burgundy Velvet Arch Frame (Zero Overlaid Captions on Garment Photo) */}
                  <div className="relative h-88 px-5 pt-5 pb-0 overflow-hidden border-b-2 border-[#1C1618] velvet-damask-bg">
                    <ExoticFiligreeCorners variant="gold" size={18} />
                    <div
                      className="w-full h-full overflow-hidden border-t-2 border-x-2 border-[#C8A97E] shadow-xl bg-[#3A0716]"
                      style={{
                        borderTopLeftRadius: '140px',
                        borderTopRightRadius: '140px',
                      }}
                    >
                      <GarmentVisual
                        image={item.image}
                        alt={item.alt}
                        silhouette={item.silhouette}
                        tone={item.tone}
                        zoomOnHover
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between bg-[#F2ECE1]">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono-spec text-xs uppercase tracking-[0.12em] text-[#5B0E24]">
                          {item.tag}
                        </span>
                        <span className="font-mono-spec text-xs text-[#1C1618]/70">
                          {item.sku}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif-display text-2xl font-semibold text-[#1C1618] leading-snug">
                          {item.name}
                        </h3>
                        <div className="font-serif-display text-2xl font-bold text-[#5B0E24] tabular-nums shrink-0">
                          {formatNaira(price)}
                        </div>
                      </div>

                      <p className="font-sans-ui text-xs text-[#1C1618]/75 mt-1.5">
                        {item.fabric}
                      </p>

                      <div className="mt-3 py-1.5 px-2.5 bg-[#FAF7F2] border border-[#C8A97E]/60 font-mono-spec text-xs text-[#1C1618]/85">
                        {item.specs}
                      </div>
                    </div>

                    {/* Dual-Mode Switch + Quick Action */}
                    <div className="mt-5 space-y-2.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setCardModes((m) => ({ ...m, [item.id]: 'rtw' }))
                          }
                          className={`min-h-[38px] py-1.5 px-2 font-mono-spec text-xs uppercase border transition-colors cursor-pointer ${
                            mode === 'rtw'
                              ? 'bg-[#1C1618] text-[#FAF7F2] border-[#1C1618]'
                              : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/30 hover:border-[#5B0E24]'
                          }`}
                        >
                          RTW {formatNaira(item.rtwPrice)}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCardModes((m) => ({ ...m, [item.id]: 'bespoke' }))
                          }
                          className={`min-h-[38px] py-1.5 px-2 font-mono-spec text-xs uppercase border transition-colors cursor-pointer ${
                            mode === 'bespoke'
                              ? 'bg-[#5B0E24] text-[#FAF7F2] border-[#5B0E24]'
                              : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/30 hover:border-[#5B0E24]'
                          }`}
                        >
                          Sew {formatNaira(item.bespokePrice)}
                        </button>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        onClick={() =>
                          mode === 'rtw'
                            ? onAddToBag({
                                sku: item.sku,
                                purchaseMode: 'rtw',
                                size: 'L',
                                name: item.name,
                                mode: 'Ready-to-Wear • Size L',
                                price: item.rtwPrice,
                                silhouette: item.silhouette,
                                tone: item.tone,
                                image: item.image,
                              })
                            : onBookFitting(`${item.name} (${item.sku})`)
                        }
                        className="w-full min-h-[44px] py-2.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
                      >
                        {mode === 'rtw'
                          ? 'Add Size L to Cart'
                          : 'Book Custom Measurement'}
                      </motion.button>
                    </div>
                  </div>
                </article>
              </Tilt3DCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default React.memo(CatalogSection)
