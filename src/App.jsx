import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import {
  ATELIER_CHAPTERS,
  CURVED_GALLERY_ITEMS,
  SIGNATURE_BENTO,
} from './data/raddasData'
import {
  DEFAULT_COOKIE_PREFS,
  DEFAULT_FITTING_GARMENT,
} from './constants/storageKeys'
import {
  readStoredCartItems,
  readStoredCookiePrefs,
  readStoredTapeMeasurements,
  writeStoredCartItems,
  writeStoredCookiePrefs,
  writeStoredTapeMeasurements,
} from './services/storageService'
import { OrbitHero } from './components/HeroTemplates'
import HeaderNavbar from './components/layout/HeaderNavbar'
import AtelierFooter from './components/layout/AtelierFooter'
import {
  CookieConsentPopup,
  ScrollToTopButton,
} from './components/layout/FloatingControls'
import CartDrawer from './components/modals/CartDrawer'
import BespokeFittingModal from './components/modals/BespokeFittingModal'
import SignatureBentoSection from './components/sections/SignatureBentoSection'
import CatalogSection from './components/sections/CatalogSection'
import CuttingTableSection from './components/sections/CuttingTableSection'
import CurvedLookbookSection from './components/sections/CurvedLookbookSection'
import MaterialsSection from './components/sections/MaterialsSection'
import AboutSection from './components/sections/AboutSection'
import ContactSection from './components/sections/ContactSection'
import GalleryPage from './components/pages/GalleryPage'

export default function App() {
  const shouldReduceMotion = useReducedMotion()

  const initialCookiePrefs = useMemo(() => readStoredCookiePrefs(), [])

  // Cookie consent pop-up state
  const [cookiePrefs, setCookiePrefs] = useState(
    () => initialCookiePrefs || DEFAULT_COOKIE_PREFS
  )
  const [cookiesSaved, setCookiesSaved] = useState(() => Boolean(initialCookiePrefs))

  // Client custom tape profile (shared between Section 01 and Fitting Modal)
  const [measurements, setMeasurements] = useState(() =>
    readStoredTapeMeasurements(
      SIGNATURE_BENTO.defaultMeasurements,
      initialCookiePrefs?.measurements !== false
    )
  )

  // Page view & lookbook -> gallery selection
  const [activePage, setActivePage] = useState('home')
  const [selectedOutfitId, setSelectedOutfitId] = useState(CURVED_GALLERY_ITEMS[0].id)
  const [activeChapterIdx, setActiveChapterIdx] = useState(0)

  // Shopping Bag & Fitting Commission Modal
  const [bagItems, setBagItems] = useState(() => readStoredCartItems())
  const [bagOpen, setBagOpen] = useState(false)
  const [bespokeModalOpen, setBespokeModalOpen] = useState(false)
  const [bespokeGarmentLabel, setBespokeGarmentLabel] = useState(DEFAULT_FITTING_GARMENT)

  // Persist shopping bag state
  useEffect(() => {
    writeStoredCartItems(bagItems)
  }, [bagItems])

  // Persist custom tape profile when consent is granted
  useEffect(() => {
    writeStoredTapeMeasurements(measurements, cookiePrefs.measurements)
  }, [measurements, cookiePrefs.measurements])

  const persistCookiePreferences = useCallback((nextPrefs) => {
    const payload = writeStoredCookiePrefs(nextPrefs)
    setCookiePrefs(payload)
    setCookiesSaved(true)
  }, [])

  const currentChapter = ATELIER_CHAPTERS[activeChapterIdx] || ATELIER_CHAPTERS[0]

  const bagTotal = useMemo(
    () => bagItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [bagItems]
  )

  const addToBag = useCallback((item) => {
    setBagItems((prev) => [
      ...prev,
      { ...item, uid: `${item.sku}-${Date.now()}-${Math.random()}` },
    ])
    setBagOpen(true)
  }, [])

  const removeFromBag = useCallback((uid) => {
    setBagItems((prev) => prev.filter((i) => i.uid !== uid))
  }, [])

  const openBespokeWithGarment = useCallback((garmentLabel) => {
    if (typeof garmentLabel === 'string' && garmentLabel.trim()) {
      setBespokeGarmentLabel(garmentLabel)
    }
    setBespokeModalOpen(true)
  }, [])

  const openOutfitInGallery = useCallback((outfitId) => {
    setSelectedOutfitId(outfitId)
    setActivePage('gallery')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  const openOutfitByCode = useCallback(
    (skuCode) => {
      const match = CURVED_GALLERY_ITEMS.find((o) => o.sku === skuCode)
      openOutfitInGallery(match ? match.id : CURVED_GALLERY_ITEMS[0].id)
    },
    [openOutfitInGallery]
  )

  const navigateHomeSection = useCallback(
    (sectionId) => {
      if (activePage !== 'home') {
        setActivePage('home')
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 60)
        return
      }
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    [activePage]
  )

  const openPage = useCallback((pageId) => {
    setActivePage(pageId)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  const handleNavClick = useCallback(
    (navId) => {
      if (navId === 'gallery') {
        openOutfitInGallery(selectedOutfitId)
        return
      }
      if (navId === 'about' || navId === 'contact' || navId === 'home') {
        openPage(navId)
        return
      }
      navigateHomeSection(navId)
    },
    [selectedOutfitId, openOutfitInGallery, openPage, navigateHomeSection]
  )

  const handleProceedFromBag = useCallback(() => {
    setBagOpen(false)
    openBespokeWithGarment(`${bagItems.length} Menswear Piece(s)`)
  }, [bagItems.length, openBespokeWithGarment])

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-[#FAF7F2] text-[#1C1618] overflow-x-clip">
        <HeaderNavbar
          activePage={activePage}
          bagCount={bagItems.length}
          shouldReduceMotion={shouldReduceMotion}
          onOpenPage={openPage}
          onNavClick={handleNavClick}
          onBookFitting={openBespokeWithGarment}
          onOpenBag={() => setBagOpen(true)}
        />

        <main id="main-content">
          {activePage === 'about' ? (
            <div className="bg-[#FAF7F2] text-[#1C1618]">
              <div className="bg-[#F2ECE1] border-b border-[#C8A97E]/60 py-5 sm:py-6">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => openPage('home')}
                      className="min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF7F2] border border-[#1C1618] hover:bg-[#1C1618] hover:text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      &larr; Back to Home
                    </button>
                    <div>
                      <span className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#5B0E24] block">
                        Radas Apparel &bull; Lagos &amp; London Workrooms
                      </span>
                      <h1
                        id="about-page-title"
                        className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#5B0E24] leading-tight"
                      >
                        About Radas Apparel
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openPage('contact')}
                      className="min-h-[40px] px-4 py-2 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Contact Salons &rarr;
                    </button>
                  </div>
                </div>
              </div>

              <AboutSection
                isStandalone
                onBookFitting={openBespokeWithGarment}
                onOpenPage={openPage}
              />
              <CuttingTableSection
                activeChapterIdx={activeChapterIdx}
                currentChapter={currentChapter}
                onSelectChapter={setActiveChapterIdx}
                onBookFitting={openBespokeWithGarment}
                shouldReduceMotion={shouldReduceMotion}
              />
              <MaterialsSection />
            </div>
          ) : activePage === 'contact' ? (
            <div className="bg-[#FAF7F2] text-[#1C1618] pb-10">
              <div className="bg-[#F2ECE1] border-b border-[#C8A97E]/60 py-5 sm:py-6">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => openPage('home')}
                      className="min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF7F2] border border-[#1C1618] hover:bg-[#1C1618] hover:text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      &larr; Back to Home
                    </button>
                    <div>
                      <span className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#5B0E24] block">
                        Radas Apparel &bull; Direct Concierge &amp; Salons
                      </span>
                      <h1
                        id="contact-page-title"
                        className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#5B0E24] leading-tight"
                      >
                        Visit Our Salons or Message the Workroom
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openBespokeWithGarment()}
                      className="min-h-[40px] px-4 py-2 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book Private Fitting
                    </button>
                  </div>
                </div>
              </div>

              <ContactSection isStandalone shouldReduceMotion={shouldReduceMotion} />
            </div>
          ) : activePage === 'gallery' ? (
            <GalleryPage
              selectedOutfitId={selectedOutfitId}
              shouldReduceMotion={shouldReduceMotion}
              onSelectOutfit={setSelectedOutfitId}
              onBackToLookbook={() => navigateHomeSection('curved-wall')}
              onAddToBag={addToBag}
              onBookFitting={openBespokeWithGarment}
            />
          ) : (
            <>
              <OrbitHero
                onOpenBespoke={openBespokeWithGarment}
                onOpenGalleryOutfit={openOutfitByCode}
              />

              <SignatureBentoSection
                measurements={measurements}
                onChangeMeasurements={setMeasurements}
                shouldReduceMotion={shouldReduceMotion}
                onAddToBag={addToBag}
                onBookFitting={openBespokeWithGarment}
              />

              <CatalogSection
                shouldReduceMotion={shouldReduceMotion}
                onAddToBag={addToBag}
                onBookFitting={openBespokeWithGarment}
              />

              <CuttingTableSection
                activeChapterIdx={activeChapterIdx}
                currentChapter={currentChapter}
                onSelectChapter={setActiveChapterIdx}
                onBookFitting={openBespokeWithGarment}
                shouldReduceMotion={shouldReduceMotion}
              />

              <CurvedLookbookSection
                shouldReduceMotion={shouldReduceMotion}
                onOpenOutfitInGallery={openOutfitInGallery}
              />

              <MaterialsSection />

              <AboutSection
                onBookFitting={openBespokeWithGarment}
                onOpenPage={openPage}
              />

              <ContactSection shouldReduceMotion={shouldReduceMotion} />
            </>
          )}
        </main>

        <AtelierFooter onBookFitting={openBespokeWithGarment} />

        <CartDrawer
          open={bagOpen}
          bagItems={bagItems}
          bagTotal={bagTotal}
          shouldReduceMotion={shouldReduceMotion}
          onClose={() => setBagOpen(false)}
          onRemoveItem={removeFromBag}
          onProceedToBooking={handleProceedFromBag}
        />

        <BespokeFittingModal
          open={bespokeModalOpen}
          initialGarment={bespokeGarmentLabel}
          measurements={measurements}
          shouldReduceMotion={shouldReduceMotion}
          onClose={() => setBespokeModalOpen(false)}
        />

        <CookieConsentPopup
          cookiesSaved={cookiesSaved}
          cookiePrefs={cookiePrefs}
          onChangePrefs={setCookiePrefs}
          onPersist={persistCookiePreferences}
          shouldReduceMotion={shouldReduceMotion}
        />

        <ScrollToTopButton shouldReduceMotion={shouldReduceMotion} />
      </div>
    </MotionConfig>
  )
}
