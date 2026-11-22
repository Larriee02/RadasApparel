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
import { normalizeCartItem } from './services/cartService'
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
  const [savedCookiePrefs, setSavedCookiePrefs] = useState(initialCookiePrefs)
  const [cookiePromptOpen, setCookiePromptOpen] = useState(!initialCookiePrefs)

  // Client custom tape profile (shared between Section 01 and Fitting Modal)
  const [measurements, setMeasurements] = useState(() =>
    readStoredTapeMeasurements(
      SIGNATURE_BENTO.defaultMeasurements,
      initialCookiePrefs?.measurements === true
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

  // Check the stored preference before writing so revocation in another tab takes effect.
  useEffect(() => {
    const optedIn = readStoredCookiePrefs()?.measurements === true
    if (!optedIn || savedCookiePrefs?.measurements === true) {
      writeStoredTapeMeasurements(measurements, optedIn)
    }
  }, [measurements, savedCookiePrefs])

  const persistCookiePreferences = useCallback((nextPrefs) => {
    const payload = writeStoredCookiePrefs(nextPrefs)
    setCookiePrefs(payload)
    setSavedCookiePrefs(payload)
    setCookiePromptOpen(false)
  }, [])

  const openCookiePreferences = () => {
    setCookiePrefs(readStoredCookiePrefs() || DEFAULT_COOKIE_PREFS)
    setCookiePromptOpen(true)
  }

  const currentChapter = ATELIER_CHAPTERS[activeChapterIdx] || ATELIER_CHAPTERS[0]

  const bagTotal = useMemo(
    () => bagItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [bagItems]
  )

  const addToBag = useCallback((item) => {
    const uid = `${item.sku}-${Date.now()}-${Math.random()}`
    const normalized = normalizeCartItem({ ...item, uid })
    if (!normalized) return
    setBagItems((prev) => [...prev, normalized])
    setBagOpen(true)
  }, [])

  const removeFromBag = useCallback((uid) => {
    setBagItems((prev) => prev.filter((i) => i.uid !== uid))
  }, [])

  const openBespokeWithGarment = useCallback((garmentLabel) => {
    const label = typeof garmentLabel === 'string' && garmentLabel.trim()
    setBespokeGarmentLabel(label || DEFAULT_FITTING_GARMENT)
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

  const removeSubmittedItems = useCallback((submittedIds) => {
    const ids = new Set(submittedIds)
    setBagItems((items) => items.filter((item) => !ids.has(item.uid)))
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-[#FAF7F2] text-[#1C1618] overflow-x-clip">
        <HeaderNavbar
          activePage={activePage}
          bagCount={bagItems.length}
          onOpenOutfit={openOutfitInGallery}
          onOpenPage={openPage}
          onNavClick={handleNavClick}
          onBookFitting={openBespokeWithGarment}
          onOpenBag={() => setBagOpen(true)}
        />

        <main id="main-content">
          {activePage === 'about' ? (
            <div className="bg-[#FAF7F2] text-[#1C1618]">
              <header className="house-masthead">
                <div><h1>The house of Radas</h1><button onClick={() => openPage('contact')}>Contact our salons</button></div>
              </header>

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
              <header className="house-masthead">
                <div><h1>Salons & concierge</h1><button onClick={() => openBespokeWithGarment()}>Book a fitting</button></div>
              </header>

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
                onOpenGalleryOutfit={openOutfitByCode}
              />


              <CatalogSection
                shouldReduceMotion={shouldReduceMotion}
                onAddToBag={addToBag}
                onBookFitting={openBespokeWithGarment}
              />

              <details className="atelier-details">
                <summary>Signature garment &amp; custom measurements</summary>
              <SignatureBentoSection
                measurements={measurements}
                onChangeMeasurements={setMeasurements}
                shouldReduceMotion={shouldReduceMotion}
                onAddToBag={addToBag}
                onBookFitting={openBespokeWithGarment}
              />

              </details>
              <details className="atelier-details">
                <summary>Inside the atelier</summary>
              <CuttingTableSection
                activeChapterIdx={activeChapterIdx}
                currentChapter={currentChapter}
                onSelectChapter={setActiveChapterIdx}
                onBookFitting={openBespokeWithGarment}
                shouldReduceMotion={shouldReduceMotion}
              />

                <MaterialsSection />
              </details>
              <CurvedLookbookSection
                shouldReduceMotion={shouldReduceMotion}
                onOpenOutfitInGallery={openOutfitInGallery}
              />
            </>
          )}
        </main>

        <AtelierFooter
          onBookFitting={openBespokeWithGarment}
          onCookieSettings={openCookiePreferences}
        />

        {bagOpen && (
          <CartDrawer
            onBrowse={() => {
              setBagOpen(false)
              navigateHomeSection('collections')
            }}
            bagItems={bagItems}
            bagTotal={bagTotal}
            shouldReduceMotion={shouldReduceMotion}
            onClose={() => setBagOpen(false)}
            onRemoveItem={removeFromBag}
            onSubmitted={removeSubmittedItems}
          />
        )}

        {bespokeModalOpen && (
          <BespokeFittingModal
            initialGarment={bespokeGarmentLabel}
            measurements={measurements}
            shouldReduceMotion={shouldReduceMotion}
            onClose={() => setBespokeModalOpen(false)}
          />
        )}

        <CookieConsentPopup
          open={cookiePromptOpen}
          onDismiss={() => setCookiePromptOpen(false)}
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
