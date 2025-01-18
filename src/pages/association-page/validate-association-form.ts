import {
  isAfterDate,
  isBeforeDate,
  isUTCFirstDayOfMonth,
} from '@partnerincentives/configset-base-classes';
import { valueIsRequiredError, startDateError } from '../../constants/alert-messages';
import { TConfigurationSet } from '../../types/customer-association-types';

type AssociationFormData = {
  startDate: string;
  daysFromClaimCustomerToCustomerConsent: string;
  daysFromCustomerConsentToSubmitClaim: string;
  daysFromCustomerConsentToFinalReview: string;
  daysFromClaimRejectionToPartnerDispute: string;
  partnerSurveyRequired: string;
  customerSurveyRequired: string;
};

export const validateAssociationForm = (formData: TConfigurationSet,
  eligibilityStartDate: Date, eligibilityEndDate: Date) => {
  const errors: Partial<AssociationFormData> = {};
  const {
    startDate,
    daysFromClaimCustomerToCustomerConsent,
    daysFromCustomerConsentToSubmitClaim,
    daysFromCustomerConsentToFinalReview,
    daysFromClaimRejectionToPartnerDispute,
    partnerSurveyRequired,
    customerSurveyRequired,
  } = formData;

  if (startDate) {
    const date = new Date(startDate);
    if (isBeforeDate(date, eligibilityStartDate)
        || isAfterDate(date, eligibilityEndDate)
        || !isUTCFirstDayOfMonth(date)) {
      errors.startDate = startDateError;
    }
  } if (!formData.startDate) {
    errors.startDate = startDateError;
  }

  if (!daysFromClaimCustomerToCustomerConsent) {
    errors.daysFromClaimCustomerToCustomerConsent = valueIsRequiredError;
  }
  if (!daysFromCustomerConsentToSubmitClaim) {
    errors.daysFromCustomerConsentToSubmitClaim = valueIsRequiredError;
  }
  if (!daysFromCustomerConsentToFinalReview) {
    errors.daysFromCustomerConsentToFinalReview = valueIsRequiredError;
  }
  if (!daysFromClaimRejectionToPartnerDispute) {
    errors.daysFromClaimRejectionToPartnerDispute = valueIsRequiredError;
  }
  if (!partnerSurveyRequired) {
    errors.partnerSurveyRequired = valueIsRequiredError;
  }
  if (!customerSurveyRequired) {
    errors.partnerSurveyRequired = valueIsRequiredError;
  }
  return errors;
};
