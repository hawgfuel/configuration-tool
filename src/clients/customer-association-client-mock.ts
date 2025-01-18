/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* istanbul ignore file */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import { EngagementUserPrivileges } from '@partnerincentives/engagements-client';
import {
  TCustomerAssociation,
  TCustomerAssociationResponse,
} from '../types/customer-association-types';
import {
  customerAssociationResponse1ConfigSet,
  mockEngagementsMetadata,
  mockUserPrivileges,
} from './mocks/customer-association-mock-data';

/**
 * Customer Association component mock client
*/
export class CustomerAssociationClient {
  /**
   * Constructor for the component api client
   * This constructor is just added for consistency with non-mock client
   */

  constructor(apiVersion: string) {}

  /**
   * Returns a mock response object
   *
   * @param engagementId The id of engagement
   * @returns Engagement response object with metadata and customer association data
   */
  fetchCustomerAssociation = (engagementId: string)
  : Promise<TCustomerAssociationResponse> => Promise.resolve(
    customerAssociationResponse1ConfigSet,
  );

  /**
   * Bounces back the received customerAssociation object, appending mock engagements metadata
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  postCustomerAssociation = (engagementId: string, customerAssociation: TCustomerAssociation)
  : Promise<TCustomerAssociationResponse> => Promise
    .resolve(mockEngagementsMetadata(customerAssociation));

  /**
   * Bounces back the received customerAssociation object, appending mock engagements metadata
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  putCustomerAssociation = (engagementId: string, customerAssociation: TCustomerAssociation)
  : Promise<TCustomerAssociationResponse> => Promise
    .resolve(mockEngagementsMetadata(customerAssociation));

  /**
   * Bounces back the received customerAssociation object, appending mock engagements metadata
   *
   * @param engagementId The id of engagement
   * @param customerAssociation Customer association object with data for association for current engagement
   * @returns Engagement response object with metadata and customer association data
   */
  deleteCustomerAssociation = (engagementId: string, customerAssociation: TCustomerAssociation)
  : Promise<TCustomerAssociationResponse> => Promise
    .resolve(mockEngagementsMetadata(customerAssociation));

  /**
   * Sends back a mock user privileges
   *
   * @returns Engagement user privileges object with privilege array
   */
  fetchPrivileges = ()
  : Promise<EngagementUserPrivileges> => Promise
    .resolve(mockUserPrivileges());
}
