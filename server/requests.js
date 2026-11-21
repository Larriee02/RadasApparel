import { createHash, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import express from 'express'
import { RTW_SIZES } from '../src/constants/storageKeys.js'
import { GALLERY_PRODUCTS_BY_SKU } from '../src/data/raddasData.js'

const idPattern = /^[a-f0-9-]{36}$/i

export function openInbox() {
  const file = resolve(process.env.RADAS_INBOX_PATH || 'var/requests.sqlite')
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 })
  const previousUmask = process.umask(0o077)
  try {
    const db = new DatabaseSync(file)
    db.exec(`
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        request_key TEXT NOT NULL UNIQUE,
        fingerprint TEXT NOT NULL,
        payload TEXT NOT NULL,
        received_at TEXT NOT NULL
      )
    `)
    return db
  } finally {
    process.umask(previousUmask)
  }
}

class InvalidRequest extends Error {}

function field(body, key, max, required = true) {
  const value = typeof body?.[key] === 'string' ? body[key].trim() : ''
  if ((required && !value) || value.length > max) {
    throw new InvalidRequest(`Check the ${key} field and try again.`)
  }
  return value
}

function validate(kind, body) {
  const email = field(body, 'email', 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new InvalidRequest('Enter a valid email address.')
  }

  if (kind === 'concierge') {
    return {
      email,
      fullName: field(body, 'fullName', 120),
      salon: field(body, 'salon', 120),
      subject: field(body, 'subject', 160),
      message: field(body, 'message', 4000),
    }
  }

  const clientName = field(body, 'clientName', 120)
  if (kind === 'fittings') {
    return {
      email,
      clientName,
      garment: field(body, 'garment', 200),
      city: field(body, 'city', 100),
      chest: field(body, 'chest', 24, false),
      shoulder: field(body, 'shoulder', 24, false),
      sleeve: field(body, 'sleeve', 24, false),
      notes: field(body, 'notes', 4000, false),
    }
  }

  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) {
    throw new InvalidRequest('An order request must contain 1 to 50 items.')
  }
  const items = body.items.map((item) => {
    const product = GALLERY_PRODUCTS_BY_SKU.get(item?.sku)
    const isRtw = item?.purchaseMode === 'rtw'
    const size = isRtw ? item.size : null
    if (!product || (isRtw ? !RTW_SIZES.includes(size) : item?.purchaseMode !== 'bespoke')) {
      throw new InvalidRequest('An item is unavailable. Review your bag and try again.')
    }
    const price = isRtw ? product.rtwPrice : product.bespokePrice
    if (item.price !== price) {
      throw new InvalidRequest('A price has changed. Refresh and review your bag before trying again.')
    }
    return { sku: product.sku, name: product.title, purchaseMode: item.purchaseMode, size, price }
  })
  return { email, clientName, items, subtotal: items.reduce((sum, item) => sum + item.price, 0) }
}

function sqliteInbox() {
  let db
  return {
    find(key) {
      db ??= openInbox()
      return db.prepare('SELECT id, fingerprint FROM requests WHERE request_key = ?').get(key)
    },
    insert(key, record) {
      db ??= openInbox()
      const result = db.prepare(`
        INSERT INTO requests (id, kind, request_key, fingerprint, payload, received_at)
        VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(request_key) DO NOTHING
      `).run(record.id, record.kind, key, record.fingerprint, JSON.stringify(record.payload), record.received_at)
      return result.changes > 0
    },
  }
}

export function createRequestApi(inbox = sqliteInbox()) {
  const app = express()
  app.disable('x-powered-by')
  app.use('/api/v1', express.json({ limit: '32kb' }), async (req, res) => {
    res.set('Cache-Control', 'no-store')
    const kind = req.path.slice(1)
    if (!['concierge', 'fittings', 'orders'].includes(kind)) {
      return res.status(404).json({ error: 'Request endpoint not found.' })
    }
    if (req.method !== 'POST') {
      return res.set('Allow', 'POST').status(405).json({ error: 'Use POST to submit a request.' })
    }
    const key = req.get('Idempotency-Key') || ''
    if (!idPattern.test(key) || !req.is('application/json') || !req.body) {
      return res.status(400).json({ error: 'Invalid request format.' })
    }
    try {
      const fingerprint = createHash('sha256').update(JSON.stringify([kind, req.body])).digest('hex')
      const respond = (record) =>
        record.fingerprint === fingerprint
          ? res.status(200).json({ id: record.id })
          : res.status(409).json({ error: 'This request reference was already used.' })
      const previous = await inbox.find(key)
      if (previous) return respond(previous)

      const payload = validate(kind, req.body)
      const id = randomUUID()
      const stored = await inbox.insert(key, {
        id, kind, fingerprint, payload, received_at: new Date().toISOString(),
      })
      if (!stored) return respond(await inbox.find(key))
      return res.status(201).json({ id })
    } catch (error) {
      if (error instanceof InvalidRequest) return res.status(422).json({ error: error.message })
      console.error('Unable to write to the Radas request inbox.', error.code)
      return res.status(503).json({ error: 'The workroom inbox is unavailable. Please try again.' })
    }
  })
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    return res.set('Cache-Control', 'no-store').status(error.status === 413 ? 413 : 400)
      .json({ error: 'The request was too large or could not be read.' })
  })
  return app
}
