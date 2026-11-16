import React, { useId, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'

const TONE_MAP = {
  wine: {
    bg: 'from-[#6D132E] via-[#5B0E24] to-[#3A0716]',
    garmentPrimary: '#470A1B',
    garmentSecondary: '#2C0410',
    trim: '#C8A97E',
    column: '#DFD5C3',
  },
  burgundy: {
    bg: 'from-[#4B0B1E] via-[#3A0716] to-[#1C1618]',
    garmentPrimary: '#29050F',
    garmentSecondary: '#5B0E24',
    trim: '#C8A97E',
    column: '#D8CEBD',
  },
  alabaster: {
    bg: 'from-[#FAF7F2] via-[#F2ECE1] to-[#E6DEC9]',
    garmentPrimary: '#FAF7F2',
    garmentSecondary: '#EAE2D2',
    trim: '#5B0E24',
    column: '#480A1C',
  },
  linen: {
    bg: 'from-[#F5F0E6] via-[#EAE2D2] to-[#DCD1BD]',
    garmentPrimary: '#F2ECE1',
    garmentSecondary: '#DFD5C2',
    trim: '#C8A97E',
    column: '#4C0D20',
  },
  gold: {
    bg: 'from-[#D7BA8F] via-[#C8A97E] to-[#9E7F56]',
    garmentPrimary: '#5B0E24',
    garmentSecondary: '#3A0716',
    trim: '#FAF7F2',
    column: '#E4DAC8',
  },
}

const EASE_UI = [0.2, 0.8, 0.2, 1]
const EASE_ENTER = [0.22, 1, 0.36, 1]

/**
 * Rotating Blade-R Couture Tailor's Seal overlapping editorial seams
 */
export function CoutureTailorSeal({
  size = 'md',
  variant = 'wine',
  className = '',
  label = 'RADAS ATELIER • CUSTOM CUT • ',
}) {
  const uid = useId().replace(/:/g, '')
  const dims =
    size === 'lg'
      ? 'w-24 h-24 md:w-28 md:h-28'
      : size === 'sm'
      ? 'w-16 h-16'
      : 'w-20 h-20 md:w-24 md:h-24'

  const ringColor =
    variant === 'gold'
      ? '#C8A97E'
      : variant === 'alabaster'
      ? '#FAF7F2'
      : '#5B0E24'

  const bgFill =
    variant === 'gold'
      ? 'bg-[#3A0716] border-[#C8A97E]'
      : variant === 'alabaster'
      ? 'bg-[#5B0E24] border-[#C8A97E]'
      : 'bg-[#FAF7F2] border-[#5B0E24]'

  const monogramSrc =
    variant === 'gold'
      ? '/monogram-gold.png'
      : variant === 'alabaster'
      ? '/monogram-alabaster.png'
      : '/monogram-wine.png'

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full border-2 shadow-xl ${bgFill} ${dims} ${className}`}
      aria-label="Radas Menswear Tailor Seal"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full animate-spin-slow p-1"
      >
        <defs>
          <path
            id={`seal-circle-${uid}`}
            d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <circle
          cx="60"
          cy="60"
          r="53"
          fill="none"
          stroke={ringColor}
          strokeWidth="0.75"
          strokeDasharray="2 3"
          opacity="0.6"
        />
        <text
          fill={ringColor}
          fontSize="7.4"
          fontWeight="600"
          letterSpacing="2.2"
          fontFamily="'JetBrains Mono', monospace"
        >
          <textPath href={`#seal-circle-${uid}`} startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>
      <img
        src={monogramSrc}
        alt="Radas Blade R Monogram"
        className="relative z-10 w-[44%] h-[44%] object-contain select-none"
      />
    </div>
  )
}

/**
 * Architectural Menswear Lookbook Plate
 * Renders real photographic lookbook plate with 1.03x Framer Motion zoom inside overflow mask,
 * falling back cleanly to architectural tailoring vector plates if needed.
 * Strictly zero captions overlaid on photographs (design-taste-frontend House Rule 1).
 */
export function GarmentVisual({
  image,
  alt,
  silhouette = 'agbada',
  tone = 'wine',
  zoomOnHover = true,
  fit = 'cover',
  eager = false,
  className = '',
}) {
  const uid = useId().replace(/:/g, '')
  const shouldReduceMotion = useReducedMotion()
  const [imgFailed, setImgFailed] = useState(false)
  const t = TONE_MAP[tone] || TONE_MAP.wine

  const fitClass =
    fit === 'contain'
      ? 'object-contain object-center'
      : 'object-cover object-top'

  if (image && silhouette !== 'seal' && !imgFailed) {
    return (
      <div
        className={`relative overflow-hidden bg-[#F2ECE1] select-none ${
          fit === 'contain' ? 'bg-[#2B0510]' : ''
        } ${className}`}
      >
        <img
          src={image}
          alt={alt || `Radas Menswear ${silhouette}`}
          loading="eager"
          decoding={eager ? 'sync' : 'async'}
          onError={() => setImgFailed(true)}
          className={`w-full h-full ${fitClass} block ${
            zoomOnHover && !shouldReduceMotion
              ? 'transition-transform duration-200 ease-out group-hover:scale-[1.03] hover:scale-[1.03]'
              : ''
          }`}
        />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={
        zoomOnHover && !shouldReduceMotion ? { scale: 1.03 } : undefined
      }
      transition={{ duration: 0.6, ease: EASE_UI }}
      className={`relative overflow-hidden bg-gradient-to-br ${t.bg} select-none ${className}`}
    >
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        aria-hidden={silhouette !== 'seal'}
      >
        <defs>
          <linearGradient id={`sun-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#C8A97E" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#1C1618" stopOpacity="0.28" />
          </linearGradient>
          <pattern
            id={`weave-${uid}`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 6 0 L 0 0 0 6"
              fill="none"
              stroke={t.trim}
              strokeWidth="0.35"
              strokeOpacity="0.16"
            />
          </pattern>
        </defs>

        <rect width="300" height="400" fill={`url(#weave-${uid})`} />
        <g opacity="0.24">
          <rect x="18" y="0" width="38" height="400" fill={t.column} />
          <rect x="244" y="0" width="38" height="400" fill={t.column} />
        </g>

        <path
          d="M 68 380 L 68 130 A 82 82 0 0 1 232 130 L 232 380 Z"
          fill="none"
          stroke={t.trim}
          strokeWidth="1"
          strokeOpacity="0.35"
        />

        {silhouette === 'agbada' && (
          <g>
            <path
              d="M 150 68 L 54 102 L 38 258 L 92 268 L 106 164 L 102 356 L 198 356 L 194 164 L 208 268 L 262 258 L 246 102 Z"
              fill={t.garmentPrimary}
              stroke={t.trim}
              strokeWidth="1.5"
            />
            <path
              d="M 118 82 L 182 82 L 188 356 L 112 356 Z"
              fill={t.garmentSecondary}
              stroke={t.trim}
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <path
              d="M 150 74 L 150 185 M 133 92 L 167 92 M 126 112 L 174 112 M 132 135 L 168 135 M 140 160 L 160 160"
              stroke={t.trim}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {silhouette === 'suit' && (
          <g>
            <path
              d="M 116 236 L 147 236 L 145 365 L 114 365 Z M 153 236 L 184 236 L 186 365 L 155 365 Z"
              fill={t.garmentSecondary}
              stroke={t.trim}
              strokeWidth="1"
            />
            <path
              d="M 118 76 L 82 96 L 70 232 L 98 236 L 108 148 L 108 256 L 192 256 L 192 148 L 202 236 L 230 232 L 218 96 L 182 76 L 150 144 Z"
              fill={t.garmentPrimary}
              stroke={t.trim}
              strokeWidth="1.4"
            />
            <path
              d="M 122 80 L 150 148 L 115 128 Z M 178 80 L 150 148 L 185 128 Z"
              fill={t.garmentSecondary}
              stroke={t.trim}
              strokeWidth="1.2"
            />
          </g>
        )}

        {(silhouette === 'senator' || silhouette === 'kaftan') && (
          <g>
            <path
              d="M 120 74 L 78 96 L 72 240 L 96 242 L 105 142 L 105 288 L 195 288 L 195 142 L 204 242 L 228 240 L 222 96 L 180 74 Z"
              fill={t.garmentPrimary}
              stroke={t.trim}
              strokeWidth="1.5"
            />
            <path
              d="M 112 288 L 146 288 L 144 368 L 115 368 Z M 154 288 L 188 288 L 185 368 L 156 368 Z"
              fill={t.garmentSecondary}
              stroke={t.trim}
              strokeWidth="1"
            />
          </g>
        )}

        {silhouette === 'twopiece' && (
          <g>
            <path
              d="M 122 78 L 80 98 L 68 184 L 96 190 L 108 136 L 108 232 L 192 232 L 192 136 L 204 190 L 232 184 L 220 98 L 178 78 L 150 116 Z"
              fill={t.garmentPrimary}
              stroke={t.trim}
              strokeWidth="1.4"
            />
            <path
              d="M 110 232 L 148 232 L 145 368 L 104 368 Z M 152 232 L 190 232 L 196 368 L 155 368 Z"
              fill={t.garmentSecondary}
              stroke={t.trim}
              strokeWidth="1.2"
            />
          </g>
        )}

        {silhouette === 'seal' && (
          <g>
            <circle cx="150" cy="200" r="64" fill={t.garmentPrimary} stroke={t.trim} strokeWidth="2" />
            <circle cx="150" cy="200" r="54" fill="none" stroke={t.trim} strokeWidth="0.9" strokeDasharray="3 3" />
          </g>
        )}

        <rect width="300" height="400" fill={`url(#sun-${uid})`} />
      </svg>

      {silhouette === 'seal' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={tone === 'alabaster' || tone === 'linen' ? '/monogram-wine.png' : '/monogram-gold.png'}
            alt="Radas House Seal"
            className="w-16 h-16 object-contain"
          />
        </div>
      )}
    </motion.div>
  )
}

/**
 * 5-Slide Macro Detail Fabric & Stitching Close-Up
 */
export function MacroDetailPlate({ pattern = 'stitch' }) {
  return (
    <div className="relative w-full h-full bg-[#3A0716] overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="velvet-grain" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#C8A97E" fillOpacity="0.16" />
            <circle cx="8" cy="7" r="0.7" fill="#FAF7F2" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="240" height="160" fill="#3A0716" />
        <rect width="240" height="160" fill="url(#velvet-grain)" />

        {pattern === 'stitch' && (
          <g>
            <path d="M 0 110 L 240 42" stroke="#5B0E24" strokeWidth="62" />
            <path
              d="M 10 92 L 230 28"
              stroke="#C8A97E"
              strokeWidth="2.4"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            <path
              d="M 14 114 L 234 50"
              stroke="#FAF7F2"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.45"
            />
          </g>
        )}

        {pattern === 'filigree' && (
          <g stroke="#C8A97E" fill="none" strokeWidth="1.8">
            <path d="M 30 80 C 60 25, 110 25, 120 80 C 130 135, 180 135, 210 80" />
            <path d="M 45 80 C 70 42, 105 42, 120 80 C 135 118, 170 118, 195 80" opacity="0.65" />
            <circle cx="120" cy="80" r="18" />
            <polygon points="120,44 134,80 120,116 106,80" />
          </g>
        )}

        {pattern === 'cufflink' && (
          <g>
            <rect x="40" y="34" width="160" height="92" rx="6" fill="#FAF7F2" opacity="0.92" />
            <circle cx="120" cy="80" r="26" fill="#C8A97E" stroke="#3A0716" strokeWidth="2.5" />
            <circle cx="120" cy="80" r="20" fill="#5B0E24" />
          </g>
        )}

        {pattern === 'velvet' && (
          <g>
            <path d="M 0 0 C 80 40, 140 120, 240 160 L 240 0 Z" fill="#5B0E24" opacity="0.7" />
            <path d="M 0 160 C 90 95, 160 65, 240 10" stroke="#C8A97E" strokeWidth="1.4" fill="none" opacity="0.55" />
            <path d="M 0 120 C 75 75, 145 55, 240 0" stroke="#FAF7F2" strokeWidth="0.8" fill="none" opacity="0.25" />
          </g>
        )}

        {pattern === 'piping' && (
          <g>
            <rect x="0" y="0" width="120" height="160" fill="#5B0E24" />
            <rect x="120" y="0" width="120" height="160" fill="#F2ECE1" />
            <rect x="116" y="0" width="8" height="160" fill="#C8A97E" />
          </g>
        )}
      </svg>

      {pattern === 'cufflink' && (
        <img
          src="/monogram-gold.png"
          alt="Radas Engraved Brass Cufflink"
          className="absolute w-7 h-7 object-contain pointer-events-none"
        />
      )}
    </div>
  )
}

/**
 * Wide Editorial Menswear Campaign Triptych (Full-Bleed Magazine Hero)
 * Uses Framer Motion entrance media settle (1.05 -> 1.00 over 1.1s) and clean bottom control band.
 */
export function EditorialCampaignBanner({ onShopRTW, onBookBespoke }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      data-enter-media
      className="relative w-full rounded-t-[8px] overflow-hidden bg-[#3A0716] border-t-2 border-x-2 border-[#C8A97E]/45 shadow-2xl"
    >
      {/* 3-Panel Menswear Photography Triptych */}
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.1, ease: EASE_ENTER }}
        className="grid grid-cols-1 md:grid-cols-12 h-[280px] sm:h-[330px] md:h-[365px]"
      >
        <div className="hidden md:block md:col-span-3 h-full border-r border-[#C8A97E]/25 overflow-hidden">
          <GarmentVisual
            image="/lookbook/senator-alabaster.jpg"
            alt="Radas Menswear Alabaster Irish Linen Senator Set"
            silhouette="senator"
            tone="alabaster"
            eager
            className="w-full h-full"
          />
        </div>
        <div className="col-span-1 md:col-span-6 h-full overflow-hidden">
          <GarmentVisual
            image="/lookbook/agbada-wine.jpg"
            alt="Radas Menswear Sovereign Wine Velvet 3-Piece Agbada"
            silhouette="agbada"
            tone="wine"
            eager
            className="w-full h-full"
          />
        </div>
        <div className="hidden md:block md:col-span-3 h-full border-l border-[#C8A97E]/25 overflow-hidden">
          <GarmentVisual
            image="/lookbook/suit-burgundy.jpg"
            alt="Radas Menswear Burgundy Peak-Lapel Barathea Dinner Suit"
            silhouette="suit"
            tone="burgundy"
            eager
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Solid Burgundy Bottom Control Band (Keeps text off photos & fits neatly in 1440x900 fold) */}
      <div className="bg-[#3A0716] border-t border-[#C8A97E]/40 px-6 md:px-10 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="font-mono-spec text-xs uppercase tracking-[0.16em] text-[#C8A97E]">
            Menswear Ready-to-Wear &amp; Custom Sewing &bull; From ₦320,000
          </div>
          <p className="font-sans-ui text-sm text-[#FAF7F2]/90 mt-1">
            48-hour dispatch on Ready-to-Wear sizes S&ndash;3XL &bull; 14-day custom Agbada &amp; suit commissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <motion.button
            type="button"
            onClick={onShopRTW}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { y: 1, scale: 0.985 }}
            transition={{ duration: 0.15, ease: EASE_UI }}
            className="px-6 py-3 rounded-full bg-[#FAF7F2] text-[#1C1618] hover:bg-[#F2ECE1] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
          >
            Shop Ready-to-Wear
          </motion.button>
          <motion.button
            type="button"
            onClick={onBookBespoke}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { y: 1, scale: 0.985 }}
            transition={{ duration: 0.15, ease: EASE_UI }}
            className="px-6 py-3 rounded-full bg-[#5B0E24] hover:bg-[#4A0B1D] text-[#FAF7F2] border border-[#C8A97E] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
          >
            Book Custom Fitting
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/**
 * Intricate Royal Champagne Gold & Wine Corner Filigree Ornaments
 */
export function ExoticFiligreeCorners({ variant = 'gold', size = 22 }) {
  const stroke = variant === 'wine' ? '#5B0E24' : '#C8A97E'
  const cornerPositions = [
    'top-2 left-2',
    'top-2 right-2 rotate-90',
    'bottom-2 right-2 rotate-180',
    'bottom-2 left-2 -rotate-90',
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {cornerPositions.map((pos, idx) => (
        <svg
          key={idx}
          width={size}
          height={size}
          viewBox="0 0 28 28"
          className={`absolute ${pos} opacity-85`}
        >
          <path
            d="M 2 24 L 2 2 L 24 2"
            fill="none"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <path
            d="M 6 18 L 6 6 L 18 6"
            fill="none"
            stroke={stroke}
            strokeWidth="0.9"
            strokeOpacity="0.65"
          />
          <polygon points="6,2 9,6 6,10 3,6" fill={stroke} fillOpacity="0.8" />
        </svg>
      ))}
    </div>
  )
}

/**
 * Interactive 3D Pointer-Tilt Card with Champagne Gold Specular Sheen & Plinth Shadow
 */
export function Tilt3DCard({
  children,
  className = '',
  intensity = 7,
  glare = true,
}) {
  const shouldReduceMotion = useReducedMotion()
  const springCfg = { stiffness: 280, damping: 26, mass: 0.4 }

  const rawRx = useMotionValue(0)
  const rawRy = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawGx = useMotionValue(50)
  const rawGy = useMotionValue(50)
  const rawOpacity = useMotionValue(0)

  const rx = useSpring(rawRx, springCfg)
  const ry = useSpring(rawRy, springCfg)
  const y = useSpring(rawY, springCfg)
  const gx = useSpring(rawGx, { stiffness: 260, damping: 28 })
  const gy = useSpring(rawGy, { stiffness: 260, damping: 28 })
  const glareOpacity = useSpring(rawOpacity, { stiffness: 260, damping: 28 })
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(234, 210, 172, 0.22), transparent 58%)`

  const handleMove = (e) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    rawRx.set(-ny * intensity)
    rawRy.set(nx * intensity)
    rawY.set(-3)
    rawGx.set((nx + 0.5) * 100)
    rawGy.set((ny + 0.5) * 100)
    rawOpacity.set(1)
  }

  const handleLeave = () => {
    rawRx.set(0)
    rawRy.set(0)
    rawY.set(0)
    rawGx.set(50)
    rawGy.set(50)
    rawOpacity.set(0)
  }

  return (
    <div
      className="relative perspective-stage h-full group"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Recessed 3D Brass Plinth Depth */}
      <div
        className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#C8A97E]/45 bg-[#3A0716]/12"
        aria-hidden="true"
      />
      <motion.div
        style={
          shouldReduceMotion
            ? { y }
            : {
                rotateX: rx,
                rotateY: ry,
                y,
              }
        }
        className={`relative preserve-3d h-full gpu-smooth ${className}`}
      >
        {children}
        {glare && !shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              opacity: glareOpacity,
              backgroundImage: glareBg,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}

/**
 * Interactive 3D Exploded Garment & Turntable Studio (Section 01 Bento Centerpiece)
 */
export function Exploded3DGarmentStudio({
  angleObj,
  mode,
  onModeChange,
  rotY,
  onRotYChange,
}) {
  const shouldReduceMotion = useReducedMotion()
  const isExploded = mode === 'exploded'
  const effectiveRotY = shouldReduceMotion ? 0 : rotY
  const effectiveRotX = shouldReduceMotion ? 0 : isExploded ? 6 : 0

  return (
    <div className="relative h-full flex flex-col justify-between editorial-border velvet-damask-bg text-[#FAF7F2] overflow-hidden card-3d-shadow">
      <ExoticFiligreeCorners variant="gold" size={24} />

      {/* Studio Top Bar */}
      <div className="relative z-30 px-4 sm:px-5 pt-4 pb-3 border-b border-[#C8A97E]/35 flex flex-wrap items-center justify-between gap-2 bg-[#3A0716]/80 backdrop-blur-xs">
        <div className="inline-flex rounded-full p-0.5 bg-[#1C1618]/50 border border-[#C8A97E]/45">
          {[
            { id: 'exploded', label: '3D Layer Stage' },
            { id: 'portrait', label: 'Arch Portrait' },
          ].map((tab) => {
            const active = mode === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onModeChange(tab.id)}
                className={`px-3 py-1.5 rounded-full font-mono-spec text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#C8A97E] text-[#1C1618] font-semibold'
                    : 'text-[#F2ECE1]/85 hover:text-[#FAF7F2]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <span className="font-mono-spec text-[11px] uppercase tracking-[0.12em] text-[#C8A97E] px-2.5 py-1 border border-[#C8A97E]/40 rounded-full">
          {rotY >= 0 ? `+${rotY}` : rotY}&deg; 3D Y-Axis
        </span>
      </div>

      {/* 3D Perspective Chamber */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-5 sm:py-7 min-h-[330px] sm:min-h-[430px] perspective-stage overflow-hidden">
        {/* Floor Orbital Pedestal Ellipse */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 sm:bottom-8 w-56 sm:w-72 h-14 sm:h-16 rounded-full border border-[#C8A97E]/45 bg-[#C8A97E]/8 blur-[0.5px]"
          style={{ transform: 'rotateX(72deg)' }}
        />

        <motion.div
          animate={{
            rotateY: effectiveRotY,
            rotateX: effectiveRotX,
          }}
          transition={{ type: 'spring', stiffness: 170, damping: 22 }}
          className="relative preserve-3d flex items-center justify-center"
        >
          {/* Layer 1 (Rear -50px): Bemberg Cupro Lining & Tailoring Block Plane */}
          {isExploded && (
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 0.92 }}
              className="flex flex-col justify-between p-3 sm:p-4 absolute w-44 sm:w-56 h-60 sm:h-72 -translate-x-4 sm:-translate-x-7 translate-y-3 sm:translate-y-4 rounded-t-[90px] sm:rounded-t-[110px] rounded-b-[10px] border border-[#C8A97E]/55 bg-[#3A0716]/95 shadow-2xl"
              style={{ transform: 'translateZ(-42px)' }}
            >
              <div className="font-mono-spec text-[9px] sm:text-[10px] text-[#C8A97E] uppercase tracking-widest text-center pt-2 sm:pt-3">
                Bemberg Interior
              </div>
              <div
                className="flex-1 my-1.5 sm:my-2 rounded-t-[75px] sm:rounded-t-[90px] border border-[#C8A97E]/30 opacity-65"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(200,169,126,0.22) 0 1px, transparent 1px 8px)',
                }}
              />
              <div className="font-mono-spec text-[9px] sm:text-[10px] text-[#F2ECE1]/75 text-center">
                28-Point Block Lining
              </div>
            </motion.div>
          )}

          {/* Layer 2 (Center 0px): Royal Arched Garment Portrait */}
          <div
            className="relative w-48 sm:w-64 h-64 sm:h-80 rounded-t-[105px] sm:rounded-t-[130px] rounded-b-[10px] border-2 border-[#C8A97E] shadow-2xl overflow-hidden bg-[#5B0E24]"
            style={{ transform: 'translateZ(0px)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={angleObj.id}
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0.3, scale: 1.02 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0.25 }}
                transition={{ duration: 0.2, ease: EASE_ENTER }}
                className="w-full h-full"
              >
                <GarmentVisual
                  image={angleObj.image}
                  alt={angleObj.alt}
                  silhouette={angleObj.silhouette}
                  tone={angleObj.tone}
                  zoomOnHover
                  className="w-full h-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Layer 3 (Front +46px): Floating Outer Orbital Ring & Edge Spec Tabs */}
          {isExploded && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 sm:-bottom-5 w-60 sm:w-76 h-14 sm:h-20 rounded-full border-2 border-[#C8A97E]/65"
                style={{ transform: 'translateZ(36px) rotateX(74deg)' }}
              />
              <div
                className="pointer-events-none absolute -left-3 sm:-left-14 bottom-10 sm:bottom-12 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FAF7F2] text-[#5B0E24] border border-[#1C1618] font-mono-spec text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shadow-lg"
                style={{ transform: 'translateZ(46px)' }}
              >
                380gsm Velvet
              </div>
              <div
                className="pointer-events-none absolute -right-3 sm:-right-14 top-10 sm:top-12 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#C8A97E] text-[#1C1618] border border-[#1C1618] font-mono-spec text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-lg"
                style={{ transform: 'translateZ(52px)' }}
              >
                42h Zari Gold
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Interactive 3D Turntable Scrub Bar */}
      <div className="relative z-30 px-3.5 sm:px-5 py-3 border-t border-[#C8A97E]/35 bg-[#3A0716]/90 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-1.5">
          {[-24, 0, 24].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => onRotYChange(deg)}
              className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 font-mono-spec text-[11px] border transition-colors cursor-pointer ${
                rotY === deg
                  ? 'bg-[#C8A97E] text-[#1C1618] border-[#C8A97E] font-semibold'
                  : 'border-[#C8A97E]/45 text-[#F2ECE1] hover:border-[#FAF7F2]'
              }`}
            >
              {deg > 0 ? `+${deg}` : deg}&deg;
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 flex-1 min-w-[130px] sm:max-w-[200px]">
          <span className="font-mono-spec text-[10px] uppercase text-[#C8A97E] whitespace-nowrap">
            Rotate 3D
          </span>
          <input
            type="range"
            min={-32}
            max={32}
            step={1}
            value={rotY}
            onChange={(e) => onRotYChange(Number(e.target.value))}
            aria-label="Rotate 3D Garment Stage Angle"
            className="w-full accent-[#C8A97E] cursor-pointer"
          />
        </label>
      </div>
    </div>
  )
}
