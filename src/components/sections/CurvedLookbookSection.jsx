import React, { useRef } from 'react'
import { CURVED_GALLERY_ITEMS } from '../../data/raddasData'

function CurvedLookbookSection({ onOpenOutfitInGallery }) {
  const drag = useRef(null)
  const suppressClick = useRef(false)

  function startDrag(event) {
    suppressClick.current = false
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft }
  }

  function moveDrag(event) {
    if (!drag.current || !event.buttons) return
    const rail = event.currentTarget
    const distance = event.clientX - drag.current.x
    if (!suppressClick.current && Math.abs(distance) < 6) return
    suppressClick.current = true
    rail.setPointerCapture(event.pointerId)
    rail.dataset.dragging = 'true'
    rail.scrollLeft = drag.current.left - distance
  }

  function endDrag(event) {
    drag.current = null
    delete event.currentTarget.dataset.dragging
  }

  return (
    <section id="curved-wall" aria-label="Lookbook" className="photobook scroll-mt-24">
      <div
        className="photobook-rail"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={event => { if (!suppressClick.current) endDrag(event) }}
      >
        {CURVED_GALLERY_ITEMS.map(item => (
          <button key={item.id} type="button" className="photobook-print"
            aria-label={`Open ${item.title} full outfit in gallery`}
            onClick={event => {
              if (!event.detail || !suppressClick.current) onOpenOutfitInGallery(item.id)
            }}>
            <img src={item.image} alt={item.alt} loading="lazy" draggable="false" />
          </button>
        ))}
      </div>
    </section>
  )
}

export default React.memo(CurvedLookbookSection)
