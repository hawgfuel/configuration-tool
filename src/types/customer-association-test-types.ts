/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import { EngagementComponentResponseTest } from './engagements-client-test-types';
/**
 * Response Type for data comming from the Engagements Proxy. Metadata is Added by the proxy
*/
export type TCustomerAssociationResponseTest =
EngagementComponentResponseTest<TCustomerAssociation>;
/**
 * Type for CustomerAssociation for an Engagement
*/
export type TCustomerAssociation = {
  id: string;
  engagementId: string;
  engagementVersion: number;
  creationDate: string;
  configSets: TConfigurationSet[];
};

/**
 * Type for a configuration set within a customer association object for an engagement. One customer association object
 * can have multiple configuration sets
*/
export type TConfigurationSet = {
  id: string;
  startDate: string;
  endDate: string;
  daysFromClaimCustomerToCustomerConsent: number,
  daysFromCustomerConsentToSubmitClaim: number,
  daysFromCustomerConsentToFinalReview: number,
  daysFromClaimRejectionToPartnerDispute: number,
  partnerSurveyRequired: boolean,
  customerSurveyRequired: boolean,
  surveyUrlName: string,
  customerLimits: {},
};

export type EngagementExtension = {
  value: boolean;
  message: string;
};
