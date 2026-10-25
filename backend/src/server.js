import express from 'express'
const app = express()
app.get('/api', (req,res) => res.json({michi: 'running', color: 'black & gold'}))
app.listen(3000, () => console.log('MICHI backend on 3000'))
