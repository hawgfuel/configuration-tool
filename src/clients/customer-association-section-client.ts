import {
  EngagementComponentClient,
  EngagementComponentResponse,
} from '@partnerincentives/engagements-client';
import { CustomerAssociationConfigurationSet } from './config-set';

/**
   * Type for CustomerAssociation for an Engagement
  */
export type CustomerAssociation = {
  Id?: string;
  engagementId: string;
  engagementVersion: number;
  creationDate: string;
  configSets: CustomerAssociationConfigurationSet[];
};

/**
   * Response Type for data coming from the Engagements Proxy. Metadata is Added by the proxy
  */
export type CustomerAssociationResponse = EngagementComponentResponse<CustomerAssociation>;

/**
   * Customer Association component client that calls through the engagement proxy.
   * Based on the EngagementsComponentClient
  */
export class CustomerAssociationClient extends EngagementComponentClient {
  /**
     * Constructor for the component api client
     * The engagements constructor expects a component name, and an api version.
     */
  constructor(apiVersion: string = '1.0') {
    super('customer-association', apiVersion);
  }

  /**
     * Fetches customer association data with engagements proxy metadata
     *
     * @param engagementId The id of engagement
     * @returns Engagement response object with metadata and customer association data
     */
  fetchCustomerAssociation = (engagementId: string): Promise<CustomerAssociationResponse> => this
    .fetchComponentData<CustomerAssociation>(engagementId, 'customerAssociation/config');
}
