# Radas Apparel — Production System & Engineering Architecture

> Engineering blueprint synthesizing Startup Architecture, Codebase Audit, Root-Cause Production Debugging, Performance Optimization, Clean Modular Refactoring, Backend Database & API Design, Accessible UI System, and Technical Lead Tradeoff Decisions for **Radas Apparel** (`raddas-apparel`).

---

## 1. System Overview & Architectural Vision

Radas Apparel operates an editorial menswear storefront combining ready-to-wear (RTW) e-commerce, 3D/GPU lookbook curation, and custom-measurement fitting workflows at the Lagos workroom, by home visit, or by live video.

### Target End-to-End Architecture

```
+-------------------------------------------------------------------+
| Edge & CDN (Cloudflare / Vercel Edge)                             |
| - Static SPA bundles (Vite) & immutable WebP/AVIF lookbook assets |
| - Geo-routed currency/salon hints & TLS termination               |
+-------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------+
| Modular React 19 Client (src/)                                    |
| - Orchestrator: App.jsx (page routing, cart, catalog filter state)|
| - Persistent Local State: services/storageService.js              |
| - Isolated Form/Scroll State: Modals, ContactSection, FloatingUI  |
| - GPU Composited Motion: Framer Motion (useMotionValue/Transform) |
+-------------------------------------------------------------------+
                                 | HTTPS JSON / REST (v1)
                                 v
+-------------------------------------------------------------------+
| Application API Layer (Node.js / Fastify or Go REST Gateway)      |
| - Catalog & Lookbook Read Path (Redis-backed read-through cache)  |
| - Cart Checkout, Tape Profiles, Fitting Appointments, Concierge   |
| - Rate Limiting, Zod/Schema Validation, Idempotency Keys          |
+-------------------------------------------------------------------+
                  |                               |
                  v                               v
+---------------------------------+   +-----------------------------+
| Primary Database (PostgreSQL)   |   | Cache & Session (Redis)     |
| - Normalized relational schema  |   | - Catalog & Lookbook cache  |
| - Row-level transactional ACID  |   | - Appointment slot locking  |
+---------------------------------+   +-----------------------------+
```

---

## 2. Codebase Audit (Pre-Refactor `src/App.jsx` Analysis)

Prior to modularization, `src/App.jsx` grew to **2,694 lines**, consolidating routing, state persistence, 5 homepage editorial sections, a full-page Gallery view, modal drawers, navigation, footer, and floating cookie/scroll controls in a single component tree.

### Identified Risks & Defects

| Category | Finding in Original Code | Production Impact | Resolution |
| --- | --- | --- | --- |
| **Monolithic Component** | 2,694-line `src/App.jsx` holding UI sections, constants, persistence helpers, and modals | High merge conflict surface, poor tree-shaking/code review velocity, tight coupling | Split into `constants/`, `services/`, `components/layout/`, `components/modals/`, `components/sections/`, `components/pages/` |
| **Global Scroll Re-Renders** | `window.addEventListener('scroll')` updating `scrolledPastFold` state directly inside `App` | Re-rendered the entire page DOM (OrbitHero, Catalog, Lookbook, Footer) when crossing the `180px` threshold | Isolated `scrolledPastFold` inside `ScrollToTopButton` in `FloatingControls.jsx` using `{ passive: true }` |
| **Keystroke Re-Renders** | `bespokeForm` and `contactForm` lived in top-level `App` state | Every single character typed into the Fitting Modal or Contact form re-rendered unrelated catalog and hero trees | Moved `bespokeForm` state into `BespokeFittingModal` and `contactForm` / `contactSubmitted` state into `ContactSection` |
| **Missing Modal Dismissal** | `CartDrawer` and `BespokeFittingModal` lacked `Escape` key listeners and backdrop click-to-close handlers | Trapped keyboard users or forced pointer travel to small close buttons | Added `keydown` (`Escape`) handlers, backdrop `onClick` dismissal, and `role="dialog"` / `aria-modal="true"` attributes |
| **Storage Resilience** | Inline `localStorage` and `document.cookie` logic scattered inside `App.jsx` | Hard to test independently or guard uniformly against quota/sandboxed storage errors | Extracted defensive wrappers into `src/services/storageService.js` backed by `src/constants/storageKeys.js` |

---

## 3. Clean Modular Frontend Architecture

```text
src/
├── constants/
│   └── storageKeys.js          # Storage keys, cookie defaults, NAV_ITEMS, RTW_SIZES, easing tokens
├── services/
│   └── storageService.js       # Defensive localStorage & consent cookie persistence helpers
├── data/
│   └── raddasData.js           # Garments, Curved Lookbook outfits, Materials, Salons, Naira formatter
├── components/
│   ├── AtelierVisuals.jsx      # 3D garment cards, couture seal, exploded garment studio
│   ├── HeroTemplates.jsx       # 10-outfit 3D OrbitHero showcase
│   ├── layout/
│   │   ├── HeaderNavbar.jsx    # Memoized glassy navigation bar & mobile drawer
│   │   ├── AtelierFooter.jsx   # Memoized multi-column salon footer
│   │   └── FloatingControls.jsx# CookieConsentPopup & isolated ScrollToTopButton
│   ├── modals/
│   │   ├── CartDrawer.jsx      # Accessible shopping bag drawer (Escape + backdrop close)
│   │   └── BespokeFittingModal.jsx # Custom measurement & fitting modal with local form state
│   ├── pages/
│   │   └── GalleryPage.jsx     # Full collection gallery linked directly from Lookbook selection
│   └── sections/
│       ├── CuttingTableSection.jsx # Garment cutting & measurement intake workbench
│       ├── MaterialsSection.jsx    # Fabric palette & macro inspection section
│       ├── AboutSection.jsx        # House heritage, atelier metrics, and craft chapters
│       ├── ContactSection.jsx      # Salon directory & concierge form with local state
│       └── CurvedLookbookSection.jsx # GPU MotionValue 3D curved lookbook carousel
└── App.jsx                     # Slim top-level orchestrator (~350 lines)
```

---

## 4. Performance Optimization Strategy

1. **Render-Tree Isolation**: Moving scroll listeners (`ScrollToTopButton`) and text-input controlled states (`BespokeFittingModal`, `ContactSection`) out of `App.jsx` keeps parent reconciliations flat during typing and scrolling.
2. **Memoized Structural Chrome**: Wrapping `HeaderNavbar` and `AtelierFooter` in `React.memo` avoids unnecessary DOM diffing on route switches or bag updates that do not affect header/footer props.
3. **GPU-Composited Lookbook Motion**: `CurvedLookbookSection` drives horizontal drag/wheel/mouse-scrub displacements through Framer Motion `MotionValue` (`useMotionValue`, `useSpring`, `useTransform`) updating GPU `transform3d` / `rotateY` without React state updates per animation frame.
4. **Defensive Storage Consent Gating**: Measurement persistence (`TAPE_STORAGE_KEY`) respects explicit cookie consent flags (`cookiePrefs.measurements`) while keeping essential shopping bag state (`CART_STORAGE_KEY`) fail-safe inside sandboxed contexts.

---

## 5. Production Backend Database Schema (PostgreSQL DDL)

When graduating from static JSON (`raddasData.js`) + `localStorage` to a persistent multi-region backend, the system uses the following normalized PostgreSQL schema:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Core Menswear Garments Catalog
CREATE TABLE garments (
    id              TEXT PRIMARY KEY,
    slug            TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL, -- 'Agbada', 'Kaftan', 'Senator', 'Evening', 'Outerwear'
    price_ngn       INTEGER NOT NULL CHECK (price_ngn > 0),
    fabric_summary  TEXT NOT NULL,
    image_url       TEXT NOT NULL,
    available_sizes TEXT[] NOT NULL DEFAULT ARRAY['S','M','L','XL','2XL','3XL'],
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    lead_time_days  SMALLINT NOT NULL DEFAULT 14,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_garments_category ON garments(category);
CREATE INDEX idx_garments_featured ON garments(is_featured) WHERE is_featured = TRUE;

-- 2. Lookbook Outfits & Deep-Link Mapping
CREATE TABLE lookbook_outfits (
    id              TEXT PRIMARY KEY,
    garment_id      TEXT NOT NULL REFERENCES garments(id) ON DELETE RESTRICT,
    title           TEXT NOT NULL,
    subtitle        TEXT,
    display_order   SMALLINT NOT NULL,
    hero_image_url  TEXT NOT NULL,
    orbit_featured  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lookbook_order ON lookbook_outfits(display_order);

-- 3. Client Custom Measurement Profiles
CREATE TABLE measurement_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_email    TEXT NOT NULL,
    client_name     TEXT NOT NULL,
    chest_inches    NUMERIC(5,2),
    shoulder_inches NUMERIC(5,2),
    sleeve_inches   NUMERIC(5,2),
    waist_inches    NUMERIC(5,2),
    trouser_outseam NUMERIC(5,2),
    fit_preference  TEXT NOT NULL DEFAULT 'Tailored',
    consent_granted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_measurement_email ON measurement_profiles(client_email);

-- 4. Orders & Line Items
CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number        TEXT UNIQUE NOT NULL,
    client_email        TEXT NOT NULL,
    status              TEXT NOT NULL CHECK (status IN ('pending','paid','cutting','fitting','shipped','cancelled')),
    currency            TEXT NOT NULL DEFAULT 'NGN',
    subtotal_ngn        INTEGER NOT NULL CHECK (subtotal_ngn >= 0),
    measurement_id      UUID REFERENCES measurement_profiles(id) ON DELETE SET NULL,
    idempotency_key     TEXT UNIQUE NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    garment_id      TEXT NOT NULL REFERENCES garments(id),
    selected_size   TEXT NOT NULL,
    quantity        SMALLINT NOT NULL CHECK (quantity > 0),
    unit_price_ngn  INTEGER NOT NULL CHECK (unit_price_ngn > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 5. Private Salon Fitting Appointments
CREATE TABLE fitting_appointments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fitting_channel TEXT NOT NULL CHECK (fitting_channel IN ('Lagos Atelier Fitting','Home Service Fitting','Live Video Tape Consultation')),
    garment_id      TEXT REFERENCES garments(id) ON DELETE SET NULL,
    client_name     TEXT NOT NULL,
    client_email    TEXT NOT NULL,
    client_phone    TEXT NOT NULL,
    preferred_date  DATE NOT NULL,
    notes           TEXT,
    status          TEXT NOT NULL DEFAULT 'requested',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_salon_date ON fitting_appointments(salon_city, preferred_date);

-- 6. Concierge & Press Inquiries
CREATE TABLE concierge_inquiries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    salon_city      TEXT,
    topic           TEXT NOT NULL,
    message         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'open',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 6. REST API Design & Caching Strategy

### Endpoints (`v1`)

| Method & Path | Purpose | Cache / Consistency Policy |
| --- | --- | --- |
| `GET /api/v1/catalog/garments` | List garments with optional `?category=` & `?size=` filters | CDN + Redis cache (`TTL 300s`, `stale-while-revalidate=60`) |
| `GET /api/v1/lookbook` | Fetch ordered 3D Curved Lookbook items linked to full Gallery outfits | Redis read-through cache (`TTL 600s`) |
| `POST /api/v1/measurements` | Persist or update a client's tape measurement profile (requires consent flag) | Private no-store; validates numeric bounds |
| `POST /api/v1/orders` | Create transactional order + reserve inventory | Requires `Idempotency-Key` header; DB transaction |
| `POST /api/v1/fittings` | Request a Lagos workroom, home-service, or video fitting | Redis short lock (`15s`) on double-booking slots |
| `POST /api/v1/concierge` | Submit contact & press inquiries with async email dispatch | Rate-limited (`5 req/min/IP`) |

---

## 7. Technical Lead Tradeoff Decisions (5-Year Maintainability)

1. **Incremental Modular Extraction vs. Instant TypeScript Rewrite**:
   - *Decision*: Decomposed `App.jsx` into cohesive ES module boundaries (`constants/`, `services/`, `layout/`, `modals/`, `sections/`, `pages/`) while preserving exact Tailwind classes, copy, and `raddasData.js` schema first.
   - *Tradeoff*: Avoids churn across working JSX and GSAP/Framer Motion bindings while setting crisp file boundaries so individual slices can later adopt TypeScript `.ts`/`.tsx` or React Router URL synchronization cleanly.
2. **Scoped Local Component State vs. Heavy External Store (Redux/Zustand)**:
   - *Decision*: Kept top-level route/catalog/cart state in `App.jsx` paired with `storageService.js`, while pushing high-frequency scroll and form input states down to leaf components (`ScrollToTopButton`, `BespokeFittingModal`, `ContactSection`).
   - *Tradeoff*: Zero new bundle overhead and trivial mental model today; once multi-tab server sync is needed, `App.jsx` hooks swap directly to React Query + backend REST endpoints without rewriting presentational components.
3. **Consent-Gated Browser Persistence**:
   - *Decision*: Enforced consent checks on custom tape storage (`COOKIE_STORAGE_KEY = 'radas_cookie_prefs_v2'`) alongside resilient try/catch wrappers in `storageService.js`.
   - *Tradeoff*: Prevents silent `QuotaExceededError` or blocked third-party iframe crashes in strict browser sandboxes.
