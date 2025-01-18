/* eslint-disable import/extensions */
import { isAfterDate, isBeforeDate } from '@partnerincentives/configset-base-classes';
import { CustomerAssociation } from '../classes/customer-association-class';
import {
  EngagementExtension,
  TCustomerAssociationResponse,
} from '../types/customer-association-types';
import {
  engagementEndDateMovedBackAlert, engagementEndDateMovedForwardAlert,
} from '../constants/alert-messages';

export const isEmpty = (s: string) => (
  s === undefined || s.trim() === ''
);

export type RequirementValidationType = 'Details' | 'Rules';
export interface RequirementValidation {
  code: RequirementValidationType;
  error: string;
}

export const detectEngagementDurationChange = (
  ceResponse: TCustomerAssociationResponse,
  eligibility: CustomerAssociation,
) : EngagementExtension => {
  if (!ceResponse.component || !ceResponse.component.configSets) {
    return {
      value: false,
      message: '',
    };
  }
  const configSets = ceResponse.component.configSets
    .sort((a, b) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf());
  const { length } = ceResponse.component.configSets;
  if (length === 0) {
    return { value: false, message: '' };
  }
  if (isAfterDate(new Date(configSets[length - 1].endDate), eligibility.getEngagementEndDate())) {
    return {
      value: true,
      message: engagementEndDateMovedBackAlert,
    };
  }
  if (isBeforeDate(new Date(configSets[length - 1].endDate), eligibility.getEngagementEndDate())) {
    return {
      value: true,
      message: engagementEndDateMovedForwardAlert,
    };
  }
  return {
    value: false,
    message: '',
  };
};
