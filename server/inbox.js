import { openInbox } from './requests.js'

const db = openInbox()
try {
  for (const { payload, ...request } of db.prepare(
    'SELECT id, kind, received_at, payload FROM requests ORDER BY received_at DESC'
  ).iterate()) {
    console.log(JSON.stringify({ ...request, payload: JSON.parse(payload) }))
  }
} finally {
  db.close()
}
