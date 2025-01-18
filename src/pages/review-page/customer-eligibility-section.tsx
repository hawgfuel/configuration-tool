import React from 'react';
import { CustomerEligibilityClient } from '../../clients/customer-client';
import { DetailsList } from '../../components/details-list/details-list';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { useApi } from '../../hooks';
import { convertToFieldDate } from '../../utilities';
import { getCustomerEligibilityDetails } from '../../utilities/details-list-utilities';

export type CESectionProps = {
  engagementId: string;
};

export const CustomerEligibilitySection: React.FC<CESectionProps> = ({ engagementId }) => {
  const CEClient = new CustomerEligibilityClient();

  const [PEConfiguration, isLoading, error, fetchConfiguration] = useApi(
    () => CEClient.fetchCustomerEligibility(engagementId),
    true,
  );

  const sets = PEConfiguration?.component?.configurationSets.map((s) => {
    const details = getCustomerEligibilityDetails(s);
    return (
      <>
        <h5 className="spacer-sm-top">
          {`${convertToFieldDate(s.startDate)} to ${convertToFieldDate(s.endDate)} (UTC)`}
        </h5>
        <hr className="win-color-border-color-30" />
        { details
          ? <DetailsList details={details} />
          : 'No configuration for customer qualification'}
      </>
    );
  });

  return (
    <>
      <h3 className="spacer-lg-top">Customer qualification</h3>
      <LoadedContent isLoading={isLoading} error={error} retryFunction={fetchConfiguration}>
        {sets}
      </LoadedContent>
    </>
  );
};
