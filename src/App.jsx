import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ABOUT_METRICS,
  ATELIER_CHAPTERS,
  COLOR_ALLOCATION,
  CURVED_GALLERY_ITEMS,
  DEPARTMENT_PILLARS,
  GARMENTS,
  MATERIAL_PALETTE,
  SALON_LOCATIONS,
  SIGNATURE_BENTO,
  formatNaira,
} from './data/raddasData'
import {
  CoutureTailorSeal,
  ExoticFiligreeCorners,
  Exploded3DGarmentStudio,
  GarmentVisual,
  MacroDetailPlate,
  Tilt3DCard,
} from './components/AtelierVisuals'
import { OrbitHero } from './components/HeroTemplates'

const RTW_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
const UI_EASE = [0.2, 0.8, 0.2, 1]
const ENTER_EASE = [0.22, 1, 0.36, 1]

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'gallery', label: 'Gallery' },
]

/**
 * GPU-composited panel inside the 3D Concave Gallery Wall (#curved-wall).
 * Mirrors the classic small-center / tall-angled-wing amphitheater curve
 * while gliding forward & backward cleanly on pointer movement.
 */
function CurvedLookbookPanel({
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
        title={`Open ${item.title} Full Outfit (${formatNaira(item.price)})`}
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
}

const COOKIE_STORAGE_KEY = 'radas_cookie_prefs_v2'
const CART_STORAGE_KEY = 'radas_cart_items_v1'
const TAPE_STORAGE_KEY = 'radas_tape_measurements_v1'

const DEFAULT_COOKIE_PREFS = {
  essential: true,
  measurements: true,
  analytics: true,
}

const readStoredCookiePrefs = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(COOKIE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      essential: true,
      measurements: Boolean(parsed.measurements),
      analytics: Boolean(parsed.analytics),
    }
  } catch {
    return null
  }
}

export default function App() {
  const shouldReduceMotion = useReducedMotion()

  const initialCookiePrefs = useMemo(() => readStoredCookiePrefs(), [])

  // Cookie Preferences & Floating "Save Cookies" State
  const [cookiePrefs, setCookiePrefs] = useState(
    () => initialCookiePrefs || DEFAULT_COOKIE_PREFS
  )
  const [cookiesSaved, setCookiesSaved] = useState(() => Boolean(initialCookiePrefs))
  const [scrolledPastFold, setScrolledPastFold] = useState(false)

  // Signature Bento state (Section 01) & 3D Studio controls
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [macroSlideIdx, setMacroSlideIdx] = useState(0)
  const [bentoMode, setBentoMode] = useState('rtw') // 'rtw' | 'bespoke'
  const [bento3DMode, setBento3DMode] = useState('exploded') // 'exploded' | 'portrait'
  const [bentoRotY, setBentoRotY] = useState(-16)
  const [selectedRtwSize, setSelectedRtwSize] = useState('L')
  const [measurements, setMeasurements] = useState(() => {
    if (typeof window !== 'undefined' && initialCookiePrefs?.measurements !== false) {
      try {
        const savedTape = window.localStorage.getItem(TAPE_STORAGE_KEY)
        if (savedTape) return JSON.parse(savedTape)
      } catch {
        // Fallback to default measurements
      }
    }
    return SIGNATURE_BENTO.defaultMeasurements
  })

  // Collection filter & per-card purchase mode (Section 02)
  const [activePillar, setActivePillar] = useState('All')
  const [cardModes, setCardModes] = useState({})

  // Page View ('home' | 'about' | 'contact' | 'gallery')
  const [activePage, setActivePage] = useState('home')
  const [selectedOutfitId, setSelectedOutfitId] = useState(CURVED_GALLERY_ITEMS[0].id)
  const [hoveredLookId, setHoveredLookId] = useState(CURVED_GALLERY_ITEMS[0].id)
  const [galleryFilter, setGalleryFilter] = useState('All')
  const [galleryViewMode, setGalleryViewMode] = useState('full') // 'full' | '3d'
  const [galleryPurchaseMode, setGalleryPurchaseMode] = useState('rtw') // 'rtw' | 'bespoke'
  const [galleryRtwSize, setGalleryRtwSize] = useState('L')
  const [galleryRotY, setGalleryRotY] = useState(-14)

  // Dealt Moment & GPU Lookbook Gliding State (Zero Re-Renders on Mouse/Touch Move)
  const [activeChapterIdx, setActiveChapterIdx] = useState(0)
  const touchStartXRef = useRef(null)
  const touchStartOffsetRef = useRef(0)
  const lookbookOffset = useMotionValue(0)
  const smoothLookbookOffset = useSpring(lookbookOffset, {
    stiffness: 170,
    damping: 26,
    mass: 0.35,
  })

  // Atelier Cart & Fitting Commission Modal
  const [bagItems, setBagItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) return JSON.parse(savedCart)
      } catch {
        // Fallback to empty cart
      }
    }
    return []
  })
  const [bagOpen, setBagOpen] = useState(false)
  const [bespokeModalOpen, setBespokeModalOpen] = useState(false)
  const [bespokeForm, setBespokeForm] = useState({
    clientName: '',
    email: '',
    garment: 'Sovereign Wine Velvet 3-Piece Agbada (RD-AGB-01)',
    city: 'Lagos Atelier Fitting',
    chest: '42"',
    shoulder: '18.5"',
    sleeve: '25.5"',
    notes: '',
  })
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  // Contact Us Inquiry Form State (Home Section & Contact Page)
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    salon: 'Lagos Flagship Salon',
    subject: 'Private Fitting Inquiry',
    message: '',
  })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  // Track vertical scroll for Scroll-to-Top button emphasis
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onScroll = () => {
      setScrolledPastFold(window.scrollY > 180)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Persist Cart when Essential Cookies are active
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(bagItems))
    } catch {
      // Ignore storage quota errors
    }
  }, [bagItems])

  // Persist Measurements when Tape Memory Cookie is enabled
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (cookiePrefs.measurements) {
        window.localStorage.setItem(TAPE_STORAGE_KEY, JSON.stringify(measurements))
      } else {
        window.localStorage.removeItem(TAPE_STORAGE_KEY)
      }
    } catch {
      // Ignore storage errors
    }
  }, [measurements, cookiePrefs.measurements])

  const persistCookiePreferences = (nextPrefs) => {
    const payload = { ...nextPrefs, essential: true, updatedAt: new Date().toISOString() }
    setCookiePrefs(payload)
    setCookiesSaved(true)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload))
        document.cookie = `radas_consent=${encodeURIComponent(
          `essential:1|tape:${payload.measurements ? 1 : 0}|stage:${payload.analytics ? 1 : 0}`
        )}; path=/; max-age=15552000; SameSite=Lax`
      } catch {
        // Ignore storage errors in sandboxed contexts
      }
    }
  }

  const currentAngle = SIGNATURE_BENTO.angles[selectedAngleIdx]
  const currentMacro = SIGNATURE_BENTO.macroSlides[macroSlideIdx]
  const currentChapter = ATELIER_CHAPTERS[activeChapterIdx] || ATELIER_CHAPTERS[0]
  const selectedOutfit =
    CURVED_GALLERY_ITEMS.find((item) => item.id === selectedOutfitId) ||
    CURVED_GALLERY_ITEMS[0]
  const hoveredLook =
    CURVED_GALLERY_ITEMS.find((item) => item.id === hoveredLookId) ||
    CURVED_GALLERY_ITEMS[0]

  const filteredGalleryOutfits = useMemo(
    () =>
      galleryFilter === 'All'
        ? CURVED_GALLERY_ITEMS
        : CURVED_GALLERY_ITEMS.filter((o) => o.pillar === galleryFilter),
    [galleryFilter]
  )

  const filteredGarments = useMemo(
    () =>
      activePillar === 'All'
        ? GARMENTS
        : GARMENTS.filter((g) => g.pillar === activePillar),
    [activePillar]
  )

  const bagTotal = useMemo(
    () => bagItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [bagItems]
  )

  const addToBag = (item) => {
    setBagItems((prev) => [
      ...prev,
      { ...item, uid: `${item.sku}-${Date.now()}-${Math.random()}` },
    ])
    setBagOpen(true)
  }

  const removeFromBag = (uid) => {
    setBagItems((prev) => prev.filter((i) => i.uid !== uid))
  }

  const openBespokeWithGarment = (garmentLabel) => {
    if (typeof garmentLabel === 'string' && garmentLabel.trim()) {
      setBespokeForm((prev) => ({ ...prev, garment: garmentLabel }))
    }
    setBookingConfirmed(false)
    setBespokeModalOpen(true)
  }

  const openOutfitInGallery = (outfitId) => {
    setSelectedOutfitId(outfitId)
    setActivePage('gallery')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const openOutfitByCode = (skuCode) => {
    const match = CURVED_GALLERY_ITEMS.find((o) => o.sku === skuCode)
    openOutfitInGallery(match ? match.id : CURVED_GALLERY_ITEMS[0].id)
  }

  const navigateHomeSection = (sectionId) => {
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
  }

  const stepGalleryOutfit = (delta) => {
    const idx = CURVED_GALLERY_ITEMS.findIndex((o) => o.id === selectedOutfit.id)
    const nextIdx =
      (idx + delta + CURVED_GALLERY_ITEMS.length) % CURVED_GALLERY_ITEMS.length
    setSelectedOutfitId(CURVED_GALLERY_ITEMS[nextIdx].id)
  }

  const handleLookbookPointerMove = (e) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    lookbookOffset.set(nx * 6.8)
  }

  const handleLookbookTouchStart = (e) => {
    if (shouldReduceMotion || !e.touches[0]) return
    touchStartXRef.current = e.touches[0].clientX
    touchStartOffsetRef.current = lookbookOffset.get()
  }

  const handleLookbookTouchMove = (e) => {
    if (shouldReduceMotion || touchStartXRef.current === null || !e.touches[0]) return
    const dx = e.touches[0].clientX - touchStartXRef.current
    const nextOffset = Math.max(
      -3.8,
      Math.min(3.8, touchStartOffsetRef.current - dx / 52)
    )
    lookbookOffset.set(nextOffset)
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    }
  }

  const openPage = (pageId) => {
    setActivePage(pageId)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const handleNavClick = (navId) => {
    if (navId === 'gallery') {
      openOutfitInGallery(selectedOutfitId)
      return
    }
    if (navId === 'about' || navId === 'contact' || navId === 'home') {
      openPage(navId)
      return
    }
    navigateHomeSection(navId)
  }

  const renderCuttingTableSection = () => (
    <section
      id="atelier-chapters"
      data-moment="photo-chapters"
      className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#C8A97E]/50 mb-8 sm:mb-10">
        <div>
          <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
            03 • From Bolt to Fitting: 14-Day Commission Process
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
            Three Stages at the{' '}
            <span className="italic">Cutting Table</span>
          </h2>
        </div>
        <span className="font-mono-spec text-xs text-[#1C1618]/80">
          Victoria Island &amp; Mayfair Tailoring Sequence
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {ATELIER_CHAPTERS.map((chap, idx) => {
              const isActive = idx === activeChapterIdx
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`relative w-full text-left p-5 border-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#1C1618] bg-[#5B0E24] text-[#FAF7F2]'
                      : 'border-[#C8A97E]/60 bg-[#F2ECE1] text-[#1C1618] hover:border-[#5B0E24]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span
                      className={`font-mono-spec text-xs uppercase tracking-[0.16em] ${
                        isActive ? 'text-[#C8A97E]' : 'text-[#5B0E24]'
                      }`}
                    >
                      Stage {chap.step}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="chapter-indicator"
                        transition={{ duration: 0.25, ease: UI_EASE }}
                        className="px-2.5 py-0.5 rounded-full bg-[#C8A97E] text-[#1C1618] font-mono-spec text-[11px] font-semibold"
                      >
                        Active Plate
                      </motion.span>
                    )}
                  </div>
                  <h3 className="font-serif-display text-2xl font-semibold leading-snug">
                    {chap.title}
                  </h3>
                  <p
                    className={`font-mono-spec text-xs mt-1.5 ${
                      isActive ? 'text-[#F2ECE1]/90' : 'text-[#1C1618]/75'
                    }`}
                  >
                    {chap.fact}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="bg-[#FAF7F2] editorial-border p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24]">
                Commission Starting From
              </div>
              <div className="font-serif-display text-3xl font-bold text-[#1C1618] tabular-nums">
                {formatNaira(currentChapter.startingPrice)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => openBespokeWithGarment(currentChapter.title)}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap"
            >
              Book Fitting
            </button>
          </div>
        </div>

        <div className="relative lg:col-span-7 bg-[#F2ECE1] editorial-border p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-4 sm:gap-5 card-3d-shadow">
          <ExoticFiligreeCorners variant="wine" size={18} />
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden border-2 border-[#C8A97E] rounded-t-[60px] sm:rounded-t-[80px] rounded-b-[4px] bg-[#3A0716] shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0.25, scale: 1.02 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0.25 }}
                transition={{ duration: 0.36, ease: ENTER_EASE }}
                className="w-full h-full"
              >
                <GarmentVisual
                  image={currentChapter.image}
                  alt={currentChapter.alt}
                  silhouette={currentChapter.silhouette}
                  tone={currentChapter.tone}
                  zoomOnHover
                  eager
                  className="w-full h-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentChapter.id}-copy`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: UI_EASE }}
              className="space-y-3"
            >
              <p className="font-sans-ui text-sm text-[#1C1618]/85 leading-relaxed">
                {currentChapter.copy}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentChapter.specs.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-[#FAF7F2] border border-[#C8A97E] font-mono-spec text-xs text-[#5B0E24]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )

  const renderMaterialsSection = () => (
    <section
      id="materials"
      className="scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
            05 • Cloth Weights &amp; Atelier Color Ratios
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
            Materials Built for{' '}
            <span className="italic">Wine &amp; Off-White</span>
          </h2>
        </div>
        <span className="font-mono-spec text-xs text-[#1C1618]/80">
          60-15-15-5-3-2 Atelier Palette
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {MATERIAL_PALETTE.map((mat) => (
          <div
            key={mat.code}
            className={`p-6 rounded-[8px] border-2 ${mat.surface} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono-spec text-xs tracking-[0.14em] ${mat.accent}`}>
                  {mat.code}
                </span>
                <span
                  className="w-5 h-5 rounded-full border border-[#1C1618]/30"
                  style={{ backgroundColor: mat.swatch }}
                />
              </div>
              <h3 className="font-serif-display text-2xl font-semibold mb-2">
                {mat.title}
              </h3>
              <p className="font-sans-ui text-xs leading-relaxed opacity-90">
                {mat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F2ECE1] editorial-border p-5 md:p-6">
        <div className="flex h-5 w-full rounded-sm overflow-hidden border border-[#1C1618]/30 mb-5">
          {COLOR_ALLOCATION.map((c) => (
            <div
              key={c.hex}
              style={{ width: `${c.share}%`, backgroundColor: c.hex }}
              title={`${c.name} (${c.share}%)`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {COLOR_ALLOCATION.map((c) => (
            <div key={c.hex} className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-[#1C1618]/30 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-mono-spec text-xs font-medium text-[#1C1618]">
                  {c.share}% {c.hex}
                </span>
              </div>
              <div className="font-serif-display text-base font-semibold text-[#5B0E24]">
                {c.name}
              </div>
              <p className="font-sans-ui text-xs text-[#1C1618]/75 leading-snug">
                {c.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderAboutSection = (isStandalone = false) => (
    <section
      id="about"
      className={`scroll-mt-32 md:scroll-mt-24 ${
        isStandalone
          ? 'bg-[#FAF7F2] py-10 sm:py-14'
          : 'bg-[#F2ECE1]/75 border-y border-[#C8A97E]/45 py-12 sm:py-16 md:py-24'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5">
            <Tilt3DCard intensity={6}>
              <div className="relative bg-[#3A0716] velvet-damask-bg editorial-border p-4 sm:p-5 pb-0 card-3d-shadow">
                <ExoticFiligreeCorners variant="gold" size={18} />
                <div
                  className="relative h-72 sm:h-96 overflow-hidden border-t-2 border-x-2 border-[#C8A97E] shadow-2xl"
                  style={{
                    borderTopLeftRadius: '140px',
                    borderTopRightRadius: '140px',
                  }}
                >
                  <GarmentVisual
                    image="/lookbook/atelier-craft.jpg"
                    alt="Radas master tailor cutting wine velvet cloth at the Victoria Island cutting table"
                    silhouette="agbada"
                    tone="wine"
                    zoomOnHover
                    eager
                    className="w-full h-full"
                  />
                </div>
                <div className="py-4 px-2 flex items-center justify-between gap-3 text-[#FAF7F2]">
                  <div>
                    <div className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#C8A97E]">
                      Victoria Island Workroom
                    </div>
                    <div className="font-serif-display text-lg font-medium">
                      Pattern Cutting &amp; Hand Zari Embroidery
                    </div>
                  </div>
                  <CoutureTailorSeal
                    size="sm"
                    variant="gold"
                    label="RADAS • ESTABLISHED IN LAGOS • "
                  />
                </div>
              </div>
            </Tilt3DCard>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
                {isStandalone
                  ? 'House Heritage & Tailoring Standards'
                  : '06 • About Radas Apparel'}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1 leading-tight">
                {isStandalone ? (
                  <>
                    Lagos Heritage,{' '}
                    <span className="italic">Mayfair Pattern Precision.</span>
                  </>
                ) : (
                  <>
                    The House of Radas:{' '}
                    <span className="italic">Lagos Heritage, Mayfair Precision.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="space-y-4 font-sans-ui text-sm md:text-base text-[#1C1618]/85 leading-relaxed">
              <p>
                Founded between Victoria Island and Mayfair, Radas Apparel cuts formal
                Nigerian ceremonial robes and modern menswear suiting under one roof. Every
                garment starts from high-twist European wool, 380gsm Italian velvet, or
                hand-loomed Aso-Oke milled specifically for warm coastal evenings and
                black-tie halls.
              </p>
              <p>
                Whether selecting a ready-to-wear Senator tunic in sizes S to 3XL for
                48-hour courier dispatch or commissioning a 3-piece Agbada drafted from 28
                body measurements, each seam is finished inside with breathable Bemberg
                Cupro satin piping.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {ABOUT_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="relative bg-[#FAF7F2] editorial-border p-4 card-3d-shadow"
                >
                  <ExoticFiligreeCorners variant="wine" size={14} />
                  <div className="font-serif-display text-3xl font-bold text-[#5B0E24]">
                    {metric.figure}
                  </div>
                  <div className="font-mono-spec text-xs uppercase tracking-wider text-[#1C1618] mt-1 font-medium">
                    {metric.label}
                  </div>
                  <p className="font-sans-ui text-xs text-[#1C1618]/75 mt-1.5 leading-snug">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openBespokeWithGarment('New Custom Measurement Profile')}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Book Salon Consultation
              </button>
              <button
                type="button"
                onClick={() => openPage('contact')}
                className="min-h-[44px] inline-flex items-center px-6 py-2.5 rounded-full border border-[#5B0E24] text-[#5B0E24] hover:bg-[#5B0E24] hover:text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Contact Our Salons
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const renderContactSection = (isStandalone = false) => (
    <section
      id="contact"
      className={`scroll-mt-32 md:scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 ${
        isStandalone ? 'py-10 sm:py-14' : 'py-12 sm:py-16 md:py-24'
      }`}
    >
      {!isStandalone && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-[#C8A97E]/50 mb-8 sm:mb-10">
          <div>
            <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
              07 • Contact Us &amp; Fitting Appointments
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
              Visit Our Salons or{' '}
              <span className="italic">Message the Workroom.</span>
            </h2>
          </div>
          <span className="font-mono-spec text-xs text-[#1C1618]/80">
            concierge@radasapparel.example
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {SALON_LOCATIONS.map((loc) => (
            <Tilt3DCard key={loc.city} intensity={5}>
              <div className="relative h-full bg-[#3A0716] velvet-damask-bg text-[#FAF7F2] editorial-border p-6 card-3d-shadow flex flex-col justify-between">
                <ExoticFiligreeCorners variant="gold" size={16} />
                <div className="relative z-10 space-y-2">
                  <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#C8A97E]">
                    Radas Apparel Salon
                  </span>
                  <h3 className="font-serif-display text-2xl font-semibold text-[#FAF7F2]">
                    {loc.city}
                  </h3>
                  <p className="font-sans-ui text-sm text-[#F2ECE1]/90">{loc.address}</p>
                  <div className="pt-2 border-t border-[#C8A97E]/25 font-mono-spec text-xs text-[#C8A97E]">
                    {loc.hours}
                  </div>
                  <p className="font-sans-ui text-xs text-[#F2ECE1]/80 leading-relaxed">
                    {loc.services}
                  </p>
                </div>
              </div>
            </Tilt3DCard>
          ))}

          <div className="bg-[#F2ECE1] editorial-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono-spec text-xs uppercase tracking-wider text-[#5B0E24]">
                Direct Client Desk
              </div>
              <div className="font-mono-spec text-xs text-[#1C1618] mt-0.5">
                concierge@radasapparel.example
              </div>
              <div className="font-mono-spec text-xs text-[#1C1618]/75">
                fittings@radasapparel.example
              </div>
            </div>
            <CoutureTailorSeal
              size="sm"
              variant="wine"
              label="LAGOS • LONDON • CONCIERGE • "
            />
          </div>
        </div>

        <div className="relative lg:col-span-7 bg-[#F2ECE1] editorial-border p-6 md:p-8 card-3d-shadow flex flex-col justify-between">
          <ExoticFiligreeCorners variant="wine" size={18} />
          <div className="relative z-10">
            <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
              Client Concierge Dispatch
            </div>
            <h3 className="font-serif-display text-3xl font-semibold text-[#1C1618] mt-1">
              Send an Outfit or Fitting Inquiry
            </h3>
            <p className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/80 mt-1.5">
              Write to our cutters for wedding group orders, custom cloth swatches, or size
              guidance before ordering in Naira (₦).
            </p>

            {contactSubmitted ? (
              <div className="my-8 p-6 bg-[#FAF7F2] border-2 border-[#5B0E24] text-center space-y-3">
                <CoutureTailorSeal
                  size="md"
                  variant="wine"
                  label="MESSAGE LOGGED • RADAS • "
                />
                <h4 className="font-serif-display text-2xl font-semibold text-[#5B0E24]">
                  Inquiry Received for {contactForm.salon}
                </h4>
                <p className="font-sans-ui text-xs sm:text-sm text-[#1C1618]/85 max-w-md mx-auto">
                  Thank you, {contactForm.fullName || 'Client'}. Your note regarding{' '}
                  <strong>{contactForm.subject}</strong> has been logged for response
                  within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false)
                    setContactForm((f) => ({ ...f, message: '' }))
                  }}
                  className="min-h-[40px] px-5 py-2 bg-[#5B0E24] text-[#FAF7F2] font-mono-spec text-xs uppercase tracking-wider cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setContactSubmitted(true)
                }}
                className="mt-5 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Your Name
                    </span>
                    <input
                      required
                      type="text"
                      value={contactForm.fullName}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, fullName: e.target.value }))
                      }
                      placeholder="Full Name"
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Email Address
                    </span>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="client@domain.example"
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Preferred Salon
                    </span>
                    <select
                      value={contactForm.salon}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, salon: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    >
                      <option>Lagos Flagship Salon</option>
                      <option>London Private Fitting Suite</option>
                      <option>Worldwide Online Order Desk</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                      Inquiry Subject
                    </span>
                    <select
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                    >
                      <option>Private Fitting Inquiry</option>
                      <option>Wedding Party &amp; Aso-Ebi Menswear</option>
                      <option>Ready-to-Wear Size Guidance</option>
                      <option>International Courier Dispatch</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                    Message
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Share garment SKU, ceremony date, or fitting preference..."
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#1C1618]/40 text-sm"
                  />
                </label>

                <motion.button
                  type="submit"
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  className="w-full min-h-[46px] py-3.5 px-6 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                >
                  Send Message to Radas Workroom &rarr;
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-[#FAF7F2] text-[#1C1618] overflow-x-clip">
        {/* ==================================================================
            GLASSMORPHIC STICKY ORBIT ATELIER HEADER
           ================================================================== */}
        <header className="sticky top-0 z-50 glass-navbar text-[#FAF7F2] border-b border-[#FAF7F2]/15">
          <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 md:px-10 py-2.5 md:py-3">
            {/* Primary Top Bar: Brand Left, 4 Links Center (Desktop), Book Fitting & Cart Top-Right */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Top-Left Clickable Brand Logo -> Returns to Home Page */}
              <button
                type="button"
                onClick={() => openPage('home')}
                aria-label="Radas Apparel — Return to Home Page"
                className="flex items-center gap-2 sm:gap-3 shrink-0 text-left cursor-pointer focus-visible:outline-[#C8A97E] min-h-[40px]"
              >
                <img
                  src="/monogram-gold.png"
                  alt="Radas Apparel Gold Monogram"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div>
                  <span className="font-serif-display text-base sm:text-lg font-semibold tracking-[0.04em] text-[#FAF7F2] block leading-none">
                    Radas Apparel
                  </span>
                  <span className="font-mono-spec text-[10px] sm:text-[11px] text-[#C8A97E] tracking-[0.12em] uppercase">
                    Men&apos;s Fashion
                  </span>
                </div>
              </button>

              {/* Center Navigation (Home, About Us, Contact, Gallery) — Desktop/Tablet Frosted Glass Capsule */}
              <nav
                aria-label="Primary Navigation"
                className="hidden md:flex items-center justify-center gap-1 lg:gap-1.5 px-2 py-1 rounded-full glass-pill border border-[#FAF7F2]/20"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = activePage === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3.5 py-1.5 rounded-full font-sans-ui text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#C8A97E]/90 text-[#1C1618] shadow-sm'
                          : 'text-[#FAF7F2]/90 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/15'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              {/* Top-Right Actions: Book Fitting & Cart */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openBespokeWithGarment()}
                  className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-pill border border-[#C8A97E]/75 font-sans-ui text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#FAF7F2] hover:bg-[#C8A97E] hover:text-[#1C1618] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Fitting
                </button>
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  onClick={() => setBagOpen(true)}
                  className="min-h-[36px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#C8A97E]/95 text-[#1C1618] hover:bg-[#FAF7F2] font-sans-ui text-[10px] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cart ({bagItems.length})
                </motion.button>
              </div>
            </div>

            {/* Mobile-Only Clean 4-Link Frosted Glass Row (Home, About Us, Contact, Gallery) */}
            <nav
              aria-label="Mobile Navigation"
              className="grid grid-cols-4 gap-1.5 pt-2 mt-2 border-t border-[#FAF7F2]/15 md:hidden"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item.id
                return (
                  <button
                    key={`mob-${item.id}`}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`min-h-[34px] px-1.5 py-1 rounded-full font-sans-ui text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#C8A97E]/90 text-[#1C1618] shadow-sm'
                        : 'glass-pill border border-[#FAF7F2]/15 text-[#FAF7F2] hover:bg-[#FAF7F2]/20'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </header>

        {/* ==================================================================
            MAIN CONTENT: HOME, ABOUT US, CONTACT OR FULL-OUTFIT GALLERY PAGE
           ================================================================== */}
        <main id="main-content">
          {activePage === 'about' ? (
            <div className="bg-[#FAF7F2] text-[#1C1618]">
              {/* About Us Page Top Sub-Header */}
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

              {renderAboutSection(true)}
              {renderCuttingTableSection()}
              {renderMaterialsSection()}
            </div>
          ) : activePage === 'contact' ? (
            <div className="bg-[#FAF7F2] text-[#1C1618] pb-10">
              {/* Contact Page Top Sub-Header */}
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

              {renderContactSection(true)}
            </div>
          ) : activePage === 'gallery' ? (
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
                      onClick={() => navigateHomeSection('curved-wall')}
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
                          addToBag({
                            sku: selectedOutfit.sku,
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
                          openBespokeWithGarment(
                            `${selectedOutfit.title} (${selectedOutfit.sku})`
                          )
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
                            setSelectedOutfitId(look.id)
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
          ) : (
            <>
              <OrbitHero
                onOpenBespoke={openBespokeWithGarment}
                onOpenGalleryOutfit={openOutfitByCode}
              />

          {/* ================================================================
              SECTION 01: SIGNATURE MENSWEAR BENTO GRID
             ================================================================ */}
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
                                setMeasurements((m) => ({
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
                      addToBag({
                        sku: SIGNATURE_BENTO.sku,
                        name: SIGNATURE_BENTO.title,
                        mode:
                          bentoMode === 'rtw'
                            ? `Ready-to-Wear • Size ${selectedRtwSize}`
                            : `Custom Cut • Chest ${measurements.chest}, Shoulder ${measurements.shoulder}`,
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
                      openBespokeWithGarment(
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

          {/* ================================================================
              SECTION 02: MENSWEAR DEPARTMENT CATALOG (RTW & BESPOKE)
             ================================================================ */}
          <section
            id="collections"
            className="scroll-mt-32 md:scroll-mt-24 bg-[#F2ECE1]/65 border-y border-[#C8A97E]/40 py-12 sm:py-16 md:py-24"
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
                <div>
                  <span className="font-mono-spec text-xs uppercase tracking-[0.18em] text-[#5B0E24]">
                    02 • Ready-to-Wear &amp; Made-to-Measure Menswear
                  </span>
                  <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#5B0E24] mt-1">
                    The Menswear <span className="italic">House Catalog</span>
                  </h2>
                </div>

                {/* Department Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENT_PILLARS.map((pillar) => {
                    const active = pillar === activePillar
                    return (
                      <button
                        key={pillar}
                        type="button"
                        onClick={() => setActivePillar(pillar)}
                        className={`relative min-h-[40px] px-4 py-2 rounded-full font-sans-ui text-xs font-semibold transition-colors cursor-pointer border ${
                          active
                            ? 'text-[#FAF7F2] border-[#5B0E24]'
                            : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/25 hover:border-[#5B0E24]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="dept-filter-pill"
                            transition={{ duration: 0.25, ease: UI_EASE }}
                            className="absolute inset-0 rounded-full bg-[#5B0E24]"
                          />
                        )}
                        <span className="relative z-10">{pillar}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3D Tilt Pointer-Interactive Garment Cards with Royal Arched Framing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredGarments.map((item) => {
                  const mode = cardModes[item.id] || 'rtw'
                  const price = mode === 'rtw' ? item.rtwPrice : item.bespokePrice

                  return (
                    <Tilt3DCard key={item.id} intensity={7}>
                      <article className="bg-[#F2ECE1] editorial-border h-full flex flex-col justify-between card-3d-shadow">
                        {/* Exotic Burgundy Velvet Arch Frame (Zero Overlaid Captions on Garment Photo) */}
                        <div className="relative h-88 px-5 pt-5 pb-0 overflow-hidden border-b-2 border-[#1C1618] velvet-damask-bg">
                          <ExoticFiligreeCorners variant="gold" size={18} />
                          <div
                            className="w-full h-full overflow-hidden border-t-2 border-x-2 border-[#C8A97E] shadow-xl bg-[#3A0716]"
                            style={{
                              borderTopLeftRadius: '140px',
                              borderTopRightRadius: '140px',
                            }}
                          >
                            <GarmentVisual
                              image={item.image}
                              alt={item.alt}
                              silhouette={item.silhouette}
                              tone={item.tone}
                              zoomOnHover
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between bg-[#F2ECE1]">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-mono-spec text-xs uppercase tracking-[0.12em] text-[#5B0E24]">
                                {item.tag}
                              </span>
                              <span className="font-mono-spec text-xs text-[#1C1618]/70">
                                {item.sku}
                              </span>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-serif-display text-2xl font-semibold text-[#1C1618] leading-snug">
                                {item.name}
                              </h3>
                              <div className="font-serif-display text-2xl font-bold text-[#5B0E24] tabular-nums shrink-0">
                                {formatNaira(price)}
                              </div>
                            </div>

                            <p className="font-sans-ui text-xs text-[#1C1618]/75 mt-1.5">
                              {item.fabric}
                            </p>

                            <div className="mt-3 py-1.5 px-2.5 bg-[#FAF7F2] border border-[#C8A97E]/60 font-mono-spec text-xs text-[#1C1618]/85">
                              {item.specs}
                            </div>
                          </div>

                          {/* Dual-Mode Switch + Quick Action */}
                          <div className="mt-5 space-y-2.5">
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setCardModes((m) => ({ ...m, [item.id]: 'rtw' }))
                                }
                                className={`min-h-[38px] py-1.5 px-2 font-mono-spec text-xs uppercase border transition-colors cursor-pointer ${
                                  mode === 'rtw'
                                    ? 'bg-[#1C1618] text-[#FAF7F2] border-[#1C1618]'
                                    : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/30 hover:border-[#5B0E24]'
                                }`}
                              >
                                RTW {formatNaira(item.rtwPrice)}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCardModes((m) => ({ ...m, [item.id]: 'bespoke' }))
                                }
                                className={`min-h-[38px] py-1.5 px-2 font-mono-spec text-xs uppercase border transition-colors cursor-pointer ${
                                  mode === 'bespoke'
                                    ? 'bg-[#5B0E24] text-[#FAF7F2] border-[#5B0E24]'
                                    : 'bg-[#FAF7F2] text-[#1C1618] border-[#1C1618]/30 hover:border-[#5B0E24]'
                                }`}
                              >
                                Sew {formatNaira(item.bespokePrice)}
                              </button>
                            </div>

                            <motion.button
                              type="button"
                              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                              onClick={() =>
                                mode === 'rtw'
                                  ? addToBag({
                                      sku: item.sku,
                                      name: item.name,
                                      mode: 'Ready-to-Wear • Size L',
                                      price: item.rtwPrice,
                                      silhouette: item.silhouette,
                                      tone: item.tone,
                                      image: item.image,
                                    })
                                  : openBespokeWithGarment(`${item.name} (${item.sku})`)
                              }
                              className="w-full min-h-[44px] py-2.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer"
                            >
                              {mode === 'rtw'
                                ? 'Add Size L to Cart'
                                : 'Book Custom Measurement'}
                            </motion.button>
                          </div>
                        </div>
                      </article>
                    </Tilt3DCard>
                  )
                })}
              </div>
            </div>
          </section>

          {renderCuttingTableSection()}

          {/* ================================================================
              SECTION 04: 3D CONCAVE PERSPECTIVE LOOKBOOK WALL (16 OUTFITS)
              (Small flat center ribbon curving out into tall angled wing panels;
               mouse/touch sweeps forward/backward smoothly with zero re-renders;
               clicking any outfit opens its full ensemble in the Gallery page)
             ================================================================ */}
          <section
            id="curved-wall"
            className="scroll-mt-32 md:scroll-mt-24 velvet-damask-bg text-[#FAF7F2] py-12 sm:py-14 md:py-20 overflow-hidden border-y-2 border-[#C8A97E]/55"
          >
            <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8">
              {/* Top Center Headline nestled inside the upper hollow of the concave curve */}
              <div className="relative z-20 text-center max-w-lg mx-auto mb-2 md:-mb-16 pointer-events-none">
                <span className="font-mono-spec text-xs uppercase tracking-[0.2em] text-[#C8A97E]">
                  04 • Menswear Lookbook Wall
                </span>
                <h2 className="font-serif-display text-2xl sm:text-4xl md:text-[2.85rem] font-medium tracking-wide leading-[1.06] mt-1.5">
                  &ldquo;CRAFTED IN OUR ATELIER.{' '}
                  <span className="italic gold-foil-text block sm:inline">
                    WORN WORLDWIDE.&rdquo;
                  </span>
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
                      onSelect={openOutfitInGallery}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Caption, Interactive Glide Controls & Active Outfit Gateway */}
              <div className="relative z-20 text-center max-w-3xl mx-auto mt-2 md:-mt-12 space-y-3 sm:space-y-4">
                <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/85 max-w-lg mx-auto leading-relaxed px-2">
                  Swipe or glide left and right across the gallery wall to move through all 16
                  outfits, hover any panel to lift it forward, and tap an image to inspect its
                  full ensemble.
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
                    onClick={() => openOutfitInGallery(hoveredLook.id)}
                    className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#C8A97E] hover:bg-[#FAF7F2] text-[#1C1618] font-sans-ui text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Full Outfit &rarr;
                  </button>
                </div>
              </div>
            </div>
          </section>

          {renderMaterialsSection()}
          {renderAboutSection(false)}
          {renderContactSection(false)}
            </>
          )}
        </main>

        {/* ==================================================================
            AGED BURGUNDY FOOTER
           ================================================================== */}
        <footer className="bg-[#3A0716] text-[#FAF7F2] border-t-2 border-[#C8A97E]/50">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/monogram-gold.png"
                    alt="Radas Apparel Seal"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-serif-display text-2xl font-semibold tracking-[0.06em] text-[#FAF7F2]">
                      RADAS APPAREL
                    </div>
                    <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#C8A97E]">
                      Men&apos;s Fashion &bull; Custom Cut &amp; Ready-to-Wear
                    </div>
                  </div>
                </div>
                <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/85 max-w-md leading-relaxed">
                  Hand-cut Agbadas, Senator kaftans, black-tie tuxedos, and resort
                  two-pieces sewn in Lagos and fitted across London.
                </p>
              </div>

              <div className="md:col-span-4 space-y-2">
                <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#C8A97E]">
                  Salons &amp; Fitting Inquiries
                </div>
                <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/90">
                  Adeola Odeku Street, Victoria Island, Lagos
                </p>
                <p className="font-sans-ui text-xs md:text-sm text-[#F2ECE1]/90">
                  Mount Street, Mayfair, London
                </p>
                <p className="font-mono-spec text-xs text-[#C8A97E] pt-1">
                  concierge@radasapparel.example
                </p>
              </div>

              <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between gap-4">
                <CoutureTailorSeal
                  size="md"
                  variant="gold"
                  label="RADAS MENSWEAR • LAGOS & LONDON • "
                />
                <button
                  type="button"
                  onClick={() => openBespokeWithGarment()}
                  className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#1C1618] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                >
                  Schedule Private Fitting
                </button>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#C8A97E]/25 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-spec text-xs text-[#F2ECE1]/70 uppercase tracking-[0.12em]">
              <span>© 2026 Radas Apparel • Lagos &amp; London</span>
              <span>All Pricing Displayed in Nigerian Naira (₦)</span>
            </div>
          </div>
        </footer>

        {/* ==================================================================
            SLIDE-OVER ATELIER BAG DRAWER
           ================================================================== */}
        <AnimatePresence>
          {bagOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex justify-end bg-[#1C1618]/65 backdrop-blur-xs"
            >
              <motion.div
                initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                animate={{ x: 0 }}
                exit={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                transition={{ duration: 0.28, ease: UI_EASE }}
                className="w-full max-w-md bg-[#FAF7F2] h-full border-l-2 border-[#1C1618] p-6 flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#C8A97E]">
                    <div>
                      <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#5B0E24]">
                        Atelier Dispatch
                      </span>
                      <h3 className="font-serif-display text-2xl font-semibold">
                        Your Cart ({bagItems.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBagOpen(false)}
                      className="min-h-[38px] px-3 py-1 border border-[#1C1618] font-mono-spec text-xs hover:bg-[#1C1618] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {bagItems.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <img
                        src="/monogram-wine.png"
                        alt="Radas Apparel"
                        className="w-12 h-12 mx-auto opacity-60 object-contain"
                      />
                      <p className="font-serif-display text-xl text-[#5B0E24]">
                        Your cart is empty.
                      </p>
                      <p className="font-sans-ui text-xs text-[#1C1618]/75">
                        Select a men&apos;s outfit size or book a custom fitting commission.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-[#C8A97E]/40 mt-4 max-h-[60vh] overflow-y-auto">
                      {bagItems.map((item) => (
                        <li key={item.uid} className="py-4 flex items-center gap-4">
                          <div className="w-16 h-20 border border-[#1C1618] overflow-hidden shrink-0">
                            <GarmentVisual
                              image={item.image}
                              alt={item.name}
                              silhouette={item.silhouette}
                              tone={item.tone}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono-spec text-xs text-[#5B0E24]">
                              {item.sku}
                            </div>
                            <div className="font-serif-display text-lg font-semibold truncate">
                              {item.name}
                            </div>
                            <div className="font-mono-spec text-xs text-[#1C1618]/75">
                              {item.mode}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-serif-display text-xl font-bold text-[#5B0E24] tabular-nums">
                              {formatNaira(item.price)}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromBag(item.uid)}
                              className="font-mono-spec text-xs underline text-[#1C1618]/70 hover:text-[#5B0E24] cursor-pointer mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-[#1C1618]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-spec text-xs uppercase tracking-wider">
                      Cart Subtotal
                    </span>
                    <span className="font-serif-display text-3xl font-bold text-[#5B0E24] tabular-nums">
                      {formatNaira(bagTotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={bagItems.length === 0}
                    onClick={() => {
                      setBagOpen(false)
                      openBespokeWithGarment(`${bagItems.length} Menswear Piece(s)`)
                    }}
                    className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] disabled:opacity-40 hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                  >
                    Proceed to Order Review →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================================================
            BESPOKE SEWING APPOINTMENT & MEASUREMENT MODAL
           ================================================================== */}
        <AnimatePresence>
          {bespokeModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1618]/75 backdrop-blur-xs"
            >
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.99 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }
                }
                transition={{ duration: 0.26, ease: UI_EASE }}
                className="w-full max-w-xl bg-[#FAF7F2] editorial-border p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#C8A97E]">
                  <div>
                    <span className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#5B0E24]">
                      Custom Menswear Portal
                    </span>
                    <h3 className="font-serif-display text-3xl font-semibold text-[#1C1618]">
                      Book Private Fitting Commission
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBespokeModalOpen(false)}
                    className="min-h-[38px] px-3 py-1 border border-[#1C1618] font-mono-spec text-xs hover:bg-[#1C1618] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {bookingConfirmed ? (
                  <div className="py-8 text-center space-y-4">
                    <CoutureTailorSeal
                      size="lg"
                      variant="wine"
                      label="COMMISSION REGISTERED • RADAS • "
                    />
                    <h4 className="font-serif-display text-3xl text-[#5B0E24]">
                      Fitting Request Logged
                    </h4>
                    <p className="font-sans-ui text-sm text-[#1C1618]/85 max-w-md mx-auto">
                      Head cutter assigned for <strong>{bespokeForm.garment}</strong> (
                      {bespokeForm.city}). Tape profile:{' '}
                      <span className="font-mono-spec text-xs">
                        Chest {bespokeForm.chest} / Shoulder {bespokeForm.shoulder} /
                        Sleeve {bespokeForm.sleeve}
                      </span>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setBespokeModalOpen(false)}
                      className="min-h-[44px] px-6 py-3 bg-[#5B0E24] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
                    >
                      Return to Lookbook
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setBookingConfirmed(true)
                    }}
                    className="mt-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                          Client Full Name
                        </span>
                        <input
                          required
                          type="text"
                          value={bespokeForm.clientName}
                          onChange={(e) =>
                            setBespokeForm((f) => ({ ...f, clientName: e.target.value }))
                          }
                          placeholder="Full Name"
                          className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                        />
                      </label>
                      <label className="block">
                        <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                          Email Address
                        </span>
                        <input
                          required
                          type="email"
                          value={bespokeForm.email}
                          onChange={(e) =>
                            setBespokeForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="client@domain.example"
                          className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                          Selected Garment
                        </span>
                        <input
                          type="text"
                          value={bespokeForm.garment}
                          onChange={(e) =>
                            setBespokeForm((f) => ({ ...f, garment: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 font-mono-spec text-xs"
                        />
                      </label>
                      <label className="block">
                        <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                          Fitting Channel
                        </span>
                        <select
                          value={bespokeForm.city}
                          onChange={(e) =>
                            setBespokeForm((f) => ({ ...f, city: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                        >
                          <option>Lagos Atelier Fitting</option>
                          <option>London Mayfair Fitting</option>
                          <option>Live Video Tape Consultation</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-[#F2ECE1] p-3.5 border border-[#C8A97E]">
                      {[
                        ['chest', 'Chest'],
                        ['shoulder', 'Shoulder'],
                        ['sleeve', 'Sleeve'],
                      ].map(([k, lbl]) => (
                        <label key={k} className="block">
                          <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                            {lbl}
                          </span>
                          <input
                            type="text"
                            value={bespokeForm[k]}
                            onChange={(e) =>
                              setBespokeForm((f) => ({ ...f, [k]: e.target.value }))
                            }
                            className="w-full px-2.5 py-2 bg-[#FAF7F2] border border-[#1C1618]/40 font-mono-spec text-xs"
                          />
                        </label>
                      ))}
                    </div>

                    <label className="block">
                      <span className="font-mono-spec text-xs uppercase text-[#5B0E24] block mb-1">
                        Embroidery / Monogram Notes
                      </span>
                      <textarea
                        rows={2}
                        value={bespokeForm.notes}
                        onChange={(e) =>
                          setBespokeForm((f) => ({ ...f, notes: e.target.value }))
                        }
                        placeholder="Cuff initials, lapel width, or ceremony date..."
                        className="w-full px-3 py-2.5 bg-[#F2ECE1] border border-[#1C1618]/40 text-sm"
                      />
                    </label>

                    <button
                      type="submit"
                      className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                    >
                      Confirm Fitting Appointment →
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================================================
            COOKIE CONSENT POP-UP (Disappears on Accept / Save Cookies)
           ================================================================== */}
        <AnimatePresence>
          {!cookiesSaved && (
            <motion.aside
              aria-label="Radas Cookie Preferences"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.97 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
              }
              transition={{ duration: 0.24, ease: UI_EASE }}
              className="fixed bottom-4 left-3 sm:left-5 z-50 w-[calc(100vw-6.5rem)] max-w-[360px] bg-[#3A0716]/96 backdrop-blur-md text-[#FAF7F2] border-2 border-[#C8A97E] rounded-[14px] p-3.5 sm:p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#C8A97E]/30">
                <div className="flex items-center gap-2">
                  <img
                    src="/monogram-gold.png"
                    alt="Radas Cookie Mark"
                    className="w-5 h-5 object-contain shrink-0"
                  />
                  <span className="font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[#C8A97E] font-semibold">
                    Radas Cookie Settings
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => persistCookiePreferences(cookiePrefs)}
                  aria-label="Dismiss cookie pop-up"
                  className="px-2 py-0.5 text-[11px] font-mono-spec border border-[#C8A97E]/50 rounded-full hover:bg-[#5B0E24] cursor-pointer"
                >
                  Close
                </button>
              </div>

              <p className="font-sans-ui text-xs text-[#F2ECE1]/90 mt-2 leading-relaxed">
                Browser cookies keep your cart items, 28-point tape measurements, and
                lookbook position saved across pages.
              </p>

              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[8px] bg-[#5B0E24]/70 border border-[#C8A97E]/35">
                  <div>
                    <div className="font-mono-spec text-[11px] text-[#FAF7F2] font-semibold">
                      Essential Cart &amp; Session
                    </div>
                    <div className="font-sans-ui text-[10px] text-[#F2ECE1]/70">
                      Active for cart &amp; checkout
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#C8A97E] text-[#1C1618] font-mono-spec text-[10px] font-bold">
                    ON
                  </span>
                </div>

                {[
                  {
                    key: 'measurements',
                    label: 'Tape Memory',
                    sub: 'Saves Chest, Shoulder & Sleeve entries',
                  },
                  {
                    key: 'analytics',
                    label: 'Lookbook Stage State',
                    sub: 'Saves preferred 3D view',
                  },
                ].map((opt) => {
                  const checked = Boolean(cookiePrefs[opt.key])
                  return (
                    <label
                      key={opt.key}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[8px] bg-[#1C1618]/40 border border-[#C8A97E]/30 cursor-pointer hover:border-[#C8A97E]"
                    >
                      <div>
                        <div className="font-mono-spec text-[11px] text-[#FAF7F2]">
                          {opt.label}
                        </div>
                        <div className="font-sans-ui text-[10px] text-[#F2ECE1]/70">
                          {opt.sub}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setCookiePrefs((prev) => ({
                            ...prev,
                            [opt.key]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-[#C8A97E] cursor-pointer shrink-0"
                      />
                    </label>
                  )
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => persistCookiePreferences(DEFAULT_COOKIE_PREFS)}
                  className="min-h-[38px] px-2.5 py-2 rounded-full bg-[#C8A97E] hover:bg-[#FAF7F2] text-[#1C1618] font-sans-ui text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                >
                  Accept Cookies
                </button>
                <button
                  type="button"
                  onClick={() => persistCookiePreferences(cookiePrefs)}
                  className="min-h-[38px] px-2.5 py-2 rounded-full border border-[#C8A97E]/75 bg-[#5B0E24] hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                >
                  Save Cookies
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ==================================================================
            FLOATING SCROLL-TO-TOP BUTTON
           ================================================================== */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          className={`fixed bottom-4 right-3 sm:right-5 z-40 min-h-[40px] px-3.5 sm:px-4 py-2 rounded-full bg-[#5B0E24]/95 hover:bg-[#3A0716] text-[#FAF7F2] border-2 border-[#C8A97E] shadow-xl flex items-center gap-1.5 font-mono-spec text-[11px] sm:text-xs uppercase tracking-[0.1em] transition-opacity cursor-pointer ${
            scrolledPastFold ? 'opacity-100' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="w-3.5 h-3.5 text-[#C8A97E] shrink-0"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
          </svg>
          <span>Top</span>
        </motion.button>
      </div>
    </MotionConfig>
  )
}
