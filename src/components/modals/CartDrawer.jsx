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
      className="flex justify-end bg-[#1C1618]/65 backdrop-blur-xs"
    >
      <motion.div
        initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.28, ease: UI_EASE }}
        className="w-full max-w-md bg-[#FAF7F2] h-full overflow-y-auto border-l-2 border-[#1C1618] p-6 flex flex-col justify-between shadow-2xl"
      >
        <div>
          <div className="dialog-heading flex items-center justify-between">
            <div>
              <span className="font-mono-spec text-xs uppercase tracking-[0.14em] text-[#5B0E24]">
                Radas Apparel
              </span>
              <h3 ref={headingRef} tabIndex={-1} className="font-serif-display text-2xl font-semibold">
                {id ? 'Order Request Received' : review ? 'Order Review' : `Your Cart (${bagItems.length})`}
              </h3>
            </div>
            <button
              type="button"
              data-dialog-initial-focus
              aria-disabled={pending}
              onClick={close}
              className="min-h-[38px] px-3 py-1 border border-[#1C1618] font-mono-spec text-xs hover:bg-[#1C1618] hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {id ? (
            <p role="status" className="mt-6 break-words text-sm">
              The workroom received your order request. Reference {id}.
            </p>
          ) : bagItems.length === 0 ? (
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
            <ul className="divide-y divide-[#C8A97E]/40 mt-4">
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
        </div>

        {!id && (
          <div className="pt-4 border-t border-[#1C1618]">
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
                disabled={bagItems.length === 0}
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
