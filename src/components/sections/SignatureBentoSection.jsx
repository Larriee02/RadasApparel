import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SIGNATURE_BENTO, formatNaira } from '../../data/raddasData'
import { RTW_SIZES, UI_EASE } from '../../constants/storageKeys'
import {
  ExoticFiligreeCorners,
  Exploded3DGarmentStudio,
  GarmentVisual,
  MacroDetailPlate,
} from '../AtelierVisuals'

/**
 * Section 01 — Signature Menswear Bento Grid with 3D Exploded Stage,
 * Macro Craft Carousel, RTW size selection, and Tape measurement inputs.
 */
function SignatureBentoSection({
  measurements,
  onChangeMeasurements,
  shouldReduceMotion,
  onAddToBag,
  onBookFitting,
}) {
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [macroSlideIdx, setMacroSlideIdx] = useState(0)
  const [bentoMode, setBentoMode] = useState('rtw') // 'rtw' | 'bespoke'
  const [bento3DMode, setBento3DMode] = useState('exploded') // 'exploded' | 'portrait'
  const [bentoRotY, setBentoRotY] = useState(-16)
  const [selectedRtwSize, setSelectedRtwSize] = useState('L')

  const currentAngle = SIGNATURE_BENTO.angles[selectedAngleIdx]
  const currentMacro = SIGNATURE_BENTO.macroSlides[macroSlideIdx]

  return (
    <section
      id="signature-bento"
      className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#C8A97E]/50 mb-8 sm:mb-10">
        <div>
          <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
            01 • Signature Menswear Release
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
            Tailored Heritage, <span className="italic">Cut to Command.</span>
          </h2>
        </div>
        <div className="font-mono-spec text-[11px] sm:text-xs text-[#1C1618]/85 bg-[#F2ECE1] px-3 sm:px-4 py-2 sm:py-2.5 border border-[#1C1618]">
          SKU: {SIGNATURE_BENTO.sku} | CHEST: {measurements.chest} | SHOULDER:{' '}
          {measurements.shoulder} | SLEEVE: {measurements.sleeve}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN ON DESKTOP (Order 3 on Mobile): 3 Lookbook Angles + 5-Slide Macro Detail */}
        <div className="order-3 lg:order-1 lg:col-span-3 flex flex-col justify-between gap-5">
          <div className="relative bg-[#F2ECE1] editorial-border p-4 space-y-3">
            <ExoticFiligreeCorners variant="wine" size={16} />
            <div className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#5B0E24] flex items-center justify-between">
              <span>Angles 1–3</span>
              <span>3:4 Portrait</span>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5">
              {SIGNATURE_BENTO.angles.map((angle, idx) => {
                const active = idx === selectedAngleIdx
                return (
                  <button
                    key={angle.id}
                    type="button"
                    onClick={() => setSelectedAngleIdx(idx)}
                    className={`flex items-center gap-3 p-2 text-left transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#5B0E24] text-[#FAF7F2] border-[#1C1618]'
                        : 'bg-[#FAF7F2] text-[#1C1618] border-[#C8A97E]/50 hover:border-[#5B0E24]'
                    }`}
                  >
                    <div className="w-11 h-14 shrink-0 overflow-hidden border border-[#C8A97E]/40">
                      <GarmentVisual
                        image={angle.image}
                        alt={angle.alt}
                        silhouette={angle.silhouette}
                        tone={angle.tone}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="hidden lg:block min-w-0">
                      <div className="font-sans-ui text-xs font-semibold truncate">
                        {angle.label}
                      </div>
                      <div
                        className={`font-mono-spec text-[11px] truncate ${
                          active ? 'text-[#C8A97E]' : 'text-[#1C1618]/70'
                        }`}
                      >
                        {angle.silhouette.toUpperCase()} CUT
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5-Slide Fabric Macro Carousel */}
          <div className="bg-[#3A0716] text-[#FAF7F2] editorial-border p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#C8A97E]">
                Macro Craft Spec
              </span>
              <span className="font-mono-spec text-xs text-[#F2ECE1]/75">
                0{macroSlideIdx + 1} / 05
              </span>
            </div>

            <div className="h-32 w-full rounded-[4px] overflow-hidden border border-[#C8A97E]/40 mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMacro.id}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.22, ease: UI_EASE }}
                  className="w-full h-full"
                >
                  <MacroDetailPlate pattern={currentMacro.pattern} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div>
              <h3 className="font-serif-display text-xl font-medium text-[#FAF7F2] leading-snug">
                {currentMacro.title}
              </h3>
              <div className="font-mono-spec text-xs text-[#C8A97E] mt-1">
                {currentMacro.spec}
              </div>
              <p className="font-sans-ui text-xs text-[#F2ECE1]/85 mt-1.5 leading-relaxed">
                {currentMacro.detail}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#C8A97E]/25">
              <button
                type="button"
                onClick={() =>
                  setMacroSlideIdx((prev) =>
                    prev === 0
                      ? SIGNATURE_BENTO.macroSlides.length - 1
                      : prev - 1
                  )
                }
                className="min-h-[36px] px-3 py-1 border border-[#C8A97E]/50 text-xs font-mono-spec hover:bg-[#C8A97E] hover:text-[#1C1618] transition-colors cursor-pointer"
              >
                Prev
              </button>
              <div className="flex gap-1.5">
                {SIGNATURE_BENTO.macroSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Macro detail ${i + 1}`}
                    onClick={() => setMacroSlideIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                      i === macroSlideIdx ? 'bg-[#C8A97E]' : 'bg-[#FAF7F2]/30'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setMacroSlideIdx(
                    (prev) => (prev + 1) % SIGNATURE_BENTO.macroSlides.length
                  )
                }
                className="min-h-[36px] px-3 py-1 border border-[#C8A97E]/50 text-xs font-mono-spec hover:bg-[#C8A97E] hover:text-[#1C1618] transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN ON DESKTOP (Order 1 on Mobile): Interactive 3D Exploded Garment Studio */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col">
          <div className="flex-1 min-h-[430px] sm:min-h-[500px]">
            <Exploded3DGarmentStudio
              angleObj={currentAngle}
              mode={bento3DMode}
              onModeChange={setBento3DMode}
              rotY={bentoRotY}
              onRotYChange={setBentoRotY}
            />
          </div>
          <div className="mt-2.5 px-1 space-y-0.5">
            <div className="font-mono-spec text-xs text-[#5B0E24] font-medium">
              {currentAngle.label}
            </div>
            <div className="font-sans-ui text-xs text-[#1C1618]/75">
              {currentAngle.caption}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN ON DESKTOP (Order 2 on Mobile): Details, Mode Toggle & Naira Pricing */}
        <div className="order-2 lg:order-3 relative lg:col-span-4 bg-[#F2ECE1] editorial-border p-5 sm:p-6 md:p-7 flex flex-col justify-between card-3d-shadow">
          <ExoticFiligreeCorners variant="wine" size={18} />
          <div>
            <div className="inline-block px-3 py-1 bg-[#5B0E24] text-[#FAF7F2] font-mono-spec text-xs tracking-[0.12em] uppercase mb-3">
              {SIGNATURE_BENTO.badge}
            </div>
            <h3 className="font-serif-display text-3xl md:text-4xl font-semibold text-[#1C1618] leading-tight">
              {SIGNATURE_BENTO.title}
            </h3>
            <p className="font-sans-ui text-xs md:text-sm text-[#1C1618]/80 mt-2 leading-relaxed">
              {SIGNATURE_BENTO.subtitle}
            </p>
            <p className="font-mono-spec text-xs text-[#5B0E24] mt-2">
              {SIGNATURE_BENTO.fabric}
            </p>

            {/* Price + Lead Time */}
            <div className="mt-5 pt-4 border-t border-[#C8A97E]/50 flex items-baseline justify-between gap-4">
              <div>
                <span className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24] block">
                  {bentoMode === 'rtw'
                    ? 'Ready-to-Wear Edition'
                    : 'Made-to-Measure Edition'}
                </span>
                <span className="font-serif-display text-4xl font-bold text-[#5B0E24] tabular-nums">
                  {formatNaira(
                    bentoMode === 'rtw'
                      ? SIGNATURE_BENTO.rtwPrice
                      : SIGNATURE_BENTO.bespokePrice
                  )}
                </span>
              </div>
              <span className="font-mono-spec text-xs text-[#1C1618]/75 text-right max-w-[165px]">
                {bentoMode === 'rtw'
                  ? SIGNATURE_BENTO.leadTimeRTW
                  : SIGNATURE_BENTO.leadTimeBespoke}
              </span>
            </div>

            {/* Dual-Mode Toggle */}
            <div className="mt-6">
              <div className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#1C1618]/75 mb-2">
                Select Tailoring Mode
              </div>
              <div className="relative grid grid-cols-2 gap-1.5 p-1 bg-[#FAF7F2] border border-[#1C1618] rounded-full">
                {[
                  { id: 'rtw', label: 'Ready-to-Wear (S–3XL)' },
                  { id: 'bespoke', label: 'Sew to Measure' },
                ].map((opt) => {
                  const active = bentoMode === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBentoMode(opt.id)}
                      className={`relative py-2.5 px-3 rounded-full font-sans-ui text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'text-[#FAF7F2]'
                          : 'text-[#1C1618] hover:bg-[#F2ECE1]/70'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="bento-mode-pill"
                          transition={{ duration: 0.25, ease: UI_EASE }}
                          className="absolute inset-0 rounded-full bg-[#5B0E24]"
                        />
                      )}
                      <span className="relative z-10">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Size Grid or Bespoke Tape Inputs */}
            {bentoMode === 'rtw' ? (
              <div className="mt-5">
                <div className="flex justify-between font-mono-spec text-xs uppercase tracking-wider mb-2">
                  <span>Men&apos;s Standard Size</span>
                  <span className="text-[#5B0E24]">Selected: {selectedRtwSize}</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {RTW_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedRtwSize(sz)}
                      className={`min-h-[40px] py-2 font-mono-spec text-xs border transition-colors cursor-pointer ${
                        selectedRtwSize === sz
                          ? 'bg-[#1C1618] text-[#FAF7F2] border-[#1C1618]'
                          : 'bg-[#FAF7F2] text-[#1C1618] border-[#C8A97E]/60 hover:border-[#5B0E24]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 bg-[#FAF7F2] p-3.5 border border-[#C8A97E]">
                <div className="font-mono-spec text-xs uppercase tracking-[0.12em] text-[#5B0E24] mb-2.5">
                  Tape Measurements (Inches)
                </div>
                <p className="mb-3 text-xs text-[#1C1618]/80">
                  These measurements are prefilled when you open a fitting request.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(measurements).map(([key, val]) => (
                    <label key={key} className="block">
                      <span className="font-mono-spec text-xs uppercase text-[#1C1618]/75 block mb-1">
                        {key}
                      </span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          onChangeMeasurements((m) => ({
                            ...m,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-2 bg-[#F2ECE1] border border-[#1C1618]/40 font-mono-spec text-xs text-[#1C1618]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5">
            <motion.button
              type="button"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              onClick={() =>
                onAddToBag({
                  sku: SIGNATURE_BENTO.sku,
                  purchaseMode: bentoMode,
                  size: bentoMode === 'rtw' ? selectedRtwSize : null,
                  name: SIGNATURE_BENTO.title,
                  mode:
                    bentoMode === 'rtw'
                      ? `Ready-to-Wear • Size ${selectedRtwSize}`
                      : 'Custom Cut Commission',
                  price:
                    bentoMode === 'rtw'
                      ? SIGNATURE_BENTO.rtwPrice
                      : SIGNATURE_BENTO.bespokePrice,
                  silhouette: 'agbada',
                  tone: 'wine',
                  image: currentAngle.image,
                })
              }
              className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
            >
              {bentoMode === 'rtw'
                ? `Add Size ${selectedRtwSize} to Cart (${formatNaira(
                    SIGNATURE_BENTO.rtwPrice
                  )})`
                : `Commission Custom Cut (${formatNaira(
                    SIGNATURE_BENTO.bespokePrice
                  )})`}
            </motion.button>
            <button
              type="button"
              onClick={() =>
                onBookFitting(
                  `${SIGNATURE_BENTO.title} (${SIGNATURE_BENTO.sku})`
                )
              }
              className="w-full min-h-[44px] py-2.5 px-4 border border-[#1C1618] bg-transparent hover:bg-[#1C1618] hover:text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer"
            >
              Schedule Private Fitting
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(SignatureBentoSection)
