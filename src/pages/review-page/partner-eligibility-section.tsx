import React from 'react';
import { PartnerEligibilityClient } from '../../clients/eligibility-client';
import { DetailsList } from '../../components/details-list/details-list';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { useApi } from '../../hooks';
import { convertToFieldDate } from '../../utilities';
import { getPartnerEligibilityDetails } from '../../utilities/details-list-utilities';

export type PESectionProps = {
  engagementId: string;
};

export const PartnerEligibilitySection: React.FC<PESectionProps> = ({ engagementId }) => {
  const PEClient = new PartnerEligibilityClient();

  const [PEConfiguration, isLoading, error, fetchConfiguration] = useApi(
    () => PEClient.fetchPartnerEligibility(engagementId),
    true,
  );

  const sets = PEConfiguration?.component?.configurationSets.map((s) => (
    <>
      <h5 className="spacer-sm-top">
        {`${convertToFieldDate(s.startDate)} to ${convertToFieldDate(s.endDate)} (UTC)`}
      </h5>
      <hr className="win-color-border-color-30" />
      <DetailsList details={getPartnerEligibilityDetails(s)} />
    </>
  )) || 'No configuration for partner qualification';

  return (
    <>
      <h3 className="spacer-lg-top">Partner qualification</h3>
      <LoadedContent isLoading={isLoading} error={error} retryFunction={fetchConfiguration}>
        {sets}
      </LoadedContent>
    </>
  );
};
