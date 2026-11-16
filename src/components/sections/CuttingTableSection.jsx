import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ATELIER_CHAPTERS, formatNaira } from '../../data/raddasData'
import { ENTER_EASE, UI_EASE } from '../../constants/storageKeys'
import { ExoticFiligreeCorners, GarmentVisual } from '../AtelierVisuals'

/**
 * Section 03 — Three Stages at the Cutting Table interactive tailoring sequence.
 */
function CuttingTableSection({
  activeChapterIdx,
  currentChapter,
  onSelectChapter,
  onBookFitting,
  shouldReduceMotion,
}) {
  return (
    <section
      id="atelier-chapters"
      data-moment="photo-chapters"
      className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#C8A97E]/50 mb-8 sm:mb-10">
        <div>
          <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
            03 • From Bolt to Fitting: 14-Day Commission Process
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
            Three Stages at the{' '}
            <span className="italic">Cutting Table</span>
          </h2>
        </div>
        <span className="font-mono-spec text-xs text-[#1C1618]/80">
          Victoria Island &amp; Mayfair Tailoring Sequence
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {ATELIER_CHAPTERS.map((chap, idx) => {
              const isActive = idx === activeChapterIdx
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => onSelectChapter(idx)}
                  className={`relative w-full text-left p-5 border-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#1C1618] bg-[#5B0E24] text-[#FAF7F2]'
                      : 'border-[#C8A97E]/60 bg-[#F2ECE1] text-[#1C1618] hover:border-[#5B0E24]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span
                      className={`font-mono-spec text-xs uppercase tracking-[0.16em] ${
                        isActive ? 'text-[#C8A97E]' : 'text-[#5B0E24]'
                      }`}
                    >
                      Stage {chap.step}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="chapter-indicator"
                        transition={{ duration: 0.25, ease: UI_EASE }}
                        className="px-2.5 py-0.5 rounded-full bg-[#C8A97E] text-[#1C1618] font-mono-spec text-[11px] font-semibold"
                      >
                        Active Plate
                      </motion.span>
                    )}
                  </div>
                  <h3 className="font-serif-display text-2xl font-semibold leading-snug">
                    {chap.title}
                  </h3>
                  <p
                    className={`font-mono-spec text-xs mt-1.5 ${
                      isActive ? 'text-[#F2ECE1]/90' : 'text-[#1C1618]/75'
                    }`}
                  >
                    {chap.fact}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="bg-[#FAF7F2] editorial-border p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24]">
                Commission Starting From
              </div>
              <div className="font-serif-display text-3xl font-bold text-[#1C1618] tabular-nums">
                {formatNaira(currentChapter.startingPrice)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBookFitting(currentChapter.title)}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap"
            >
              Book Fitting
            </button>
          </div>
        </div>

        <div className="relative lg:col-span-7 bg-[#F2ECE1] editorial-border p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-4 sm:gap-5 card-3d-shadow">
          <ExoticFiligreeCorners variant="wine" size={18} />
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden border-2 border-[#C8A97E] rounded-t-[60px] sm:rounded-t-[80px] rounded-b-[4px] bg-[#3A0716] shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0.25, scale: 1.02 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0.25 }}
                transition={{ duration: 0.36, ease: ENTER_EASE }}
                className="w-full h-full"
              >
                <GarmentVisual
                  image={currentChapter.image}
                  alt={currentChapter.alt}
                  silhouette={currentChapter.silhouette}
                  tone={currentChapter.tone}
                  zoomOnHover
                  eager
                  className="w-full h-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentChapter.id}-copy`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: UI_EASE }}
              className="space-y-3"
            >
              <p className="font-sans-ui text-sm text-[#1C1618]/85 leading-relaxed">
                {currentChapter.copy}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentChapter.specs.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-[#FAF7F2] border border-[#C8A97E] font-mono-spec text-xs text-[#5B0E24]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default React.memo(CuttingTableSection)
