export interface CountryMetadata {
  name: string,
  isocode: string,
}
export interface ServerError {
  ErrorCode: string,
  HttpStatus: string,
  HttpStatusCode: number,
  Message: string,
}
export interface IMaxCustomer {
  maxCustomers: number,
  isoCountryCode: string,
}
