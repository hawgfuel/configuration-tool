import React from 'react';
import { Engagement, EngagementConfigClient } from '@partnerincentives/engagements-client';
import { PageTitle } from '@partnercenter-react/ui-webcore';
import { Link } from 'react-router-dom';
import { DetailsList } from '../../components/details-list/details-list';
import { useApi } from '../../hooks';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { getEngagementDetails } from '../../utilities/details-list-utilities';

export type ScopeReadonlyProps = {
  engagement: Engagement;
};

export const ScopeReadonly: React.FC<ScopeReadonlyProps> = ({ engagement }) => {
  const configClient = new EngagementConfigClient();
  const latestVersion = engagement.approvedVersions
    .sort()[engagement.approvedVersions.length - 1] || undefined;
  const [approvedEngagement, isLoading, error] = useApi(
    () => configClient.getEngagementById(engagement.id, latestVersion),
    true,
  );
  return (
    <LoadedContent isLoading={isLoading} error={error}>
      { approvedEngagement
      && (
      <>
        <PageTitle
          title={approvedEngagement.name}
          subTitle="Scope and description"
          inline
        />
        <p>
          <strong> Note: </strong>
          This is the approved version of the engagement.
          To make edits to these values,
          <Link to="edit"> Go to the draft version.</Link>
        </p>
        <DetailsList details={getEngagementDetails(approvedEngagement)} />
      </>
      )}
    </LoadedContent>
  );
};
