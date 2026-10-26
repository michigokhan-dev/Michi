
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader(
      'Vary',
      'Origin'
    )
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'MICHI running',
    theme: 'Black #000 Gold #D4AF37'
  })
})

app.get('/api/posts', (req, res) => {
  res.json([
    {
      id: 1,
      user: 'Michi Official',
      content: 'Welcome to MICHI ✨'
    }
  ])
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MICHI backend on port ${PORT}`)
})
