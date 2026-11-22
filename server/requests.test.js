import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createRequestApi, openInbox } from './requests.js'

test('request receipts refer to persisted, validated submissions and retries keep the receipt', async (t) => {
  const folder = await mkdtemp(join(tmpdir(), 'radas-inbox-'))
  const previousPath = process.env.RADAS_INBOX_PATH
  process.env.RADAS_INBOX_PATH = join(folder, 'requests.sqlite')
  const server = createRequestApi().listen(0, '127.0.0.1')
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    if (previousPath === undefined) delete process.env.RADAS_INBOX_PATH
    else process.env.RADAS_INBOX_PATH = previousPath
    await rm(folder, { recursive: true, force: true })
  })
  await once(server, 'listening')

  async function submit(kind, payload, key = randomUUID()) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(payload),
    })
    return { status: response.status, ...await response.json() }
  }

  const email = 'test@example.com'
  const note = { email, fullName: 'Test Client', salon: 'Lagos', subject: 'Fitting', message: 'Please contact me.' }
  const key = randomUUID()
  const first = await submit('concierge', note, key)
  assert.equal(first.status, 201)
  assert.equal(typeof first.id, 'string')
  assert.deepEqual(await submit('concierge', note, key), { status: 200, id: first.id })
  assert.equal((await submit('concierge', { ...note, message: 'Different message' }, key)).status, 409)

  const fitting = await submit('fittings', { email, clientName: 'Test Client', garment: 'Kaftan', city: 'Lagos' })
  assert.equal(fitting.status, 201)

  const homeVisit = { email, clientName: 'Test Client', garment: 'Kaftan', city: 'Home Service Fitting' }
  assert.equal((await submit('fittings', homeVisit)).status, 422)
  assert.equal((await submit('fittings', { ...homeVisit, city: 'London Mayfair Fitting' })).status, 422)
  const home = await submit('fittings', { ...homeVisit, address: 'Test address, Lagos' })
  assert.equal(home.status, 201)

  const line = { sku: 'RD-KAF-11', purchaseMode: 'rtw', size: 'L', price: 360000 }
  const order = { email, clientName: 'Test Client', items: [line, line] }
  const staleOrder = { ...order, items: [{ ...line, price: 440000 }] }
  assert.equal((await submit('orders', staleOrder)).status, 422)
  const accepted = await submit('orders', order)
  assert.equal(accepted.status, 201)

  const inbox = openInbox()
  try {
    assert.equal(inbox.prepare('SELECT COUNT(*) AS total FROM requests').get().total, 4)
    const visit = JSON.parse(inbox.prepare('SELECT payload FROM requests WHERE id = ?').get(home.id).payload)
    assert.equal(visit.city, homeVisit.city)
    assert.equal(visit.address, 'Test address, Lagos')
    const record = inbox.prepare('SELECT payload FROM requests WHERE id = ?').get(accepted.id)
    const details = JSON.parse(record.payload)
    assert.equal(details.subtotal, 720000)
    assert.equal(details.items.length, 2)
    assert.deepEqual(details.items.map(({ sku, size, price }) => ({ sku, size, price })), [
      { sku: line.sku, size: line.size, price: line.price },
      { sku: line.sku, size: line.size, price: line.price },
    ])
  } finally {
    inbox.close()
  }
})
