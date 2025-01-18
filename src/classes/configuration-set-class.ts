/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import {
  ConfigurationSetBase,
  EligibilityBase,
  isBeforeDate,
} from '@partnerincentives/configset-base-classes';
import {
  TConfigurationSet,
} from '../types/customer-association-types';
// inteface is same as data contract
interface IConfigurationSet {
  id?: string,
  startDate: string | Date,
  endDate: string,
  daysFromClaimCustomerToCustomerConsent: number,
  daysFromCustomerConsentToSubmitClaim: number,
  daysFromClaimRejectionToPartnerDispute: number,
  daysFromCustomerConsentToFinalReview: number,
  partnerSurveyRequired: boolean,
  customerSurveyRequired: boolean,
  surveyUrlName: string,
  customerLimits: {},
}

export class ConfigurationSet extends ConfigurationSetBase {
  endDate: string;

  daysFromClaimCustomerToCustomerConsent!: number;

  daysFromCustomerConsentToSubmitClaim!: number;

  daysFromClaimRejectionToPartnerDispute!: number;

  daysFromCustomerConsentToFinalReview!: number;

  partnerSurveyRequired!: boolean;

  customerSurveyRequired!: boolean;

  surveyUrlName!: string;

  customerLimits!: {};

  constructor(data: IConfigurationSet | TConfigurationSet) {
    super({ id: data.id, startDate: data.startDate });
    this.endDate = data.endDate;
    this.daysFromClaimCustomerToCustomerConsent = data.daysFromClaimCustomerToCustomerConsent;
    this.daysFromCustomerConsentToSubmitClaim = data.daysFromCustomerConsentToSubmitClaim;
    this.daysFromClaimRejectionToPartnerDispute = data.daysFromClaimRejectionToPartnerDispute;
    this.daysFromCustomerConsentToFinalReview = data.daysFromCustomerConsentToFinalReview;
    this.partnerSurveyRequired = data.partnerSurveyRequired;
    this.customerSurveyRequired = data.customerSurveyRequired;
    this.surveyUrlName = data.surveyUrlName;
    this.customerLimits = data.customerLimits;
  }

  /**
     * Returns a boolean indicating if the current config set can be edited or not.
     * @returns true if it can be edited. false if it can't be edited
     */
  public get isEditable() {
    if (isBeforeDate(this.startDate, new Date())) {
      return false;
    }
    return true;
  }

  /**
    * Returns an object with configuration set type
    * @returns the config set cast into the TConfigurationSet format
    */
  toConfigSetType(eligibility: EligibilityBase<any>): TConfigurationSet {
    const endDate = eligibility.getConfigSetEndDate(this);
    return {
      startDate: this.startDate.toISOString(),
      endDate: endDate.toISOString(),
      id: this.id,
      daysFromClaimCustomerToCustomerConsent: this.daysFromClaimCustomerToCustomerConsent,
      daysFromCustomerConsentToSubmitClaim: this.daysFromCustomerConsentToSubmitClaim,
      daysFromClaimRejectionToPartnerDispute: this.daysFromClaimRejectionToPartnerDispute,
      daysFromCustomerConsentToFinalReview: this.daysFromCustomerConsentToFinalReview,
      partnerSurveyRequired: this.partnerSurveyRequired,
      customerSurveyRequired: this.customerSurveyRequired,
      surveyUrlName: this.surveyUrlName,
      customerLimits: this.customerLimits,
    };
  }
}
