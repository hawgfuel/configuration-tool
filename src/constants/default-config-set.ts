import { TConfigurationSet } from '../types/customer-association-types';

export const defaultConfigSet: TConfigurationSet = {
  id: '',
  startDate: '',
  endDate: '',
  daysFromClaimCustomerToCustomerConsent: 0,
  daysFromCustomerConsentToSubmitClaim: 0,
  daysFromCustomerConsentToFinalReview: 0,
  daysFromClaimRejectionToPartnerDispute: 0,
  partnerSurveyRequired: false,
  customerSurveyRequired: false,
  surveyUrlName: '',
  customerLimits: {},
};
