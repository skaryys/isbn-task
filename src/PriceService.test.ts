import IsbnService from './IsbnService'
import PriceService from './PriceService'

describe('PriceService', () => {
  let priceService: PriceService
  const isbnService: IsbnService = new IsbnService()

  beforeEach(() => {
    priceService = new PriceService(isbnService)
  })

  describe('getPrice', () => {
    it('should return undefined for nonvalid isbn', () => {
      expect(priceService.getPrice('9788027515869')).toBeUndefined()
    })
    it('should return price 0 for isbn which is valid when random fake function decides it should be fake', () => {
      const mockRandomGenerator = jest.fn(() => 0.6)
      expect(priceService.getPrice('9788027515868', mockRandomGenerator)).toBe(0)
    })
    it("should return price between 10 and 5000 for isbn which is valid when random fake function decides it shouldn't be fake and it should return it again", () => {
      const mockRandomGenerator = jest.fn(() => 0.4)
      const price1 = priceService.getPrice('9788027515868', mockRandomGenerator)
      expect(price1).toBeGreaterThanOrEqual(10)
      expect(price1).toBeLessThanOrEqual(5000)
      const price2 = priceService.getPrice('9788027515868', mockRandomGenerator)
      expect(price2).toBe(price1)
    })
  })
})
