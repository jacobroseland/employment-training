import { createServerApp } from './serverApp.ts'
import { config } from 'dotenv'

config({ path: '.env.local' })

const port = 8787
const app = createServerApp()

app.listen(port, () => {
  console.log(`Application draft API listening at http://127.0.0.1:${port}`)
})
