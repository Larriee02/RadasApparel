import { useRef, useState } from 'react'

const idle = { pending: false, id: null, error: null }

export default function useRequestSubmission(endpoint) {
  const [status, setStatus] = useState(idle)
  const previous = useRef(null)
  const inFlight = useRef(false)

  async function submit(payload) {
    if (inFlight.current) return null
    inFlight.current = true
    setStatus({ ...idle, pending: true })
    try {
      const body = JSON.stringify(payload)
      if (previous.current?.body !== body) {
        previous.current = { body, key: crypto.randomUUID() }
      }
      const response = await fetch(`/api/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': previous.current.key,
        },
        body,
        signal: AbortSignal.timeout(12000),
      })
      const result = await response.json()
      if (!response.ok || typeof result.id !== 'string') {
        setStatus({ ...idle, error: result.error || 'Unable to send your request. Please try again.' })
        return null
      }
      setStatus({ ...idle, id: result.id })
      return result.id
    } catch {
      setStatus({ ...idle, error: 'Unable to reach the workroom. Please try again.' })
      return null
    } finally {
      inFlight.current = false
    }
  }

  function reset() {
    previous.current = null
    setStatus(idle)
  }

  return { ...status, submit, reset }
}
