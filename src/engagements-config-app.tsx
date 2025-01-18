import React from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useUserPrivilegesContext, NoAccessAlert } from '@partnerincentives/engagements-common';
import { Alert, IndeterminateProgressRing } from '@partnercenter-react/ui-webcore';
import { CustomerAssociationClient as TestCAClient }
  from './clients/customer-association-client-mock';
import { CustomerAssociationClient } from './clients/customer-association-client';
import { getConfiguration } from './config/global-config';
import { ScopePage } from './pages/scope-page/scope-page';
import { OverviewPage } from './pages/overview-page/overview-page';
import { ReviewPage } from './pages/review-page/review-page';
import { AssociationPage } from './pages/association-page/customer-association-page';

export type EngagementsConfigAppProps = {
  history: any;
  useMockClient?: boolean;
};

export const EngagementsConfigApp: React.FC<EngagementsConfigAppProps> = (props) => {
  const [userPrivileges, isUserPrivilegesLoading] = useUserPrivilegesContext();
  // Check to see if user has any privileges on this application.
  // If no privileges are present, this will be set to false.
  const { apiVersion } = getConfiguration();
  const isUserAllowed = !isUserPrivilegesLoading && Object.values(userPrivileges).some((p) => p);
  const customerAssociationClient = props.useMockClient
    ? new TestCAClient(apiVersion)
    : new CustomerAssociationClient(apiVersion);

  if (isUserPrivilegesLoading) {
    return <IndeterminateProgressRing className="center-block" />;
  }

  if (!isUserAllowed) {
    return <NoAccessAlert />;
  }

  return (
    <>
      {!isUserPrivilegesLoading && !userPrivileges.canManage
      && (
        <Alert
          alertType="info"
          dismissible={false}
          content="You don't have editing permissions for Engagements, some actions may be limited."
        />
      )}
      <Router history={props.history}>
        <Switch>
          <Route exact path="/:engagementId/scope/(edit|view)">
            <ScopePage />
          </Route>
          <Redirect exact from="/:engagementId/scope" to="/:engagementId/scope/edit" />
          <Route exact path="/:engagementId/review">
            <ReviewPage />
          </Route>
          <Route exact path="/">
            <OverviewPage />
          </Route>
          <Route exact path="/:engagementId/associationSetup">
            <AssociationPage caClient={customerAssociationClient} />
          </Route>
        </Switch>
      </Router>
    </>
  );
};
