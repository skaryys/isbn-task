import { type BookRequest } from './types'

export const isBookRequest = (data: any): data is BookRequest => {
  return typeof data.isbn === 'string' &&
    ['new', 'as_new', 'damaged'].includes(data.condition)
}

export const reductor13 = (stringToReduce: string): number => {
  return [...stringToReduce].reduce((acc: number, current: string, index: number) => {
    if (index % 2 === 0) {
      return acc + parseInt(current)
    } else {
      return acc + parseInt(current) * 3
    }
  }, 0)
}

export const reductor10 = (stringToReduce: string): number => {
  return [...stringToReduce].reduce((acc: number, current: string, index: number) => {
    return acc + (10 - index) * parseInt(current === 'X' ? '10' : current)
  }, 0)
}
