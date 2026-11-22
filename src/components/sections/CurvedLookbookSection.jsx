import React, { useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CURVED_GALLERY_ITEMS } from '../../data/raddasData'
import { GarmentVisual } from '../AtelierVisuals'

/**
 * GPU-composited panel inside the 3D Concave Gallery Wall (#curved-wall).
 * Mirrors the classic small-center / tall-angled-wing amphitheater curve
 * while gliding forward & backward cleanly on pointer movement.
 */
const CurvedLookbookPanel = React.memo(function CurvedLookbookPanel({
  item,
  index,
  smoothOffset,
  reduceMotion,
  onSelect,
}) {
  const panelTransform = useTransform(smoothOffset, (off) => {
    const activeOffset = reduceMotion ? 0 : off
    const d = index - (7.5 + activeOffset)
    const a = Math.abs(d)
    const sign = d < 0 ? -1 : 1
    const tx = sign * (70 * a + 10.6 * a * a)
    const tz = Math.min(140, -36 + a * a * 4.4)
    const rotY = -Math.max(-52, Math.min(52, d * 8.4))
    const scale = 0.5 + Math.pow(Math.min(a, 6.4) / 5.5, 1.42) * 1.48
    return `translate3d(${tx.toFixed(1)}px, 0px, ${tz.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`
  })

  const panelOpacity = useTransform(smoothOffset, (off) => {
    const activeOffset = reduceMotion ? 0 : off
    const a = Math.abs(index - (7.5 + activeOffset))
    if (a > 7.2) return 0
    if (a > 6.2) return Math.max(0.15, 1 - (a - 6.2))
    return 1
  })

  const panelZIndex = useTransform(smoothOffset, (off) => {
    const activeOffset = reduceMotion ? 0 : off
    const a = Math.abs(index - (7.5 + activeOffset))
    return Math.round(10 + a * 3)
  })

  return (
    <motion.div
      style={{
        transform: panelTransform,
        opacity: panelOpacity,
        zIndex: panelZIndex,
      }}
      className="absolute top-1/2 left-1/2 -ml-[61px] -mt-[83px] w-[122px] h-[166px] preserve-3d gpu-smooth"
    >
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className="group relative block w-full h-full overflow-hidden rounded-[8px] border border-[#C8A97E]/70 shadow-2xl cursor-pointer transition-colors hover:border-[#FAF7F2] hover:ring-2 hover:ring-[#C8A97E] focus-visible:ring-2 focus-visible:ring-[#C8A97E]"
        aria-label={`Open ${item.title} full outfit in gallery`}
      >
        <GarmentVisual
          image={item.image}
          alt={item.alt}
          silhouette={item.silhouette}
          tone={item.tone}
          zoomOnHover
          eager
          className="pointer-events-none w-full h-full"
        />
      </button>
    </motion.div>
  )
})

/**
 * Section 04 — 3D Concave Perspective Lookbook Wall (16 Outfits).
 * Pointer movement updates the spring without re-rendering the wall.
 */
function CurvedLookbookSection({ shouldReduceMotion, onOpenOutfitInGallery }) {
  const touchStartXRef = useRef(null)
  const touchStartOffsetRef = useRef(0)
  const lookbookOffset = useMotionValue(0)
  const smoothLookbookOffset = useSpring(lookbookOffset, {
    stiffness: 170,
    damping: 26,
    mass: 0.35,
  })

  const handleLookbookPointerMove = useCallback(
    (e) => {
      if (shouldReduceMotion) return
      const rect = e.currentTarget.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      lookbookOffset.set(nx * 6.8)
    },
    [shouldReduceMotion, lookbookOffset]
  )

  const handleLookbookTouchStart = useCallback(
    (e) => {
      if (shouldReduceMotion || !e.touches[0]) return
      touchStartXRef.current = e.touches[0].clientX
      touchStartOffsetRef.current = lookbookOffset.get()
    },
    [shouldReduceMotion, lookbookOffset]
  )

  const handleLookbookTouchMove = useCallback(
    (e) => {
      if (shouldReduceMotion || touchStartXRef.current === null || !e.touches[0]) return
      const dx = e.touches[0].clientX - touchStartXRef.current
      const nextOffset = Math.max(
        -3.8,
        Math.min(3.8, touchStartOffsetRef.current - dx / 52)
      )
      lookbookOffset.set(nextOffset)
    },
    [shouldReduceMotion, lookbookOffset]
  )

  return (
    <section
      id="curved-wall"
      aria-label="Lookbook"
      className="scroll-mt-32 md:scroll-mt-24 bg-[#5B0E24] text-[#FAF7F2] py-5 sm:py-7 md:py-9 overflow-hidden border-y-2 border-[#C8A97E]/55"
    >
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8">
        {/* 3D Concave Perspective Wall (16 Looks Gliding Forward & Backward) */}
        <div
          onMouseMove={handleLookbookPointerMove}
          onTouchStart={handleLookbookTouchStart}
          onTouchMove={handleLookbookTouchMove}
          className="relative w-full h-[190px] sm:h-[290px] md:h-[360px] lg:h-[400px] overflow-hidden cursor-pointer"
          style={{ perspective: '1200px' }}
        >
          <div className="relative w-full h-full scale-[0.42] sm:scale-[0.68] md:scale-[0.86] lg:scale-100 origin-center">
            {CURVED_GALLERY_ITEMS.map((item, idx) => (
              <CurvedLookbookPanel
                key={item.id}
                item={item}
                index={idx}
                smoothOffset={smoothLookbookOffset}
                reduceMotion={shouldReduceMotion}
                onSelect={onOpenOutfitInGallery}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(CurvedLookbookSection)
