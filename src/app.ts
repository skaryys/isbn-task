import express, { type Express, type Request, type Response } from 'express'
import type PriceService from './PriceService'
import { type Book, type BookRequest, Condition } from './types'
import { isBookRequest } from './utils'
import type IsbnService from './IsbnService'

const createApp = (priceService: PriceService, isbnService: IsbnService): Express => {
  const app: Express = express()
  app.use(express.json())

  app.get('/price', (req: Request, res: Response) => {
    const isbn = req.query.isbn as string

    if (isbn === undefined) {
      res.status(400).send('Nebylo zadáno žádné ISBN')
      return
    }

    const price = priceService.getPrice(isbn)

    // use 0 as to remember which books didnt get price
    if (price !== undefined && price !== 0) {
      res.status(200).json({ price })
    } else {
      res.status(404).send('Nepodařilo se najít cenu pro zadané ISBN')
    }
  })

  app.post('/book/add', (req: Request, res: Response) => {
    (async () => {
      const bookRequest: BookRequest = req.body

      if (!isBookRequest(bookRequest)) {
        res.status(400).send('Neplatný formát požadavku')
        return
      }

      const isbnNumbers = isbnService.getIsbnNumbers(bookRequest.isbn)
      if (isbnNumbers === undefined) {
        res.status(400).send('Neplatné ISBN')
        return
      }

      const book: Book = {
        condition: bookRequest.condition,
        ...isbnNumbers
      }

      const priceResponse = await fetch(`${req.protocol}://${req.get('host')}/price?isbn=${isbnNumbers.isbn13}`)
      if (priceResponse.status === 200) {
        const data = await priceResponse.json()
        book.price = (data.price * Condition[book.condition])
      }

      const nameOfBook = await isbnService.getNameFromIsbns(book.isbn10, book.isbn13)
      if (nameOfBook !== undefined) {
        book.title = nameOfBook
      }

      if (book.price !== undefined && book.title !== undefined) {
        res.status(200).json(book)
      } else {
        res.status(202).json(book)
      }
    })().catch((err) => {
      res.status(500).send(err)
    })
  })

  return app
}

export default createApp
