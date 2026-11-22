import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { formatNaira } from '../../data/raddasData'
import { UI_EASE } from '../../constants/storageKeys'
import { GarmentVisual } from '../AtelierVisuals'
import useRequestSubmission from '../../hooks/useRequestSubmission'
import ModalDialog from './ModalDialog'

/**
 * Slide-over Atelier Bag Drawer with Escape-key and backdrop dismissal.
 */
function CartDrawer({
  bagItems,
  bagTotal,
  shouldReduceMotion,
  onClose,
  onBrowse,
  onRemoveItem,
  onSubmitted,
}) {
  const [review, setReview] = useState(false)
  const { id, error, pending, submit } = useRequestSubmission('orders')
  const headingRef = useRef(null)
  const proceedRef = useRef(null)
  function close() {
    if (!pending) onClose()
  }

  useLayoutEffect(() => {
    if (review) headingRef.current?.focus()
  }, [review, id])

  function returnToBag() {
    setReview(false)
    requestAnimationFrame(() => proceedRef.current?.focus())
  }

  async function submitOrder(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const items = bagItems.map(({ sku, purchaseMode, size, price }) => ({ sku, purchaseMode, size, price }))
    const receipt = await submit({
      clientName: form.get('clientName'),
      email: form.get('email'),
      items,
    })
    if (receipt) onSubmitted(bagItems.map((item) => item.uid))
  }

  return (
    <ModalDialog
      label={review ? 'Order Review' : 'Shopping Cart Drawer'}
      onClose={close}
      className="cart-overlay flex justify-center items-start"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { y: -18, scaleX: 0.87, opacity: 0, clipPath: 'inset(0 0 88% round 32px)' }}
        animate={{ y: 0, scaleX: 1, opacity: 1, clipPath: 'inset(0 0 0% round 32px)' }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: UI_EASE }}
        className="cart-sheet"
      >
        <header className="cart-heading">
          <div>
            <img src="/monogram-wine.png" alt="" width="28" height="24" />
            <h2 ref={headingRef} tabIndex={-1} className="font-serif-display">
              {id ? 'Request received' : review ? 'Order review' : 'Your cart'}
            </h2>
          </div>
          <button type="button" data-dialog-initial-focus aria-label="Close cart"
            aria-disabled={pending} onClick={close} className="cart-close">×</button>
        </header>

        {id ? (
          <p role="status" className="mt-6 break-words text-sm">
            The workroom received your order request. Reference {id}.
          </p>
        ) : bagItems.length === 0 ? (
          <div className="cart-empty">
            <img src="/lookbook/suit-burgundy.jpg" alt="Burgundy dinner jacket from the Radas collection" />
            <div className="cart-empty-caption">
              <p className="font-serif-display">Your cart is empty.</p>
              <button type="button" onClick={onBrowse}>
                Explore the collection <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-[#C8A97E]/50">
            {bagItems.map((item) => (
              <li key={item.uid} className="py-4 flex items-center gap-4">
                <div className="w-16 h-24 rounded-sm overflow-hidden shrink-0">
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
                  <div className="font-serif-display text-xl leading-tight">
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
                  {!review && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.uid)}
                      className="font-mono-spec text-xs underline text-[#1C1618]/70 hover:text-[#5B0E24] cursor-pointer mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {!id && bagItems.length > 0 && (
          <div className="cart-summary">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-spec text-xs uppercase tracking-wider">Cart Subtotal</span>
              <span className="font-serif-display text-3xl font-bold text-[#5B0E24] tabular-nums">
                {formatNaira(bagTotal)}
              </span>
            </div>
            {review ? (
              <form className="space-y-3" onSubmit={submitOrder}>
                <fieldset disabled={pending} className="space-y-3">
                  <label className="block text-sm">
                    Full Name
                    <input name="clientName" autoComplete="name" required maxLength={120}
                      className="mt-1 block w-full border border-[#1C1618]/40 p-2" />
                  </label>
                  <label className="block text-sm">
                    Email Address
                    <input name="email" type="email" autoComplete="email" required maxLength={254}
                      className="mt-1 block w-full border border-[#1C1618]/40 p-2" />
                  </label>
                  <p className="text-sm">The workroom will contact you to arrange payment and any fittings.</p>
                  {error && <p role="alert" className="text-sm text-[#5B0E24]">{error}</p>}
                  <button type="submit" className="w-full bg-[#5B0E24] px-4 py-3 text-sm text-[#FAF7F2] disabled:opacity-50">
                    {pending ? 'Sending…' : 'Send Order Request'}
                  </button>
                  <button type="button" onClick={returnToBag} className="text-sm underline">
                    Back to Bag
                  </button>
                </fieldset>
              </form>
            ) : (
              <button
                type="button"
                ref={proceedRef}
                onClick={() => setReview(true)}
                className="w-full min-h-[46px] py-3.5 px-4 bg-[#5B0E24] disabled:opacity-40 hover:bg-[#3A0716] text-[#FAF7F2] font-sans-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
              >
                Proceed to Order Review →
              </button>
            )}
          </div>
        )}
      </motion.div>
    </ModalDialog>
  )
}

export default React.memo(CartDrawer)
