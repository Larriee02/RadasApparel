import express from 'express'
import { createRequestApi } from './requests.js'

const app = createRequestApi()
app.use(express.static('dist'))
app.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => {
  console.log('Radas Apparel server is ready.')
})
