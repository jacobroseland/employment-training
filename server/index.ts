import { createApplicationDraftApp } from './applicationDraftApp.ts'

const port = 8787
const app = createApplicationDraftApp()

app.listen(port, () => {
  console.log(`Application draft API listening at http://127.0.0.1:${port}`)
})
