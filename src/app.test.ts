import IsbnService from './IsbnService'
import PriceService from './PriceService'
import createApp from './app'
import request from 'supertest'

describe('app', () => {
  const isbnService = new IsbnService()
  const priceService = new PriceService(isbnService)
  const app = createApp(priceService, isbnService)

  describe('GET /price', () => {
    it('should return 400 when no isbn is provided', async () => {
      const response = await request(app).get('/price')
      expect(response.status).toBe(400)
    })
    it("should return 404 when price isn't found", async () => {
      const response = await request(app).get('/price?isbn=9788027515869')
      expect(response.status).toBe(404)
    })
    it('should return 200 when price is found', async () => {
      const getPriceMock = jest.spyOn(priceService, 'getPrice')
      getPriceMock.mockReturnValue(10)
      const response = await request(app).get('/price?isbn=9788027515868')
      expect(response.status).toBe(200)
      expect(response.body.price).toBeGreaterThanOrEqual(10)
    })
  })

  describe('POST /book/add', () => {
    it("should return 400 when the format of request isn't correct", async () => {
      const bookRequest = {
        first: 'something',
        second: 'something'
      }
      const response = await request(app).post('/book/add').send(bookRequest)
      expect(response.status).toBe(400)
    })
    it("should return 400 when the isbn isn't valid", async () => {
      const bookRequest = {
        isbn: '9788027515869',
        condition: 'as_new'
      }
      const response = await request(app).post('/book/add').send(bookRequest)
      expect(response.status).toBe(400)
    })
    it('should return 200 when isbn is valid and price and name is found', async () => {
      const getPriceMock = jest.spyOn(priceService, 'getPrice')
      getPriceMock.mockReturnValue(100)
      const bookRequest = {
        isbn: '0749386819',
        condition: 'as_new'
      }
      const response = await request(app).post('/book/add').send(bookRequest)
      expect(response.status).toBe(200)
      expect(response.body.title).toBe('Mr Norris changes trains')
    })
    it('should return 202 when isbn is valid but price is not found', async () => {
      const getPriceMock = jest.spyOn(priceService, 'getPrice')
      getPriceMock.mockReturnValue(undefined)
      const bookRequest = {
        isbn: '0749386819',
        condition: 'as_new'
      }
      const response = await request(app).post('/book/add').send(bookRequest)
      expect(response.status).toBe(202)
      expect(response.body.title).toBe('Mr Norris changes trains')
    })
    it("should return 202 when isbn is valid but name isn't found", async () => {
      const getPriceMock = jest.spyOn(priceService, 'getPrice')
      getPriceMock.mockReturnValue(100)
      const bookRequest = {
        isbn: '9788027515868',
        condition: 'as_new'
      }
      const response = await request(app).post('/book/add').send(bookRequest)
      expect(response.status).toBe(202)
    })
  })
})
