// MICHI Backend - Luxury Social API
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'MICHI running', theme: 'Black #000 Gold #D4AF37' })
})

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, user: 'Michi Official', content: 'Welcome to MICHI ✨' }
  ])
})

const PORT = 3000
app.listen(PORT, () => console.log(`MICHI backend on ${PORT}`))
