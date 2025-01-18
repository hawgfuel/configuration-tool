/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import {
  EngagementComponentClient,
  EngagementUserPrivileges,
} from '@partnerincentives/engagements-client';
import {
  TCustomerAssociation,
  TCustomerAssociationResponse,
} from '../types/customer-association-types';

/**
 * Customer Association component client that calls through the engagement proxy.
 * Based on the EngagementsComponentClient
*/
export class CustomerAssociationClient extends EngagementComponentClient {
  /**
   * Constructor for the component api client
   * The engagements constructor expects a component name, and an api version.
   */
  // NOTE: component name in path. apiVersion in globalconfig
  constructor(apiVersion: string) {
    super('customer-association', apiVersion);
  }

  /**
   * Fetches customer association data with engagements proxy metadata
   *
   * @param engagementId The id of engagement
   * @returns Engagement response object with metadata and customer association data
   */
  fetchCustomerAssociation(engagementId: string)
    : Promise<TCustomerAssociationResponse> {
    return this.fetchComponentData<TCustomerAssociation>(engagementId,
      'customerAssociation/config');
  }

  /**
   * Creates customer association
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  postCustomerAssociation(engagementId: string, customerAssociation: TCustomerAssociation)
    : Promise<TCustomerAssociationResponse> {
    return this.postComponentData<TCustomerAssociation, TCustomerAssociation>(engagementId,
      'customerAssociation/config/', customerAssociation);
  }

  /**
   * Updates customer association data
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  putCustomerAssociation(engagementId: string, customerAssociation: TCustomerAssociation)
    : Promise<TCustomerAssociationResponse> {
    return this.putComponentData<TCustomerAssociation, TCustomerAssociation>(engagementId,
      'customerAssociation/config/', customerAssociation);
  }

  /**
   * Deletes customer association data
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  deleteCustomerAssociation(engagementId: string, customerAssociation: TCustomerAssociation)
    : Promise<TCustomerAssociationResponse> {
    return this.postComponentData<TCustomerAssociation, TCustomerAssociation>(engagementId,
      'customerAssociation/config/', customerAssociation);
  }

  /**
   * Gets user access privileges
   * @returns Engagement user privileges object with privilege array
   */
  fetchPrivileges(): Promise<EngagementUserPrivileges> {
    const uri = `/internal/incentives/api/v${this.componentVersion}/engagements/userPrivileges`;
    return this.fetch<EngagementUserPrivileges>(uri);
  }
}
