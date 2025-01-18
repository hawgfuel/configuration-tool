import React from 'react';
import { CustomerAssociationClient } from '../../clients/customer-association-section-client';
import { DetailsList } from '../../components/details-list/details-list';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { useApi } from '../../hooks';
import { convertToFieldDate } from '../../utilities';
import { getCustomerAssociationDetails } from '../../utilities/details-list-utilities';

export type CAssociationSectionProps = {
  engagementId: string;
};

export const CustomerAssociationSection: React.FC<CAssociationSectionProps> = (
  { engagementId },
) => {
  const CAClient = new CustomerAssociationClient();

  const [PEConfiguration, isLoading, error, fetchConfiguration] = useApi(
    () => CAClient.fetchCustomerAssociation(engagementId),
    true,
  );

  const sets = PEConfiguration?.component?.configSets.map((s) => {
    const details = getCustomerAssociationDetails(s);
    return (
      <>
        <h5 className="spacer-sm-top">
          {`${convertToFieldDate(s.startDate)} to ${convertToFieldDate(s.endDate)} (UTC)`}
        </h5>
        <hr className="win-color-border-color-30" />
        { details
          ? <DetailsList details={details} />
          : 'No configuration for customer association'}
      </>
    );
  });

  return (
    <>
      <h3 className="spacer-lg-top">Customer association</h3>
      <LoadedContent isLoading={isLoading} error={error} retryFunction={fetchConfiguration}>
        {sets}
      </LoadedContent>
    </>
  );
};
