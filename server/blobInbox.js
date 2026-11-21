import { get, put } from '@vercel/blob'

export const blobInbox = {
  async find(key) {
    const file = await get(`requests/${key}.json`, { access: 'private', useCache: false })
    if (!file) return null
    if (file.statusCode !== 200) throw new Error('Unable to read the request inbox')
    return new Response(file.stream).json()
  },

  async insert(key, record) {
    try {
      await put(`requests/${key}.json`, JSON.stringify(record), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: false,
      })
      return true
    } catch (error) {
      // A concurrent retry may have stored the record first.
      if (await this.find(key)) return false
      throw error
    }
  },
}
