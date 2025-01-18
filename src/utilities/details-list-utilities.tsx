import React from 'react';
import { Engagement, PartnerRole } from '@partnerincentives/engagements-client';
import { StyledMarkdown } from '../components/styled-markdown/styled-markdown';
import { enumKeyToString } from './enum-utilities';
import { toLocalizedDate } from './date-utilities';
import { engagementPrograms } from '../constants/engagement-programs';
import { DetailItem } from '../components/details-list/details-list';
import {
  CustomerConfigurationSet,
  CustomerEligibilityRequirement,
  PartnerConfigurationSet,
  CustomerAssociationConfigurationSet,
} from '../clients/config-set';
import { mapSurveyTypes } from './converter-utils';

export const getEngagementDetails = (engagement: Engagement) => {
  const details: DetailItem[] = [
    {
      label: 'Name of engagement:',
      data: engagement.name,
    },
    {
      label: 'Incentive program:',
      data: engagementPrograms
        .find((p) => p.offeringGuid === engagement.offering.offeringGuid)?.friendlyName
        || '',
    },
    {
      label: 'Start date:',
      data: toLocalizedDate(engagement.startDate),
    },
    {
      label: 'End date:',
      data: toLocalizedDate(engagement.endDate),
    },
    {
      label: 'Visible date:',
      data: toLocalizedDate(engagement.visibleDate),
    },
    {
      label: 'Solution area:',
      data: enumKeyToString(engagement.solutionArea),
    },
    {
      label: 'Partner role:',
      data: enumKeyToString(engagement.partnerRole),
    },
    {
      label: 'Maximum association quantity:',
      data: engagement.partnerRole === PartnerRole.BuildIntent
        ? engagement.maximumNumberOfAssociations || 'Unlimited' : 'Not applicable',
    },
    {
      label: 'Association type:',
      data: engagement.associationType
        ? enumKeyToString(engagement.associationType)
        : 'No association',
    },
    {
      label: 'Summary of engagement:',
      data: (
        <div>
          <StyledMarkdown>
            {engagement.description}
          </StyledMarkdown>
        </div>
      ),
    },
  ];

  return details;
};

export const getPartnerEligibilityDetails = (configSet: PartnerConfigurationSet) => {
  const rules = configSet.eligibilityRequirements.map((r) => (
    <li>
      <b>{ r.requirementName }</b>
      <br />
      { r.requirementDescription }
      <br />
    </li>
  ));

  // Engagements can be geo inclusive OR exclusive, not both
  const isGeoInclusive = !!configSet.geographyInclusion.length;
  const geoListItems = isGeoInclusive
    ? configSet.geographyInclusion.map((g) => <li>{g}</li>)
    : configSet.geographyExclusion.map((g) => <li>{g}</li>);

  const partnerListItems = configSet.partnerInclusion.map((m) => (<li>{ m }</li>));

  const details: DetailItem[] = [
    {
      label: 'Eligibility requirements:',
      data: rules.length ? <ul>{rules}</ul> : 'No additional requirements',
    },
    {
      label: isGeoInclusive ? 'Geography inclusion list:' : 'Geography exclusion list:',
      data: <ul>{ geoListItems.length ? geoListItems : 'Not applicable'}</ul>,
    },
    {
      label: 'Partner inclusion list (MPN):',
      data: <ul>{partnerListItems.length ? partnerListItems : 'Not applicable'}</ul>,
    },
    {
      label: 'Evaluation method:',
      data: configSet.evaluationMethod,
    },
  ];

  return details;
};

export const getCustomerEligibilityDetails = (configSet: CustomerConfigurationSet) => {
  const tpidRequirement = configSet.eligibilityRequirements.TPID;
  const tenantRequirement = configSet.eligibilityRequirements.TenantId;
  const rule = (r: CustomerEligibilityRequirement) => (
    <li>
      <b>{ r.requirementName }</b>
      <br />
      { r.requirementDescription }
    </li>
  );

  const details: DetailItem[] = [
    {
      label: 'Performance qualifications:',
      data: (
        <ul>
          {tenantRequirement && rule(tenantRequirement)}
          {tpidRequirement && rule(tpidRequirement)}
        </ul>
      ),
    },
  ];

  return tenantRequirement || tpidRequirement ? details : undefined;
};

export const getCustomerAssociationDetails = (configSet: CustomerAssociationConfigurationSet) => {
  const { startDate } = configSet;
  const { endDate } = configSet;
  const { daysFromClaimCustomerToCustomerConsent } = configSet;
  const { daysFromCustomerConsentToSubmitClaim } = configSet;
  const { daysFromCustomerConsentToFinalReview } = configSet;
  const { daysFromClaimRejectionToPartnerDispute } = configSet;
  const { partnerSurveyRequired } = configSet;
  const { customerSurveyRequired } = configSet;
  const { surveyUrlName } = configSet;
  const { customerLimits } = configSet;

  const details: DetailItem[] = [
    {
      label: 'Start date:',
      data: startDate.slice(0, 10),
    },
    {
      label: 'End date:',
      data: endDate.slice(0, 10),
    },
    {
      // eslint-disable-next-line max-len
      label: 'Timeline for sending and getting customer consent(post adding/claiming customer) (in days)',
      data: daysFromClaimCustomerToCustomerConsent,
    },
    {
      label: 'Timeline for submitting workshop claims (post getting customer consent) (in days)',
      data: daysFromCustomerConsentToSubmitClaim,
    },
    {
      label: 'Timeline in which partner can dispute and resubmit claims after rejection (in days) ',
      data: daysFromCustomerConsentToFinalReview,
    },
    {
      label: 'Timeline for reviewing claims post customer consent (in days)',
      data: daysFromClaimRejectionToPartnerDispute,
    },
    {
      label: 'Parter survey required:',
      data: mapSurveyTypes(partnerSurveyRequired),
    },
    {
      label: 'Customer survey required:',
      data: mapSurveyTypes(customerSurveyRequired),
    },
    {
      label: 'Survey url name:',
      data: surveyUrlName,
    },
    {
      label: 'Customer limits:',
      data: JSON.stringify(
        customerLimits,
      ).replace('{', '').replace('}', '').replace('[', '')
        .replace(']', ''),
    },
  ];

  return details;
};
