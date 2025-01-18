/* istanbul ignore file */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import {
  AssociationType,
  EngagementComponentResponse,
  EngagementStatus,
  EngagementUserPrivileges,
  EngagementUserRight,
  PartnerRole,
  SolutionArea,
} from '@partnerincentives/engagements-client';
import { addYears, getYear, setYear } from 'date-fns';
import { TCustomerAssociationResponseTest } from '../../types/customer-association-test-types';

const nextYear = getYear(addYears(new Date(), 1));

export const customerAssociationResponseNoConfigSets: any = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {},
};

export const customerAssociationResponse1ConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 12,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'NameOne',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const customerAssociationResponse2ConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-02-28'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 23,
        daysFromCustomerConsentToSubmitClaim: 24,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'NameTwo',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-03-01'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 33,
        daysFromCustomerConsentToSubmitClaim: 40,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'NameThree',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const ceResponseEngagementStartMovedBackConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-02-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-03-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 43,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-04-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 53,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: {},
      },
    ],
  },
};

export const ceResponseEngagementStartMovedForwardConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-02-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-03-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 63,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-04-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 73,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const ceResponseEngagementEndMovedForwardConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-03-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 83,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-04-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-11-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 93,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const ceResponseEngagementEndMovedBackConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-11-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-03-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 13,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-04-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 2,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const ceResponseEngagementConsistentConfigSet: TCustomerAssociationResponseTest = {
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: setYear(new Date('2000-01-02'), nextYear),
    endDate: setYear(new Date('2000-12-31'), nextYear),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: {
    id: '12241-915124124-1251',
    engagementId: '122141jno14-fw-gag0-as-9g',
    engagementVersion: 1,
    creationDate: '2020-11-01T00:00:00Z',
    configSets: [
      {
        id: '124125125-1-512512521-124-1',
        startDate: setYear(new Date('2000-01-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-03-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 3,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
      {
        id: '124125125-1-512512521-124-2',
        startDate: setYear(new Date('2000-04-02'), nextYear).toISOString(),
        endDate: setYear(new Date('2000-12-31'), nextYear).toISOString(),
        daysFromClaimCustomerToCustomerConsent: 3,
        daysFromCustomerConsentToSubmitClaim: 4,
        daysFromCustomerConsentToFinalReview: 2,
        daysFromClaimRejectionToPartnerDispute: 5,
        partnerSurveyRequired: true,
        customerSurveyRequired: false,
        surveyUrlName: 'surveyUrlName',
        customerLimits: [
          { countryCode: 'AF', maxCustomers: 222 }, { countryCode: 'AX', maxCustomers: 333 }],
      },
    ],
  },
};

export const mockEngagementsMetadata = (componentData: any)
: EngagementComponentResponse<any> => ({
  metadata: {
    state: EngagementStatus.Draft,
    programGuid: '21124jh1d0saf',
    id: '122141jno14-fw-gag0-as-9g',
    version: 1,
    startDate: new Date('2021-01-01T00:00:00Z'),
    endDate: new Date('2021-12-31T00:00:00Z'),
    approvedVersions: [],
    solutionArea: SolutionArea.ModernWorkAndSecurity,
    partnerRole: PartnerRole.BuildIntent,
    associationType: AssociationType.CPOR,
  },
  component: componentData,
});

export const mockUserPrivileges = ()
: EngagementUserPrivileges => ({
  rights: [
    EngagementUserRight.CanView,
    EngagementUserRight.CanManage,
  ],
});
