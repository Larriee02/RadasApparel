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
  GarmentVisual,
} from './AtelierVisuals'

const EASE_ENTER = [0.22, 1, 0.36, 1]
const EASE_UI = [0.2, 0.8, 0.2, 1]

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
      {/* Main Center Plane Portrait Frame */}
      <button
        type="button"
        onMouseEnter={() => onHover(card)}
        onFocus={() => onHover(card)}
        onClick={() => onSelect(card)}
        className={`w-full h-full rounded-sm overflow-hidden border cursor-pointer block transition-colors duration-150 ${
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
export function OrbitHero({ onOpenGalleryOutfit }) {
  const reduceMotion = useReducedMotion()
  const [activeCard, setActiveCard] = useState(ORBIT_CARDS[0])

  const springCfg = { stiffness: 190, damping: 24, mass: 0.35 }
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, springCfg)
  const py = useSpring(rawY, springCfg)

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
      className="relative house-hero text-[#FAF7F2] py-3.5 sm:py-5 md:py-6 md:min-h-[590px] md:h-[calc(100svh-68px)] md:max-h-[710px] overflow-hidden border-b border-[#C8A97E]/40 flex flex-col justify-between"
    >
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
                <button
                  type="button"
                  onClick={() => handleCardSelect(card)}
                  className={`w-full h-full rounded-sm overflow-hidden border cursor-pointer block ${
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
        <div className="relative z-20 w-[182px] h-[182px] sm:w-[300px] sm:h-[300px] md:w-full md:h-auto md:max-w-[440px] mx-auto text-center px-3 py-3 sm:px-7 sm:py-6 md:px-8 md:py-6  flex flex-col items-center justify-center">
          <div className="relative z-10">
            <h1
              id="hero-orbit-h1"
              className="font-serif-display text-[1.55rem] sm:text-3xl md:text-[3.8rem] font-medium text-[#FAF7F2] leading-[1.02] md:leading-[0.96] tracking-[-0.02em]"
            >
              <MaskLine delay={0} reduceMotion={reduceMotion}>
                Menswear,
              </MaskLine>
              <span className="italic">
                <MaskLine delay={0.08} reduceMotion={reduceMotion}>
                  made to measure.
                </MaskLine>
              </span>
            </h1>
            <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
              <motion.button
                type="button"
                onClick={() => scrollToSection('curved-wall')}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { y: 1, scale: 0.985 }}
                transition={{ duration: 0.12, ease: EASE_UI }}
                className="px-2.5 sm:px-5 min-h-[28px] sm:min-h-[44px] rounded-full bg-[#FAF7F2] hover:bg-white text-[#5B0E24] border border-[#C8A97E]/50 font-sans-ui text-[9px] sm:text-xs font-semibold uppercase tracking-[0.05em] sm:tracking-[0.1em] shadow-md transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Lookbook
              </motion.button>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
