import { Alert, Button, Modal } from '@partnercenter-react/ui-webcore';
import { Engagement, EngagementConfigClient } from '@partnerincentives/engagements-client';
import { FetchError } from 'emt-http-base-client';
import React, { useEffect, useState } from 'react';
import { LoadedContent } from '../../components/loaded-content/loaded-content';
import { Selectable } from '../../components/styled-checkbox/styled-checkbox';

export type DeleteEngagementsModalProps = {
  selectedEngagements: Selectable<Engagement>[];
  onDelete: (successMessage: string) => void;
};

export const DeleteEngagementsModal: React.FC<DeleteEngagementsModalProps> = (
  {
    selectedEngagements,
    onDelete,
  },
) => {
  const EngagementsClient = new EngagementConfigClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<FetchError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Whenever the selected engagements changes, reset the state
    setError(undefined);
  }, [isModalOpen]);

  // We cannot delete engagements that are approved, create a list of deleteable engagements
  const engagementsToDelete = selectedEngagements.filter((e) => e.approvedVersions.length === 0);
  const nonDeletableCount = selectedEngagements.length - engagementsToDelete.length;

  // TODO make this a batch operation on the API
  const deleteEngagements = () => {
    setIsLoading(true);
    const deletePromises = engagementsToDelete.map(
      (e) => EngagementsClient.deleteEngagementById(e.id),
    );
    Promise.all(deletePromises)
      .then(() => {
        onDelete(`${engagementsToDelete.length} engagement(s) successfully deleted.`);
        setIsModalOpen(false);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Button
        icon="Delete"
        disabled={selectedEngagements.length === 0}
        onClick={() => setIsModalOpen(true)}
      >
        Delete
      </Button>
      <Modal.Dialog
        isVisible={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title
            headerText="Delete engagements"
            closeButtonLabel="Close"
            onCloseButtonClick={() => setIsModalOpen(false)}
            closeButtonVisible
          />
        </Modal.Header>
        <Modal.Body>
          { selectedEngagements.length !== engagementsToDelete.length
            && (
            <Alert
              content={`You have selected ${nonDeletableCount} engagement(s) which have
                already been approved. These engagements cannot be deleted.`}
              alertType="info"
              dismissible={false}
            />
            )}
          <p>
            {`You are about to delete ${engagementsToDelete.length} engagement(s),
               are you sure you want to proceed?`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <LoadedContent
            isLoading={isLoading}
            error={error}
          />
          <div className="btn-group">
            <Button
              onClick={deleteEngagements}
              primary
              text={isLoading
                ? 'Deleting...' : `Delete ${engagementsToDelete.length} engagement(s)`}
              disabled={isLoading}
            />
            <Button
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              text="Cancel"
            />
          </div>
        </Modal.Footer>
      </Modal.Dialog>
    </>
  );
};
