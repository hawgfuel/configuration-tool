export type PartnerEligibilityRequirements = {
  requirementId: string;
  requirementName: string;
  requirementDescription: string;
  rules: Object;
};

export type PartnerConfigurationSet = {
  id?: string;
  startDate: string;
  endDate: string;
  eligibilityRequirements: PartnerEligibilityRequirements[];
  geographyInclusion: string[];
  geographyExclusion: string[];
  partnerInclusion: string[];
  evaluationMethod: string;
};

export enum CustomerId {
  TPID = 'TPID',
  tenantID = 'TenantId',
}

export type CustomerEligibilityRequirement = {
  customerIdType: string;
  requirementId: string,
  requirementName: string,
  dimensionType: string,
  requirementDescription: string,
  rules: Object;
};

export type CustomerConfigurationSet = {
  id?: string;
  startDate: string;
  endDate: string;
  eligibilityRequirements: { [ key in CustomerId ]?: CustomerEligibilityRequirement };
};

export type CustomerAssociationConfigurationSet = {
  id?: string;
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
