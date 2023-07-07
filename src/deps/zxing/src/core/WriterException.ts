import Exception from './Exception'

/**
 * Custom Error class of type Exception.
 */
export default class WriterException extends Exception {
  static readonly kind: string = 'WriterException'
}
