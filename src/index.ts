import dotenv from 'dotenv'
import PriceService from './PriceService'
import IsbnService from './IsbnService'
import createApp from './app'

dotenv.config()

const port = process.env.PORT
const isbnService = new IsbnService()
const priceService = new PriceService(isbnService)

const app = createApp(priceService, isbnService)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
