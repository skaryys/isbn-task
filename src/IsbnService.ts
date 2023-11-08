import { type IsbnNumbers } from './types'
import { reductor10, reductor13 } from './utils'

class IsbnService {
  // check if it is ISBN13
  isValid13 (isbn: string): boolean {
    if (!/^\d{13}$/.test(isbn)) {
      return false
    }
    const sumIsbn = reductor13(isbn)
    return sumIsbn % 10 === 0
  }

  // check if it is ISBN10
  isValid10 (isbn: string): boolean {
    if (!/^\d{9}[X0-9]$/.test(isbn)) {
      return false
    }
    const sumIsbn = reductor10(isbn)
    return sumIsbn % 11 === 0
  }

  // get both ISBN10 and ISBN13
  getIsbnNumbers (isbn: string): IsbnNumbers | undefined {
    const strippedIsbn = isbn.replace(/[-\s]/g, '')

    if (this.isValid13(strippedIsbn) || this.isValid10(strippedIsbn)) {
      if (this.isValid13(strippedIsbn)) {
        return {
          isbn10: this.convertTo10(strippedIsbn),
          isbn13: strippedIsbn
        }
      }
      if (this.isValid10(strippedIsbn)) {
        return {
          isbn10: strippedIsbn,
          isbn13: this.convertTo13(strippedIsbn)
        }
      }
    }
  }

  // convert ISBN10 to ISBN13
  convertTo13 (isbn: string): string {
    const isbn13base = `978${isbn.slice(0, 9)}`

    const sumIsbn = reductor13(isbn13base)
    return `${isbn13base}${(sumIsbn % 10) === 0 ? 0 : (10 - (sumIsbn % 10))}`
  }

  // convert ISBN 13 to 10
  convertTo10 (isbn: string): string {
    const isbn10base = isbn.slice(3).slice(0, 9)
    const sumIsbn = reductor10(isbn10base)

    return `${isbn10base}${(sumIsbn % 11 === 0) ? 0 : (11 - (sumIsbn % 11))}`
  }

  async fetchName (isbn: string): Promise<string | undefined> {
    try {
      const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)
      const data = await response.json()
      return data.title
    } catch (error) {
      console.log('Kniha nejspíš neexistuje na OpenLibrary')
    }
  }

  async getNameFromIsbns (isbn10: string, isbn13: string): Promise<string | undefined> {
    try {
      const nameFromIsbn13 = await this.fetchName(isbn13)

      if (nameFromIsbn13 !== undefined) {
        return nameFromIsbn13
      }

      const nameFromIsbn10 = await this.fetchName(isbn10)

      if (nameFromIsbn10 !== undefined) {
        return nameFromIsbn10
      }

      return undefined
    } catch (error) {
      console.error(error)
      return undefined
    }
  }
}

export default IsbnService
