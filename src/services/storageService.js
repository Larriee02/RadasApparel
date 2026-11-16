import {
  CART_STORAGE_KEY,
  COOKIE_STORAGE_KEY,
  DEFAULT_COOKIE_PREFS,
  TAPE_STORAGE_KEY,
} from '../constants/storageKeys'

function safeGetItem(key) {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage quota or sandboxed iframe errors
  }
}

function safeRemoveItem(key) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore sandboxed storage errors
  }
}

/**
 * Reads persisted cookie consent preferences, or returns null when not yet accepted.
 */
export function readStoredCookiePrefs() {
  const raw = safeGetItem(COOKIE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      ...DEFAULT_COOKIE_PREFS,
      essential: true,
      measurements: Boolean(parsed.measurements),
      analytics: Boolean(parsed.analytics),
    }
  } catch {
    return null
  }
}

/**
 * Persists cookie preferences to localStorage and writes the HTTP consent cookie.
 */
export function writeStoredCookiePrefs(nextPrefs) {
  const payload = {
    ...nextPrefs,
    essential: true,
    updatedAt: new Date().toISOString(),
  }
  safeSetItem(COOKIE_STORAGE_KEY, JSON.stringify(payload))

  if (typeof document !== 'undefined') {
    try {
      document.cookie = `radas_consent=${encodeURIComponent(
        `essential:1|tape:${payload.measurements ? 1 : 0}|stage:${payload.analytics ? 1 : 0}`
      )}; path=/; max-age=15552000; SameSite=Lax`
    } catch {
      // Ignore cookie write errors in restricted frames
    }
  }
  return payload
}

/**
 * Reads persisted cart items safely, ensuring an array return value.
 */
export function readStoredCartItems() {
  const raw = safeGetItem(CART_STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persists shopping bag items safely.
 */
export function writeStoredCartItems(items) {
  safeSetItem(CART_STORAGE_KEY, JSON.stringify(items))
}

/**
 * Reads saved custom tape measurements when consent is active, otherwise returns fallback.
 */
export function readStoredTapeMeasurements(fallback, consentGranted) {
  if (!consentGranted) return fallback
  const raw = safeGetItem(TAPE_STORAGE_KEY)
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

/**
 * Persists or clears custom tape measurements based on active consent flag.
 */
export function writeStoredTapeMeasurements(measurements, consentGranted) {
  if (consentGranted) {
    safeSetItem(TAPE_STORAGE_KEY, JSON.stringify(measurements))
  } else {
    safeRemoveItem(TAPE_STORAGE_KEY)
  }
}
