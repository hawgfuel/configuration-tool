/* eslint-disable no-param-reassign */
import { EngagementComponentClient } from '@partnerincentives/engagements-client';
import { FetchError } from 'emt-http-base-client';

import { ServerError } from '../models/country-metadata';

const componentName = 'rewards';
const componentVersion = '1.0';
const correlationIdHeaderKey = 'ms-correlationid';

export abstract class RewardsClient extends EngagementComponentClient {
  private engagementId: string;

  constructor(engagementId: string, apiVersion = componentVersion) {
    super(componentName, apiVersion);
    this.engagementId = engagementId;
  }

  /**
   *
   * @param relativeUri
   * @returns
   */
  fetchData<Out>(relativeUri: string) {
    return this.fetchComponentData<Out>(this.engagementId, relativeUri)
      .then((data) => data.component)
      .catch((error) => RewardsClient.handleException<Out>(error));
  }

  /**
   * TODO: error handling should be moved to base engagement component afterwards
   *
   * @param error
   * @returns
   */
  private static handleException<Out>(error: FetchError): Promise<Out> {
    if (error.status && error.status > 499) {
      // if server error (500) we should display generic message with correlation id
      let errorMessage = 'Internal server error. Please reach out for assistance';
      const correlationId = error.response.headers.get(correlationIdHeaderKey);
      errorMessage = correlationId
        ? `${errorMessage} using the following correlation id: ${correlationId}`
        : '.';

      error.message = errorMessage;
      throw error;
    } else if (error.status) {
      // for other api errors we should display appropriate message from api
      return error.response.json()
        .then((data: ServerError) => {
          error.message = data.Message;
          throw error;
        });
    } else {
      // throw error otherwise
      throw error;
    }
  }
}
