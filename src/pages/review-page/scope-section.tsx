import { Engagement } from '@partnerincentives/engagements-client';
import React from 'react';
import { DetailsList } from '../../components/details-list/details-list';
import { getEngagementDetails } from '../../utilities/details-list-utilities';

export type ScopeSectionProps = {
  engagement: Engagement;
};

export const ScopeSection: React.FC<ScopeSectionProps> = ({ engagement }) => (
  <>
    <h3 className="spacer-lg-top">Scope and description</h3>
    <DetailsList details={getEngagementDetails(engagement)} />
  </>
);
