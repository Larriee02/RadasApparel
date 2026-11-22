import React, { useCallback, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CURVED_GALLERY_ITEMS, formatNaira } from '../../data/raddasData'
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
  isFocused,
  reduceMotion,
  onFocus,
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
        zIndex: isFocused ? 40 : panelZIndex,
      }}
      className="absolute top-1/2 left-1/2 -ml-[61px] -mt-[83px] w-[122px] h-[166px] preserve-3d gpu-smooth"
    >
      <button
        type="button"
        onMouseEnter={() => onFocus(item.id)}
        onFocus={() => onFocus(item.id)}
        onClick={() => onSelect(item.id)}
        className={`group relative w-full h-full rounded-[8px] overflow-hidden shadow-2xl cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-2.5 hover:scale-[1.06] hover:brightness-110 ${
          isFocused
            ? 'border-2 border-[#FAF7F2] ring-2 ring-[#C8A97E]'
            : 'border border-[#C8A97E]/70 hover:border-[#FAF7F2]'
        }`}
        title={`Open ${item.title} Full Outfit (ready-to-wear ${formatNaira(item.rtwPrice)})`}
        aria-label={`Open ${item.title} full outfit in gallery`}
      >
        <GarmentVisual
          image={item.image}
          alt={item.alt}
          silhouette={item.silhouette}
          tone={item.tone}
          zoomOnHover
          eager
          className="w-full h-full"
        />
      </button>
    </motion.div>
  )
})

/**
 * Section 04 — 3D Concave Perspective Lookbook Wall (16 Outfits).
 * Isolates pointer MotionValue glide & hover focus state so hovering never re-renders the App root.
 */
function CurvedLookbookSection({ shouldReduceMotion, onOpenOutfitInGallery }) {
  const [hoveredLookId, setHoveredLookId] = useState(CURVED_GALLERY_ITEMS[0].id)
  const touchStartXRef = useRef(null)
  const touchStartOffsetRef = useRef(0)
  const lookbookOffset = useMotionValue(0)
  const smoothLookbookOffset = useSpring(lookbookOffset, {
    stiffness: 170,
    damping: 26,
    mass: 0.35,
  })

  const hoveredLook =
    CURVED_GALLERY_ITEMS.find((item) => item.id === hoveredLookId) ||
    CURVED_GALLERY_ITEMS[0]

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
      className="scroll-mt-32 md:scroll-mt-24 bg-[#38232A] text-[#FAF7F2] py-12 sm:py-14 md:py-20 overflow-hidden border-y-2 border-[#C8A97E]/55"
    >
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8">
        {/* Top Center Headline nestled inside the upper hollow of the concave curve */}
        <div className="relative z-20 text-center max-w-lg mx-auto mb-2 md:mb-0 pointer-events-none">
          <h2 className="font-serif-display text-4xl md:text-6xl tracking-tight">
            The lookbook
          </h2>
        </div>

        {/* 3D Concave Perspective Wall (16 Looks Gliding Forward & Backward) */}
        <div
          onMouseMove={handleLookbookPointerMove}
          onTouchStart={handleLookbookTouchStart}
          onTouchMove={handleLookbookTouchMove}
          className="relative w-full h-[190px] sm:h-[290px] md:h-[360px] lg:h-[400px] overflow-hidden cursor-ew-resize"
          style={{ perspective: '1200px' }}
        >
          <div className="relative w-full h-full preserve-3d scale-[0.42] sm:scale-[0.68] md:scale-[0.86] lg:scale-100 origin-center">
            {CURVED_GALLERY_ITEMS.map((item, idx) => (
              <CurvedLookbookPanel
                key={item.id}
                item={item}
                index={idx}
                smoothOffset={smoothLookbookOffset}
                isFocused={hoveredLook.id === item.id}
                reduceMotion={shouldReduceMotion}
                onFocus={setHoveredLookId}
                onSelect={onOpenOutfitInGallery}
              />
            ))}
          </div>
        </div>

        {/* Bottom Caption, Interactive Glide Controls & Active Outfit Gateway */}
        <div className="relative z-20 text-center max-w-3xl mx-auto mt-2 md:mt-0 space-y-3 sm:space-y-4">
          <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/85 max-w-lg mx-auto leading-relaxed px-2">
            Browse the 16 looks. Select a photograph to see the full outfit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Forward / Backward Manual Stepper */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#1C1618]/65 border border-[#C8A97E]/50 shrink-0">
              <button
                type="button"
                onClick={() =>
                  lookbookOffset.set(Math.max(-3.6, lookbookOffset.get() - 1.6))
                }
                className="px-2.5 sm:px-3 py-1 rounded-full font-mono-spec text-[11px] sm:text-xs text-[#F2ECE1] hover:bg-[#5B0E24] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                &larr; Backward
              </button>
              <button
                type="button"
                onClick={() => lookbookOffset.set(0)}
                className="px-2.5 sm:px-3 py-1 rounded-full font-mono-spec text-[11px] sm:text-xs bg-[#C8A97E] text-[#1C1618] font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() =>
                  lookbookOffset.set(Math.min(3.6, lookbookOffset.get() + 1.6))
                }
                className="px-2.5 sm:px-3 py-1 rounded-full font-mono-spec text-[11px] sm:text-xs text-[#F2ECE1] hover:bg-[#5B0E24] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Forward &rarr;
              </button>
            </div>

            {/* Active Lookbook Hover Summary & Direct Gallery Link */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1618]/65 border border-[#C8A97E]/65 font-mono-spec text-[11px] sm:text-xs text-[#FAF7F2] max-w-full">
              <span className="text-[#C8A97E] uppercase">Focus:</span>
              <span className="font-semibold">{hoveredLook.title}</span>
              <span className="text-[#C8A97E]/60">&bull;</span>
              <span>{formatNaira(hoveredLook.rtwPrice)}</span>
            </div>

            <button
              type="button"
              onClick={() => onOpenOutfitInGallery(hoveredLook.id)}
              className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#C8A97E] hover:bg-[#FAF7F2] text-[#1C1618] font-sans-ui text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Full Outfit &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(CurvedLookbookSection)
