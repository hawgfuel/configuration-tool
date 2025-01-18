import React, { useEffect, useState } from 'react';
import {
  EngagementConfigClient, Engagement,
} from '@partnerincentives/engagements-client';
import {
  useParams, Switch, Route, Redirect,
} from 'react-router-dom';
import { useUserPrivilegesContext } from '@partnerincentives/engagements-common';
import { ScopeEdit } from './scope-edit';
import { ScopeReadonly } from './scope-readonly';
import { useApi } from '../../hooks/use-api';
import { useEngagementBreadcrumb } from '../../hooks/use-engagement-breadcrumb';
import { LoadedContent } from '../../components/loaded-content/loaded-content';

type ScopePageParams = {
  engagementId: string;
};

export const ScopePage: React.FC = () => {
  const EngagementsClient = new EngagementConfigClient();
  const { engagementId } = useParams<ScopePageParams>();

  const [, isUserPrivilegesLoading] = useUserPrivilegesContext();
  const [draftEngagement, isLoading, error, fetchDraft] = useApi(
    () => EngagementsClient.getEngagementById(engagementId), true,
  );
  // Maintain separate state in this case so that we can immediately update engagement on save
  const [engagement, setEngagement] = useState<Engagement>();

  useEffect(() => {
    setEngagement(draftEngagement);
  }, [draftEngagement]);

  // Simple counter to use as key on scope form to ensure elements
  // are properly regenerated on save.
  const [saveCount, setSaveCount] = useState(0);

  const updateEngagement = (newEngagement: Engagement) => {
    setEngagement(newEngagement);
    setSaveCount((c) => c + 1);
  };

  useEngagementBreadcrumb(engagement);

  return (
    <LoadedContent
      isLoading={isLoading || isUserPrivilegesLoading}
      error={error}
      retryFunction={fetchDraft}
    >
      {engagement && (
        <Switch>
          <Route path="/:engagementId/scope/edit">
            <ScopeEdit engagement={engagement} onSave={updateEngagement} key={saveCount} />
          </Route>
          <Route path="/:engagementId/scope/view">
            { engagement.approvedVersions.length < 1 && <Redirect to="edit" /> }
            <ScopeReadonly engagement={engagement} />
          </Route>
        </Switch>
      )}
    </LoadedContent>
  );
};
