import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CURVED_GALLERY_ITEMS,
  DEPARTMENT_PILLARS,
  formatNaira,
} from '../../data/raddasData'
import { RTW_SIZES } from '../../constants/storageKeys'
import {
  ExoticFiligreeCorners,
  Exploded3DGarmentStudio,
  GarmentVisual,
  Tilt3DCard,
} from '../AtelierVisuals'

/**
 * Full-Outfit Gallery Page connected directly to the 3D Lookbook panels.
 * Localizes filter, 3D stage toggle, size selector, and rotation slider state.
 */
function GalleryPage({
  selectedOutfitId,
  shouldReduceMotion,
  onSelectOutfit,
  onBackToLookbook,
  onAddToBag,
  onBookFitting,
}) {
  const [galleryFilter, setGalleryFilter] = useState('All')
  const [galleryViewMode, setGalleryViewMode] = useState('full') // 'full' | '3d'
  const [galleryPurchaseMode, setGalleryPurchaseMode] = useState('rtw') // 'rtw' | 'bespoke'
  const [galleryRtwSize, setGalleryRtwSize] = useState('L')
  const [galleryRotY, setGalleryRotY] = useState(-14)

  const selectedOutfit = useMemo(
    () =>
      CURVED_GALLERY_ITEMS.find((item) => item.id === selectedOutfitId) ||
      CURVED_GALLERY_ITEMS[0],
    [selectedOutfitId]
  )

  const filteredGalleryOutfits = useMemo(
    () =>
      galleryFilter === 'All'
        ? CURVED_GALLERY_ITEMS
        : CURVED_GALLERY_ITEMS.filter((o) => o.pillar === galleryFilter),
    [galleryFilter]
  )

  const stepGalleryOutfit = (delta) => {
    const idx = CURVED_GALLERY_ITEMS.findIndex((o) => o.id === selectedOutfit.id)
    const nextIdx =
      (idx + delta + CURVED_GALLERY_ITEMS.length) % CURVED_GALLERY_ITEMS.length
    onSelectOutfit(CURVED_GALLERY_ITEMS[nextIdx].id)
  }

  return (
    <section
      aria-labelledby="gallery-page-title"
      className="bg-[#FAF7F2] text-[#1C1618] pb-20"
    >
      {/* Top Sub-Header & Filter Strip */}
      <div className="bg-[#F2ECE1] border-b border-[#C8A97E]/60 py-5 sm:py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onBackToLookbook}
              className="min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF7F2] border border-[#1C1618] hover:bg-[#1C1618] hover:text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              &larr; Back to Lookbook
            </button>
            <div>
              <span className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#5B0E24] block">
                Radas Apparel &bull; Outfit Gallery
              </span>
              <h1
                id="gallery-page-title"
                className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#5B0E24] leading-tight"
              >
                Complete Silhouette Dossiers (16 Looks)
              </h1>
            </div>
          </div>

          {/* Prev / Next Outfit Stepping */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 shrink-0">
            <button
              type="button"
              onClick={() => stepGalleryOutfit(-1)}
              className="min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full border border-[#5B0E24] text-[#5B0E24] hover:bg-[#5B0E24] hover:text-[#FAF7F2] font-mono-spec text-xs transition-colors cursor-pointer"
            >
              &larr; Prev Outfit
            </button>
            <span className="font-mono-spec text-xs px-2 sm:px-3 text-[#1C1618]/80">
              Look {String(selectedOutfit.id).padStart(2, '0')} / 16
            </span>
            <button
              type="button"
              onClick={() => stepGalleryOutfit(1)}
              className="min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full border border-[#5B0E24] text-[#5B0E24] hover:bg-[#5B0E24] hover:text-[#FAF7F2] font-mono-spec text-xs transition-colors cursor-pointer"
            >
              Next Outfit &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Full-Outfit Spotlight (#gallery-spotlight) */}
      <div
        id="gallery-spotlight"
        className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left 6 Columns: Full Head-to-Toe Outfit Viewer & 3D Studio Toggle */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#5B0E24]">
                {selectedOutfit.sku} &bull; {selectedOutfit.pillar}
              </span>
              <div className="inline-flex rounded-full p-0.5 bg-[#F2ECE1] border border-[#1C1618]/30">
                {[
                  { id: 'full', label: 'Full Outfit View' },
                  { id: '3d', label: '3D Layer Stage' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setGalleryViewMode(tab.id)}
                    className={`px-3 py-1 rounded-full font-mono-spec text-xs transition-colors cursor-pointer ${
                      galleryViewMode === tab.id
                        ? 'bg-[#5B0E24] text-[#FAF7F2]'
                        : 'text-[#1C1618] hover:text-[#5B0E24]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {galleryViewMode === '3d' ? (
              <div className="flex-1 min-h-[430px] sm:min-h-[520px]">
                <Exploded3DGarmentStudio
                  angleObj={selectedOutfit}
                  mode="exploded"
                  onModeChange={() => setGalleryViewMode('full')}
                  rotY={galleryRotY}
                  onRotYChange={setGalleryRotY}
                />
              </div>
            ) : (
              <Tilt3DCard intensity={5}>
                <div className="relative h-[420px] sm:h-[580px] velvet-damask-bg editorial-border p-4 sm:p-5 pb-0 card-3d-shadow flex flex-col justify-end">
                  <ExoticFiligreeCorners variant="gold" size={20} />
                  <div
                    className="w-full h-full overflow-hidden border-t-2 border-x-2 border-[#C8A97E] shadow-2xl bg-[#2B0510]"
                    style={{
                      borderTopLeftRadius: '140px',
                      borderTopRightRadius: '140px',
                    }}
                  >
                    <GarmentVisual
                      image={selectedOutfit.image}
                      alt={selectedOutfit.alt}
                      silhouette={selectedOutfit.silhouette}
                      tone={selectedOutfit.tone}
                      fit="contain"
                      zoomOnHover
                      eager
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </Tilt3DCard>
            )}
          </div>

          {/* Right 6 Columns: Complete Outfit Breakdown, Included Pieces & Order Controls */}
          <div className="relative lg:col-span-6 bg-[#F2ECE1] editorial-border p-6 md:p-8 card-3d-shadow flex flex-col justify-between">
            <ExoticFiligreeCorners variant="wine" size={20} />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-[#5B0E24] text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-[0.14em] mb-3">
                Full Ensemble Breakdown &bull; {selectedOutfit.sku}
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1C1618] leading-tight">
                {selectedOutfit.title}
              </h2>
              <p className="font-mono-spec text-xs text-[#5B0E24] mt-2">
                {selectedOutfit.fabric}
              </p>
              <p className="font-sans-ui text-sm text-[#1C1618]/85 mt-3 leading-relaxed">
                {selectedOutfit.tailoringNote}
              </p>

              {/* Included Pieces Checklist */}
              <div className="mt-5 p-4 bg-[#FAF7F2] border border-[#C8A97E]">
                <div className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#5B0E24] mb-2.5">
                  Garment Pieces Included in Full Outfit
                </div>
                <ul className="space-y-1.5 font-sans-ui text-xs sm:text-sm text-[#1C1618]/90">
                  {selectedOutfit.includedPieces.map((piece) => (
                    <li key={piece} className="flex items-start gap-2">
                      <span className="text-[#5B0E24] font-bold">&bull;</span>
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2.5 border-t border-[#C8A97E]/40 font-mono-spec text-xs text-[#1C1618]/75">
                  {selectedOutfit.specs}
                </div>
              </div>

              {/* Pricing & Workflow Mode Toggle */}
              <div className="mt-6 pt-4 border-t border-[#C8A97E]/50 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24] block">
                    {galleryPurchaseMode === 'rtw'
                      ? 'Ready-to-Wear Full Set'
                      : 'Custom Cut to Your Tape'}
                  </span>
                  <span className="font-serif-display text-4xl font-bold text-[#5B0E24] tabular-nums">
                    {formatNaira(
                      galleryPurchaseMode === 'rtw'
                        ? selectedOutfit.rtwPrice
                        : selectedOutfit.bespokePrice
                    )}
                  </span>
                </div>

                <div className="inline-flex rounded-full p-1 bg-[#FAF7F2] border border-[#1C1618]">
                  {[
                    { id: 'rtw', label: 'RTW (S–3XL)' },
                    { id: 'bespoke', label: 'Sew to Measure' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGalleryPurchaseMode(m.id)}
                      className={`px-3.5 py-1.5 rounded-full font-sans-ui text-xs font-semibold transition-colors cursor-pointer ${
                        galleryPurchaseMode === m.id
                          ? 'bg-[#5B0E24] text-[#FAF7F2]'
                          : 'text-[#1C1618]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {galleryPurchaseMode === 'rtw' && (
                <div className="mt-4">
                  <div className="flex justify-between font-mono-spec text-xs uppercase tracking-wider mb-2">
                    <span>Select Standard Size</span>
                    <span className="text-[#5B0E24]">Selected: {galleryRtwSize}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {RTW_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setGalleryRtwSize(sz)}
                        className={`min-h-[40px] py-2 font-mono-spec text-xs border transition-colors cursor-pointer ${
                          galleryRtwSize === sz
                            ? 'bg-[#1C1618] text-[#FAF7F2] border-[#1C1618]'
                            : 'bg-[#FAF7F2] text-[#1C1618] border-[#C8A97E]/60 hover:border-[#5B0E24]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                onClick={() =>
                  onAddToBag({
                    sku: selectedOutfit.sku,
                    purchaseMode: galleryPurchaseMode,
                    size: galleryPurchaseMode === 'rtw' ? galleryRtwSize : null,
                    name: selectedOutfit.title,
                    mode:
                      galleryPurchaseMode === 'rtw'
                        ? `Full Outfit RTW • Size ${galleryRtwSize}`
                        : 'Full Outfit • Custom Cut Commission',
                    price:
                      galleryPurchaseMode === 'rtw'
                        ? selectedOutfit.rtwPrice
                        : selectedOutfit.bespokePrice,
                    silhouette: selectedOutfit.silhouette,
                    tone: selectedOutfit.tone,
                    image: selectedOutfit.image,
                  })
                }
                className="min-h-[46px] py-3 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
              >
                Add Full Outfit to Cart
              </motion.button>
              <button
                type="button"
                onClick={() =>
                  onBookFitting(`${selectedOutfit.title} (${selectedOutfit.sku})`)
                }
                className="min-h-[46px] py-3 px-4 border border-[#1C1618] bg-[#FAF7F2] hover:bg-[#1C1618] hover:text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer"
              >
                Book Fitting for Look
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filterable 16-Outfit Archive Grid (#gallery-grid) */}
      <div
        id="gallery-grid"
        className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pt-8 border-t border-[#C8A97E]/50"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#5B0E24]">
            Browse All {CURVED_GALLERY_ITEMS.length} Lookbook Outfits
          </h3>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENT_PILLARS.map((pillar) => {
              const active = pillar === galleryFilter
              return (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => setGalleryFilter(pillar)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-full font-sans-ui text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#5B0E24] text-[#FAF7F2] border-[#5B0E24]'
                      : 'bg-[#F2ECE1] text-[#1C1618] border-[#1C1618]/25 hover:border-[#5B0E24]'
                  }`}
                >
                  {pillar}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredGalleryOutfits.map((look) => {
            const isCurrent = look.id === selectedOutfit.id
            return (
              <Tilt3DCard key={look.id} intensity={6}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectOutfit(look.id)
                    const spot = document.getElementById('gallery-spotlight')
                    if (spot) spot.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left bg-[#F2ECE1] editorial-border h-full flex flex-col justify-between card-3d-shadow cursor-pointer transition-colors ${
                    isCurrent ? 'ring-2 ring-[#5B0E24]' : ''
                  }`}
                >
                  <div className="relative h-52 sm:h-72 px-2.5 sm:px-4 pt-3 sm:pt-4 pb-0 velvet-damask-bg border-b-2 border-[#1C1618]">
                    <ExoticFiligreeCorners variant="gold" size={12} />
                    <div
                      className="w-full h-full overflow-hidden border-t-2 border-x-2 border-[#C8A97E] bg-[#3A0716]"
                      style={{
                        borderTopLeftRadius: '100px',
                        borderTopRightRadius: '100px',
                      }}
                    >
                      <GarmentVisual
                        image={look.image}
                        alt={look.alt}
                        silhouette={look.silhouette}
                        tone={look.tone}
                        zoomOnHover
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-4 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono-spec text-[10px] sm:text-xs text-[#5B0E24]">
                      <span>{look.sku}</span>
                      <span className="font-semibold">{formatNaira(look.rtwPrice)}</span>
                    </div>
                    <div className="font-serif-display text-base sm:text-xl font-semibold text-[#1C1618] leading-snug line-clamp-2">
                      {look.title}
                    </div>
                    <div className="font-mono-spec text-[10px] sm:text-[11px] text-[#1C1618]/70">
                      {look.includedPieces.length} Pieces Included &rarr;
                    </div>
                  </div>
                </button>
              </Tilt3DCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default React.memo(GalleryPage)
