export interface BookRequest {
  isbn: string
  condition: 'new' | 'as_new' | 'damaged'
}

export interface IsbnNumbers {
  isbn10: string
  isbn13: string
}

export enum Condition {
  'new' = 1,
  'as_new' = 0.8,
  'damaged' = 0.5
}

export type Book = Pick<BookRequest, 'condition'> & IsbnNumbers & {
  price?: number
  title?: string
}
