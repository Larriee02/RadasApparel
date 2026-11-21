import { RTW_SIZES } from '../constants/storageKeys'
import { GALLERY_PRODUCTS_BY_SKU } from '../data/raddasData'

export function normalizeCartItem(item) {
  const product = GALLERY_PRODUCTS_BY_SKU.get(item?.sku)
  if (!product || typeof item.uid !== 'string') return null

  // Older bags encoded the size and purchase mode in a display string.
  const legacyMode = typeof item.mode === 'string' ? item.mode : ''
  const legacySize = legacyMode.match(/\bSize (\w+)$/)?.[1]
  const purchaseMode = item.purchaseMode || (legacySize ? 'rtw' : 'bespoke')
  const size = purchaseMode === 'rtw' ? item.size || legacySize : null
  if (purchaseMode === 'rtw' ? !RTW_SIZES.includes(size) : purchaseMode !== 'bespoke') return null
  if (!item.purchaseMode && !legacySize && !legacyMode.includes('Custom Cut')) return null

  return {
    uid: item.uid,
    sku: product.sku,
    name: product.title,
    purchaseMode,
    size,
    mode: size ? `Ready-to-Wear • Size ${size}` : 'Custom Cut Commission',
    price: size ? product.rtwPrice : product.bespokePrice,
    image: item.image || product.image,
    silhouette: product.silhouette,
    tone: product.tone,
  }
}
