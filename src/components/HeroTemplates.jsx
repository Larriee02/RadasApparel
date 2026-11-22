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
      style={{ x: cardX, y: cardY, offsetDistance: `${index * 100 / ORBIT_CARDS.length}%` }}
      transition={{
        opacity: { duration: 0.45, delay: 0.04 + index * 0.03 },
        scale: { duration: 0.2, ease: EASE_UI },
      }}
      className="orbit-portrait group absolute z-10 pointer-events-auto preserve-3d gpu-smooth"
    >
      {/* Main Center Plane Portrait Frame */}
      <button
        type="button"
        onMouseEnter={() => onHover(card)}
        onFocus={() => onHover(card)}
        onClick={() => onSelect(card)}
        className={`w-full h-full rounded-[clamp(12px,1.8vw,24px)] shadow-[0_5px_16px_-8px_#542b2240] overflow-hidden border cursor-pointer block transition-colors duration-150 ${
          isSelected
            ? 'border-[#C8A97E] ring-1 ring-[#5B0E24]/35'
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
      className="relative house-hero text-[#5B0E24] py-3.5 sm:py-5 md:py-6 md:min-h-[410px] md:h-[calc(100svh-84px)] md:max-h-[710px] overflow-hidden border-b border-[#C8A97E]/40 flex flex-col justify-between"
    >
      {/* Main 1280px 3D Spatial Orbit Stage */}
      <div className="relative flex-1 w-full max-w-[1280px] mx-auto px-0 sm:px-6 md:px-10 min-h-[420px] sm:min-h-[540px] md:min-h-0 flex items-center justify-center my-0.5 md:my-1 perspective-stage">
        <motion.div
          style={{
            rotateX: stageRotX,
            rotateY: stageRotY,
          }}
          className="absolute inset-0 pointer-events-none preserve-3d gpu-smooth"
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

        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 id="hero-orbit-h1" className="font-serif-display text-[clamp(1.85rem,5vw,4.2rem)] font-medium leading-tight tracking-[-0.035em]">
            <MaskLine reduceMotion={reduceMotion}>Radas Apparel</MaskLine>
          </h1>
          <motion.button
            type="button"
            aria-label="Explore lookbook"
            title="Explore lookbook"
            onClick={() => scrollToSection('curved-wall')}
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            className="mt-1 flex min-h-11 items-center justify-center gap-3 rounded-lg px-2 cursor-pointer before:h-px before:w-6 before:bg-[#c8a97e]/55 after:h-px after:w-6 after:bg-[#c8a97e]/55"
          >
            <img src="/monogram-gold.png" alt="" width="350" height="292" className="w-11 sm:w-14 h-auto" />
          </motion.button>
        </div>
      </div>

    </section>
  )
}
