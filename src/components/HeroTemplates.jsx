import React, { useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ORBIT_CARDS, formatNaira } from '../data/raddasData'
import {
  CoutureTailorSeal,
  GarmentVisual,
} from './AtelierVisuals'

const EASE_ENTER = [0.22, 1, 0.36, 1]
const EASE_UI = [0.2, 0.8, 0.2, 1]

const CLOCK_CODES = {
  'orb-1': '01H',
  'orb-2': '02H',
  'orb-3': '03H',
  'orb-4': '04H',
  'orb-5': '05H',
  'orb-6': '06H',
  'orb-7': '07H',
  'orb-8': '08H',
  'orb-9': '09H',
  'orb-10': '10H',
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function MaskLine({ children, delay = 0, reduceMotion }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={reduceMotion ? false : { y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.55, delay, ease: EASE_ENTER }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function OrbitParallaxCard({
  card,
  index,
  px,
  py,
  isSelected,
  reduceMotion,
  onHover,
  onSelect,
}) {
  const clockCode = CLOCK_CODES[card.id] || card.clock || '00H'
  const cardX = useTransform(px, (v) => (reduceMotion ? 0 : v * card.depth))
  const cardY = useTransform(py, (v) => (reduceMotion ? 0 : v * card.depth))

  return (
    <motion.div
      data-enter-media
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: isSelected && !reduceMotion ? 1.04 : 1,
      }}
      style={{ x: cardX, y: cardY }}
      transition={{
        opacity: { duration: 0.45, delay: 0.04 + index * 0.03 },
        scale: { duration: 0.2, ease: EASE_UI },
      }}
      className={`group absolute ${card.posClass} ${card.sizeClass} z-10 pointer-events-auto preserve-3d gpu-smooth`}
    >
      {/* Recessed 3D Plinth Plane (-16px Z) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-[14px] border border-[#C8A97E]/70 bg-[#3A0716]/85 shadow-xl"
        style={{ transform: 'translateZ(-16px)' }}
      />

      {card.hasBackCard && (
        <div
          className="absolute -inset-1 translate-x-3.5 translate-y-3.5 rounded-[12px] overflow-hidden opacity-85 border border-[#C8A97E]/60"
          style={{ transform: 'translateZ(-24px)' }}
        >
          <GarmentVisual
            silhouette="seal"
            tone={card.backTone || 'gold'}
            zoomOnHover={false}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Floating 3D Clock Coordinate Rim Tab (+20px Z) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-2.5 right-2.5 z-30 px-2 py-0.5 font-mono-spec text-[10px] font-semibold tracking-wider border shadow-md transition-colors duration-150 ${
          isSelected
            ? 'bg-[#C8A97E] text-[#1C1618] border-[#1C1618]'
            : 'bg-[#3A0716] text-[#C8A97E] border-[#C8A97E]/75'
        }`}
        style={{ transform: 'translateZ(20px)' }}
      >
        {clockCode}
      </span>

      {/* Main Center Plane Portrait Frame */}
      <button
        type="button"
        onMouseEnter={() => onHover(card)}
        onFocus={() => onHover(card)}
        onClick={() => onSelect(card)}
        className={`w-full h-full rounded-[14px] overflow-hidden border-2 card-3d-shadow cursor-pointer block transition-colors duration-150 ${
          isSelected
            ? 'border-[#C8A97E] ring-2 ring-[#5B0E24]/70'
            : 'border-[#FAF7F2] hover:border-[#C8A97E]'
        }`}
        title={`${card.title} (ready-to-wear ${formatNaira(card.rtwPrice)})`}
        aria-label={`${card.title}, ready-to-wear ${formatNaira(card.rtwPrice)}`}
      >
        <GarmentVisual
          image={card.image}
          alt={card.title}
          silhouette={card.silhouette}
          tone={card.tone}
          eager
          className="w-full h-full"
        />
      </button>
    </motion.div>
  )
}

/* ============================================================================
   EXOTIC 3D SPATIAL ORBIT FLOATING RING HERO (GPU 60fps Pointer Tracking)
   ============================================================================ */
export function OrbitHero({ onOpenBespoke, onOpenGalleryOutfit }) {
  const reduceMotion = useReducedMotion()
  const [activeCard, setActiveCard] = useState(ORBIT_CARDS[0])

  const springCfg = { stiffness: 190, damping: 24, mass: 0.35 }
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, springCfg)
  const py = useSpring(rawY, springCfg)

  const ringRotZ = useTransform(px, (v) => (reduceMotion ? -12 : v * 8 - 12))
  const ringRotX = useTransform(py, (v) => (reduceMotion ? 64 : 64 + v * 6))
  const stageRotX = useTransform(py, (v) => (reduceMotion ? 0 : -v * 4))
  const stageRotY = useTransform(px, (v) => (reduceMotion ? 0 : v * 5))

  const handleMouseMove = (e) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const handleTouchMove = (e) => {
    if (reduceMotion || !e.touches[0]) return
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.touches[0].clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.touches[0].clientY - rect.top) / rect.height - 0.5)
  }

  const handleCardSelect = (card) => {
    setActiveCard(card)
    if (onOpenGalleryOutfit) {
      onOpenGalleryOutfit(card.code)
      return
    }
    scrollToSection('collections')
  }

  return (
    <section
      data-enter
      aria-labelledby="hero-orbit-h1"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className="relative bg-[#ECE6DC] exotic-damask-bg text-[#1C1618] py-3.5 sm:py-5 md:py-6 md:min-h-[760px] md:h-[calc(100svh-68px)] md:max-h-[840px] overflow-hidden border-b-2 border-[#C8A97E]/60 flex flex-col justify-between"
    >
      {/* Warm Ambient Vignette Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(250, 247, 242, 0.72) 0%, rgba(236, 230, 220, 0.25) 55%, rgba(91, 14, 36, 0.08) 100%)',
        }}
      />

      {/* 3D Tilted Metallic Astrolabe / Armillary Sanctuary Rings (Visible on Smartphone & Desktop) */}
      <div
        aria-hidden="true"
        className="flex pointer-events-none absolute inset-0 items-center justify-center perspective-stage overflow-hidden"
      >
        <motion.div
          style={{
            rotateZ: ringRotZ,
            rotateX: ringRotX,
            boxShadow: 'inset 0 0 40px rgba(200, 169, 126, 0.16)',
          }}
          className="relative w-[290px] h-[290px] sm:w-[490px] sm:h-[490px] md:w-[760px] md:h-[760px] rounded-full border-2 border-[#C8A97E]/60 preserve-3d gpu-smooth"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-3.5 md:h-3.5 rotate-45 bg-[#C8A97E] border border-[#5B0E24]" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-3.5 md:h-3.5 rotate-45 bg-[#5B0E24] border border-[#C8A97E]" />
        </motion.div>

        <div
          className="absolute w-[355px] h-[355px] sm:w-[630px] sm:h-[630px] md:w-[980px] md:h-[980px] rounded-full border border-dashed border-[#5B0E24]/30"
          style={{ transform: 'rotateX(68deg) rotateZ(18deg)' }}
        />
      </div>

      {/* Radial Tailor-Chalk Geometry Rings */}
      <svg
        viewBox="0 0 1200 760"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="#5B0E24" strokeWidth="0.6" strokeDasharray="4 6">
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg) => (
            <line
              key={deg}
              x1="600"
              y1="380"
              x2={600 + 700 * Math.cos((deg * Math.PI) / 180)}
              y2={380 + 700 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg) => (
            <line
              key={`neg-${deg}`}
              x1="600"
              y1="380"
              x2={600 - 700 * Math.cos((deg * Math.PI) / 180)}
              y2={380 - 700 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}
          <ellipse cx="600" cy="380" rx="310" ry="185" fill="none" />
          <ellipse cx="600" cy="380" rx="455" ry="280" fill="none" />
        </g>
      </svg>

      {/* Main 1280px 3D Spatial Orbit Stage */}
      <div className="relative flex-1 w-full max-w-[1280px] mx-auto px-0 sm:px-6 md:px-10 min-h-[420px] sm:min-h-[540px] md:min-h-0 flex items-center justify-center my-0.5 md:my-1 perspective-stage">
        {/* 10 Mobile & Small-Tablet 3D Orbit Sphere Plates (< md viewports) */}
        <motion.div
          style={{
            rotateX: stageRotX,
            rotateY: stageRotY,
          }}
          className="md:hidden absolute inset-0 pointer-events-none preserve-3d gpu-smooth"
        >
          {ORBIT_CARDS.map((card, i) => {
            const angleRad = ((-72 + i * 36) * Math.PI) / 180
            const rxPct = 40.5
            const ryPct = 40.5
            const leftPct = 50 + rxPct * Math.cos(angleRad)
            const topPct = 50 + ryPct * Math.sin(angleRad)
            const isSelected = activeCard?.id === card.id
            const clockCode = CLOCK_CODES[card.id] || card.clock || '00H'

            return (
              <motion.div
                key={`mob-orb-${card.id}`}
                data-enter-media
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: isSelected && !reduceMotion ? 1.05 : 1,
                }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.03 * i },
                  scale: { duration: 0.2, ease: EASE_UI },
                }}
                style={{
                  left: `${leftPct.toFixed(2)}%`,
                  top: `${topPct.toFixed(2)}%`,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 w-[50px] h-[64px] sm:w-[76px] sm:h-[98px] z-10 pointer-events-auto preserve-3d gpu-smooth"
              >
                {/* Recessed 3D Plinth Plane */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-[10px] border border-[#C8A97E]/70 bg-[#3A0716]/85 shadow-lg"
                  style={{ transform: 'translateZ(-12px)' }}
                />
                {/* Floating Clock Tab */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-2 right-1 z-30 px-1 py-0.2 font-mono-spec text-[8px] sm:text-[9px] font-semibold border shadow-sm ${
                    isSelected
                      ? 'bg-[#C8A97E] text-[#1C1618] border-[#1C1618]'
                      : 'bg-[#3A0716] text-[#C8A97E] border-[#C8A97E]/75'
                  }`}
                  style={{ transform: 'translateZ(16px)' }}
                >
                  {clockCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCardSelect(card)}
                  className={`w-full h-full rounded-[10px] overflow-hidden border-2 card-3d-shadow cursor-pointer block ${
                    isSelected
                      ? 'border-[#C8A97E] ring-2 ring-[#5B0E24]/70'
                      : 'border-[#FAF7F2] hover:border-[#C8A97E]'
                  }`}
                  aria-label={`${card.title}, ready-to-wear ${formatNaira(card.rtwPrice)}`}
                >
                  <GarmentVisual
                    image={card.image}
                    alt={card.title}
                    silhouette={card.silhouette}
                    tone={card.tone}
                    eager
                    className="w-full h-full"
                  />
                </button>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 10 Desktop 3D Multi-Plane Orbit Plates */}
        <motion.div
          style={{
            rotateX: stageRotX,
            rotateY: stageRotY,
          }}
          className="hidden md:block absolute inset-x-6 lg:inset-x-10 inset-y-0 pointer-events-none preserve-3d gpu-smooth"
        >
          {ORBIT_CARDS.map((card, i) => (
            <OrbitParallaxCard
              key={card.id}
              card={card}
              index={i}
              px={px}
              py={py}
              isSelected={activeCard?.id === card.id}
              reduceMotion={reduceMotion}
              onHover={setActiveCard}
              onSelect={handleCardSelect}
            />
          ))}
        </motion.div>

        {/* Exotic Royal Medallion Centerpiece */}
        <div className="relative z-20 w-[182px] h-[182px] sm:w-[300px] sm:h-[300px] md:w-full md:h-auto md:max-w-[440px] mx-auto text-center px-3 py-3 sm:px-7 sm:py-6 md:px-8 md:py-6 rounded-full bg-[#FAF7F2]/94 backdrop-blur-sm border-2 gold-foil-border card-3d-shadow flex flex-col items-center justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 sm:inset-2.5 rounded-full border border-[#C8A97E]/45"
          />

          <div className="relative z-10">
            <div className="font-mono-spec text-[7.5px] sm:text-[11px] md:text-xs uppercase tracking-[0.08em] sm:tracking-[0.16em] text-[#5B0E24] mb-0.5 sm:mb-1">
              Men&apos;s Fashion &bull; From ₦320,000
            </div>
            <h1
              id="hero-orbit-h1"
              className="font-serif-display text-[1.02rem] sm:text-3xl md:text-[2.85rem] font-semibold text-[#5B0E24] leading-[1.02] md:leading-[0.96] tracking-[-0.02em]"
            >
              <MaskLine delay={0} reduceMotion={reduceMotion}>
                Menswear Cut Around
              </MaskLine>
              <span className="italic">
                <MaskLine delay={0.08} reduceMotion={reduceMotion}>
                  Your Exact Tape.
                </MaskLine>
              </span>
            </h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.16, ease: EASE_ENTER }}
              className="hidden sm:block font-sans-ui text-[11px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed text-[#1C1618]/85 max-w-[235px] md:max-w-[370px] mx-auto mt-2 sm:mt-3"
            >
              Custom-cut ceremonial Agbadas, Senator sets, and peak-lapel suiting tailored
              in Lagos and London alongside ready-to-wear drops.
            </motion.p>
            <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
              <motion.button
                type="button"
                onClick={() => scrollToSection('curved-wall')}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { y: 1, scale: 0.985 }}
                transition={{ duration: 0.12, ease: EASE_UI }}
                className="px-2.5 sm:px-5 min-h-[28px] sm:min-h-[44px] rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] border border-[#C8A97E]/50 font-sans-ui text-[9px] sm:text-xs font-semibold uppercase tracking-[0.05em] sm:tracking-[0.1em] shadow-md transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Lookbook
              </motion.button>
              <motion.button
                type="button"
                onClick={() =>
                  onOpenBespoke(`${activeCard.title} (${activeCard.code})`)
                }
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { y: 1, scale: 0.985 }}
                transition={{ duration: 0.12, ease: EASE_UI }}
                className="px-2.5 sm:px-5 min-h-[28px] sm:min-h-[44px] rounded-full border border-[#5B0E24] bg-[#FAF7F2] text-[#5B0E24] hover:bg-[#5B0E24] hover:text-[#FAF7F2] font-sans-ui text-[9px] sm:text-xs font-semibold uppercase tracking-[0.05em] sm:tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Fitting
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Orbit Benchmark & Active Plate Strip */}
      <div className="relative z-20 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-10 md:pr-28 pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[#1C1618]/80">
          10 Men&apos;s Outfits in 3D Orbit &bull; Tap Any Look
        </div>
        <button
          type="button"
          onClick={() => handleCardSelect(activeCard)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#C8A97E] hover:border-[#5B0E24] font-mono-spec text-[11px] sm:text-xs text-[#1C1618] shadow-sm transition-colors cursor-pointer max-w-full"
        >
          <CoutureTailorSeal
            size="sm"
            variant="wine"
            className="!w-5 !h-5 sm:!w-6 sm:!h-6 !border !shadow-none shrink-0"
            label="RADAS • ORBIT • "
          />
          <span className="text-[#5B0E24] font-semibold truncate">{activeCard.title}</span>
          <span className="text-[#1C1618]/45">&bull;</span>
          <span className="tabular-nums font-medium shrink-0">RTW {formatNaira(activeCard.rtwPrice)}</span>
        </button>
      </div>
    </section>
  )
}
