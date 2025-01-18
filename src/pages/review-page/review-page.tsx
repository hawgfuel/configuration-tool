import React from 'react';
import {
  EngagementConfigClient, EngagementStatus,
} from '@partnerincentives/engagements-client';
import { useParams } from 'react-router-dom';
import { Alert, Button, PageTitle } from '@partnercenter-react/ui-webcore';
import { useUserPrivilegesContext } from '@partnerincentives/engagements-common';
import { useApi } from '../../hooks/use-api';
import { enumKeyToString } from '../../utilities';
import { useEngagementBreadcrumb } from '../../hooks/use-engagement-breadcrumb';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { PartnerEligibilitySection } from './partner-eligibility-section';
import { ScopeSection } from './scope-section';
import { CustomerEligibilitySection } from './customer-eligibility-section';
import { CustomerAssociationSection } from './customer-association-section';

export type ReviewPageParams = {
  engagementId: string;
};

export const ReviewPage: React.FC = () => {
  const EngagementsClient = new EngagementConfigClient();
  const [userPrivileges, isUserPrivilegesLoading] = useUserPrivilegesContext();

  const { engagementId } = useParams<ReviewPageParams>();

  const [draftEngagementScope, isLoading, error, fetchEngagement] = useApi(
    () => EngagementsClient.getEngagementById(engagementId),
    true,
  );

  const [submittedEngagement, isSubmitting, submitError, submitEngagement] = useApi(
    () => EngagementsClient.submitDraftEngagement(engagementId)
      .then(fetchEngagement),
  );

  const [approvedEngagement, isApproving, approveError, approveEngagement] = useApi(
    () => EngagementsClient.approveDraftEngagement(engagementId),
  );

  const [sentBackEngagement, isSendingBack, sendBackError, sendBackEngagement] = useApi(
    () => EngagementsClient.sendBackDraftEngagement(engagementId),
  );

  const updateError = submitError || approveError || sendBackError;
  const updatedEngagement = submittedEngagement || approvedEngagement || sentBackEngagement;

  // Use the updated engagement value if user takes action, otherwise default to the draft.
  const engagement = updatedEngagement || draftEngagementScope;

  useEngagementBreadcrumb(engagement);

  return (
    <>
      <PageTitle
        title={engagement?.name}
        subTitle="Review"
        inline
      />
      <LoadedContent isLoading={isLoading || isUserPrivilegesLoading} error={error}>
        {updatedEngagement && engagement
          && (
          <Alert
            alertType="success"
            role="alert"
            dismissible={false}
            content={`${engagement.name} is now in ${enumKeyToString(engagement.status)} state.`}
          />
          )}
        { engagement && <ScopeSection engagement={engagement} /> }

        <PartnerEligibilitySection engagementId={engagementId} />
        <CustomerEligibilitySection engagementId={engagementId} />
        {engagement?.partnerRole === 'BuildIntent' && (
        <CustomerAssociationSection engagementId={engagementId} />
        )}
      </LoadedContent>
      <div className="spacer-xl-top">
        { engagement && engagement.status === EngagementStatus.Draft
          && (
          <Button
            text={isSubmitting ? 'Submitting...' : 'Submit for review'}
            onClick={submitEngagement}
            disabled={isSubmitting || !userPrivileges.canManage}
            icon="Send"
            primary
          />
          )}
        { engagement && engagement.status === EngagementStatus.Submitted
          && (
          <div className="btn-group">
            <Button
              text={isApproving ? 'Approving...' : 'Approve'}
              disabled={isApproving || !userPrivileges.canApprove}
              onClick={approveEngagement}
              icon="CheckMark"
              primary
            />
            <Button
              text={isSendingBack ? 'Sending back...' : 'Send back'}
              disabled={isSendingBack || !userPrivileges.canApprove}
              onClick={sendBackEngagement}
              icon="SendMirrored"
            />
          </div>
          )}
        <LoadedContent
          isLoading={isSubmitting || isApproving || isSendingBack}
          error={updateError}
        />
      </div>
    </>
  );
};
