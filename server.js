const express = require('express')
const next = require('next')
const { WorkOS } = require('@workos-inc/node')
const dotenv = require('dotenv')

dotenv.config()

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js
const nextApp = next({ dev, hostname, port })
const handle = nextApp.getRequestHandler()

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
})

nextApp.prepare().then(() => {
  const app = express()

  // Custom Express route for WorkOS callback
  app.get('/callback', async (req, res) => {
    // The authorization code returned by AuthKit
    const code = req.query.code

    if (!code) {
      return res.status(400).send('No code provided')
    }

    try {
      const { user } = await workos.userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID,
      })

      // Use the information in `user` for further business logic.
      console.log(user)

      // Redirect the user to the homepage
      return res.redirect('/')
    } catch (error) {
      console.error('Authentication error:', error)
      return res.status(500).send('Authentication failed')
    }
  })

  // Let Next.js handle all other routes
  app.use((req, res) => {
    return handle(req, res)
  })

  app.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
