import { FetchError } from 'emt-http-base-client';

const correlationIdHeaderKey = 'ms-correlationid';
let defaultError = 'Something went wrong.';

export const useErrorString = (error: FetchError): string => {
  if (error.status && error.status > 499) {
    // if server error (500) we should display generic message with correlation id
    const errorMessage = 'Internal server error';
    const correlationId = error.response.headers?.get(correlationIdHeaderKey) || undefined;
    defaultError = correlationId
      ? `${errorMessage} using the following correlation id: ${correlationId}`
      : errorMessage;
  }
  if (error.status) {
    // if no message is provided, use common error codes to give a reasonable error string
    switch (error.status) {
      case 401:
        defaultError = 'You are not authorized to make this request';
        break;
      case 403:
        defaultError = 'You do not have permission to make this request';
        break;
      case 404:
        defaultError = 'Requested item was not found';
        break;
      default:
        break;
    }
    if (error.message) {
      // for other api errors we should display appropriate message from api
      return error.message;
    }
  }
  return defaultError;
};
