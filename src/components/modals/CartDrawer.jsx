import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatNaira } from '../../data/raddasData'
import { UI_EASE } from '../../constants/storageKeys'
import { GarmentVisual } from '../AtelierVisuals'

/**
 * Slide-over Atelier Bag Drawer with Escape-key and backdrop dismissal.
 */
function CartDrawer({
  open,
  bagItems,
  bagTotal,
  shouldReduceMotion,
  onClose,
  onRemoveItem,
  onProceedToBooking,
}) {
  useEffect(() => {
    if (!open || typeof window === 'undefined') return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart Drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex justify-end bg-[#1C1618]/65 backdrop-blur-xs"
        >
          <motion.div
            initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
            transition={{ duration: 0.28, ease: UI_EASE }}
            onClick={(e) => e.stopPropagation()}
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
                  onClick={onClose}
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
                          onClick={() => onRemoveItem(item.uid)}
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
                onClick={onProceedToBooking}
                className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] disabled:opacity-40 hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Proceed to Order Review →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(CartDrawer)
