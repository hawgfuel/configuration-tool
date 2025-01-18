import {
  EngagementComponentClient,
  EngagementComponentResponse,
} from '@partnerincentives/engagements-client';
import { PartnerConfigurationSet } from './config-set';

export type PartnerEligibility = {
  id?: string;
  engagementId: string;
  engagementVersion: number;
  configurationSets: PartnerConfigurationSet[];
};

export type PartnerEligibilityResponse = EngagementComponentResponse<PartnerEligibility>;

// v1.0 is for legacy partner eligibility and v2.0 is for engagements.
const componentVersion = '2.0';

export class PartnerEligibilityClient extends EngagementComponentClient {
  constructor(apiVerison: string = componentVersion) {
    super('partner-eligibility', apiVerison);
  }

  /**
   * Fetches partner eligibility data with engagements proxy metadata
   *
   * @param engagementId The id of engagement
   * @returns Partner eligibility configuration (latest version or draft)
   */
  fetchPartnerEligibility = (engagementId: string): Promise<PartnerEligibilityResponse> => this
    .fetchComponentData<PartnerEligibility>(engagementId, 'partnerEligibility');
}
