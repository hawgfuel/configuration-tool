import {
  EngagementComponentClient,
  EngagementComponentResponse,
} from '@partnerincentives/engagements-client';
import { CustomerConfigurationSet } from './config-set';

/**
 * Type for CustomerEligibility for an Engagement
*/
export type CustomerEligibility = {
  Id?: string;
  engagementId: string;
  engagementVersion: number;
  creationDate: string;
  configurationSets: CustomerConfigurationSet[];
};

/**
 * Response Type for data coming from the Engagements Proxy. Metadata is Added by the proxy
*/
export type CustomerEligibilityResponse = EngagementComponentResponse<CustomerEligibility>;

/**
 * Customer Eligibility component client that calls through the engagement proxy.
 * Based on the EngagementsComponentClient
*/
export class CustomerEligibilityClient extends EngagementComponentClient {
  /**
   * Constructor for the component api client
   * The engagements constructor expects a component name, and an api version.
   */
  constructor(apiVersion: string = '1.0') {
    super('customer-eligibility', apiVersion);
  }

  /**
   * Fetches customer eligibility data with engagements proxy metadata
   *
   * @param engagementId The id of engagement
   * @returns Engagement response object with metadata and customer eligibility data
   */
  fetchCustomerEligibility = (engagementId: string): Promise<CustomerEligibilityResponse> => this
    .fetchComponentData<CustomerEligibility>(engagementId, 'config-rules');
}
