import IsbnService from './IsbnService'
import { type IsbnNumbers } from './types'

describe('IsbnService', () => {
  let isbnService: IsbnService

  beforeEach(() => {
    isbnService = new IsbnService()
  })

  describe('isValid13', () => {
    it('should return true for a valid ISBN-13', () => {
      expect(isbnService.isValid13('9788027515868')).toBe(true)
    })

    it('should return false for an invalid ISBN-13', () => {
      expect(isbnService.isValid13('9788027515869')).toBe(false)
    })
  })

  describe('isValid10', () => {
    it('should return true for a valid ISBN-10', () => {
      expect(isbnService.isValid10('8027515866')).toBe(true)
    })

    it('should return false for an invalid ISBN-10', () => {
      expect(isbnService.isValid10('8027515867')).toBe(false)
    })
  })

  describe('getIsbnNumbers', () => {
    it('should return ISBN numbers for a valid ISBN-13', () => {
      const result: IsbnNumbers | undefined = isbnService.getIsbnNumbers('9788027515868')
      expect(result).toEqual({
        isbn10: '8027515866',
        isbn13: '9788027515868'
      })
    })

    it('should return ISBN numbers for a valid ISBN-10', () => {
      const result: IsbnNumbers | undefined = isbnService.getIsbnNumbers('8027515866')
      expect(result).toEqual({
        isbn10: '8027515866',
        isbn13: '9788027515868'
      })
    })

    it('should return undefined for an invalid ISBN', () => {
      const result: IsbnNumbers | undefined = isbnService.getIsbnNumbers('9788027515869')
      expect(result).toBeUndefined()
    })
  })

  describe('convertTo13', () => {
    it('should convert a valid ISBN-10 to ISBN-13', () => {
      const result = isbnService.convertTo13('8027515866')
      expect(result).toBe('9788027515868')
    })
  })

  describe('convertTo10', () => {
    it('should convert a valid ISBN-13 to ISBN-10', () => {
      const result = isbnService.convertTo10('9788027515868')
      expect(result).toBe('8027515866')
    })
  })

  describe('fetchName', () => {
    it('should return a book name for a valid ISBN-13 which is in OpenLibrary', async () => {
      const result = await isbnService.fetchName('9780099492788')
      expect(result).toBe("Coroner's Pidgin")
    })
    it('should return undefined when the book is not in OpenLibrary', async () => {
      const result = await isbnService.fetchName('9788027515868')
      expect(result).toBeUndefined()
    })
  })

  describe('getNameFromIsbns', () => {
    it('should return a book name when the book has ISBN13 on OpenLibrary', async () => {
      const result = await isbnService.getNameFromIsbns('0099492784', '9780099492788')
      expect(result).toBe("Coroner's Pidgin")
    })
    it('should return a book name when the book has only ISBN10 on OpenLibrary', async () => {
      const result = await isbnService.getNameFromIsbns('0749386819', '9780749386818')
      expect(result).toBe('Mr Norris changes trains')
    })
    it('should return undefine for book which is not in OpenLibrary', async () => {
      const result = await isbnService.getNameFromIsbns('8027515866', '9788027515868')
      expect(result).toBeUndefined()
    })
  })
})
