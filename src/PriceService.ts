import type IsbnService from './IsbnService'

class PriceService {
  prices: Map<string, number>
  isbnService: IsbnService

  constructor (isbnService: IsbnService) {
    this.prices = new Map()
    this.isbnService = isbnService
  }

  // get price for isbn
  getPrice (isbn: string, randomGenerator: () => number = Math.random): number | undefined {
    const strippedIsbn = isbn.replace(/[-\s]/g, '')

    if (!this.isbnService.isValid13(strippedIsbn)) {
      return undefined
    }

    if (this.prices.has(strippedIsbn)) {
      return this.prices.get(strippedIsbn)
    }

    const fakeFound = randomGenerator() > 0.5
    const price = fakeFound ? 0 : Math.floor(Math.random() * (5000 - 10 + 1)) + 10
    this.prices.set(strippedIsbn, price)

    return price
  }
}

export default PriceService
