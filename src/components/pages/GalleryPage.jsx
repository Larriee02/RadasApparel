import React, { useMemo, useState } from 'react'
import {
  CURVED_GALLERY_ITEMS,
  DEPARTMENT_PILLARS,
  formatNaira,
} from '../../data/raddasData'
import { RTW_SIZES } from '../../constants/storageKeys'
import {
  Exploded3DGarmentStudio,
  GarmentVisual,
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

  function addLook() {
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

  return (
    <section aria-labelledby="gallery-page-title" className="outfit-edition">
      <header className="edition-navigation">
        <button onClick={onBackToLookbook}>← Back to lookbook</button>
        <div>
          <button aria-label="Previous outfit" onClick={() => stepGalleryOutfit(-1)}>←</button>
          <span>Look {selectedOutfit.id} of {CURVED_GALLERY_ITEMS.length}</span>
          <button aria-label="Next outfit" onClick={() => stepGalleryOutfit(1)}>→</button>
        </div>
      </header>
      <div id="gallery-spotlight" className="edition-spread">
        <div className="edition-plate">
          {galleryViewMode === '3d' ? (
            <Exploded3DGarmentStudio angleObj={selectedOutfit} mode="exploded"
              onModeChange={() => setGalleryViewMode('full')} rotY={galleryRotY} onRotYChange={setGalleryRotY} />
          ) : (
            <img src={selectedOutfit.image} alt={selectedOutfit.alt} className="edition-photo" />
          )}
          <div className="edition-caption">
            <span>{selectedOutfit.sku}</span>
            <button onClick={() => setGalleryViewMode(galleryViewMode === 'full' ? '3d' : 'full')}>
              {galleryViewMode === 'full' ? 'View in 3D' : 'View photograph'}
            </button>
          </div>
        </div>
        <div className="edition-order">
          <p className="edition-category">{selectedOutfit.pillar}</p>
          <h1 className="font-serif-display" id="gallery-page-title">{selectedOutfit.title}</h1>
          <p className="edition-fabric">{selectedOutfit.fabric}</p>
          <p className="edition-price">{formatNaira(galleryPurchaseMode === 'rtw' ? selectedOutfit.rtwPrice : selectedOutfit.bespokePrice)}</p>
          <div className="edition-options">
            {[['rtw', 'Ready-to-wear'], ['bespoke', 'Made to measure']].map(([mode, label]) => (
              <button key={mode} aria-pressed={mode === galleryPurchaseMode} onClick={() => setGalleryPurchaseMode(mode)}>{label}</button>
            ))}
          </div>
          {galleryPurchaseMode === 'rtw' && (
            <fieldset className="edition-sizes"><legend>Size</legend>
              {RTW_SIZES.map(size => (
                <button key={size} aria-pressed={size === galleryRtwSize} onClick={() => setGalleryRtwSize(size)}>{size}</button>
              ))}
            </fieldset>
          )}
          <button className="edition-add" onClick={addLook}>Add outfit to cart <span aria-hidden="true">→</span></button>
          <button className="edition-fitting" onClick={() => onBookFitting(`${selectedOutfit.title} (${selectedOutfit.sku})`)}>Book a fitting for this look</button>
          <details><summary>Cut &amp; construction</summary><p>{selectedOutfit.tailoringNote}</p><p>{selectedOutfit.specs}</p></details>
          <details><summary>Included pieces ({selectedOutfit.includedPieces.length})</summary>
            <ul>{selectedOutfit.includedPieces.map(piece => <li key={piece}>{piece}</li>)}</ul>
          </details>
        </div>
      </div>
      <section id="gallery-grid" className="edition-archive">
        <h2 className="font-serif-display">The outfit index</h2>
        <div className="edition-options">
          {DEPARTMENT_PILLARS.map(pillar => (
            <button key={pillar} aria-pressed={pillar === galleryFilter} onClick={() => setGalleryFilter(pillar)}>{pillar}</button>
          ))}
        </div>
        <div className="edition-index">
          {filteredGalleryOutfits.map(look => (
            <button key={look.id} aria-current={look.id === selectedOutfit.id || undefined} onClick={() => {
              onSelectOutfit(look.id)
              document.getElementById('gallery-spotlight')?.scrollIntoView({behavior: shouldReduceMotion ? 'instant' : 'smooth'})
            }}>
              <GarmentVisual image={look.image} alt={look.alt} silhouette={look.silhouette} tone={look.tone} className="aspect-[4/5]" />
              <strong className="font-serif-display">{look.title}</strong>
              <span>{formatNaira(look.rtwPrice)}</span>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}

export default React.memo(GalleryPage)
