import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  useField,
  useForm,
  InputField,
  IndeterminateProgressBar,
  Alert,
} from '@partnercenter-react/ui-webcore';
import {
  Engagement, EngagementConfigClient, NewEngagementRequest,
} from '@partnerincentives/engagements-client';
import { useApi } from '../../hooks/use-api';
import { useErrorString } from '../../hooks';

export type AddEngagementModalProps = {
  onAddEngagement: (engagement: Engagement) => void;
};

const EngagementsClient = new EngagementConfigClient();

export const AddEngagementModal: React.FC<AddEngagementModalProps> = (props) => {
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [engagementResponse, isLoading, error, create] = useApi(EngagementsClient.postEngagements);

  useEffect(() => {
    if (engagementResponse) {
      setIsModalOpen(false);
      props.onAddEngagement(engagementResponse);
    }
  }, [engagementResponse]);

  const createEngagement = (formData: any, isValid: boolean) => {
    if (isValid) {
      // TODO update this type in the client long-term
      const newEngagement: NewEngagementRequest = {
        name: formData.engagementName,
        id: formData.id,
        offering: {
          offeringId: 'azurePalPoc',
          offeringGuid: 'e32e24c2-d9c5-4ef2-baba-5b622dfca7e0',
        },
      };
      create(newEngagement);
    }
  };

  const form = useForm({
    name: 'newEngagementForm',
    handleSubmit: createEngagement,
    validate: (formData) => {
      const name = formData.engagementName;
      const errors: any = {};
      if (!name || name.length === 0 || name.replace(/\s+/g, '').length === 0) {
        errors.engagementName = 'Name must not be empty';
      }
      if (name && name.length > 50) {
        errors.engagementName = 'Name must be less than 50 characters long';
      }
      return errors;
    },
  });

  const nameField = useField('engagementName', form);

  const guidField = useField('id', form);

  return (
    <>
      <Button
        text="Add engagement"
        icon="Add"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal.Dialog
        isVisible={IsModalOpen}
        onDismiss={() => setIsModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title
            headerText="Add engagement"
            closeButtonLabel="Close"
            onCloseButtonClick={() => setIsModalOpen(false)}
            closeButtonVisible
          />
        </Modal.Header>
        <form onSubmit={form.onSubmit}>
          <Modal.Body>
            Engagement names should be short and descriptive,
            this will be visible to the partner.
            <InputField
              field={nameField}
              label="Engagement name"
              hintText="Names are limited to 50 characters"
              required
            />
            <InputField
              field={guidField}
              label="Engagement GUID"
              hintText="Only use this field if you know the GUID of the Opportunity this
                Engagement is replacing, otherwise, leave this field blank"
            />

            {isLoading && <IndeterminateProgressBar />}

            {error && (
              <Alert
                title="Something went wrong"
                alertType="danger"
                role="alert"
                dismissible={false}
                content={useErrorString(error)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="btn-group">
              <Button
                type="submit"
                primary
                text="Create engagement"
                disabled={!!nameField.meta.error || !nameField.meta.touched || isLoading}
              />
              <Button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                text="Cancel"
              />
            </div>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </>
  );
};
