import React, { useLayoutEffect, useRef } from 'react'

export default function ModalDialog({ label, onClose, className, children }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement
    dialog.showModal()
    dialog.querySelector('[data-dialog-initial-focus]')?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const stops = [...event.currentTarget.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]'
        )].filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length)
        const active = document.activeElement
        const first = stops[0]
        const last = stops.at(-1)
        if (event.shiftKey ? active === first : active === last) {
          event.preventDefault()
          const next = event.shiftKey ? last : first
          next?.focus()
        }
      }}
      className={`fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none text-[#1C1618] backdrop:bg-transparent ${className}`}
    >
      {children}
    </dialog>
  )
}
