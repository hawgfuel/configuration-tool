/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react';
import {
  Engagement,
  EngagementUserPrivileges,
  EngagementUserRight,
  EngagementConfigClient,
} from '@partnerincentives/engagements-client';
import { useParams } from 'react-router-dom';

import {
  PageTitle,
  Alert,
  AlertType,
  AlertStack,
  IndeterminateProgressRing,
  Button,
  AlertProps,
} from '@partnercenter-react/ui-webcore';

import { isEqualDate, isBeforeDate } from '@partnerincentives/configset-base-classes';
import { FetchError } from 'emt-http-base-client';
import { ConfigSetCommandBar } from '@partnerincentives/configset-commandbar';
import { AssociationFormComponent } from './customer-association-form-component';
import { CustomerAssociationClient } from '../../clients/customer-association-client';
import { CustomerAssociationClient as TestCAClient }
  from '../../clients/customer-association-client-mock';
import { ConfigurationSet } from '../../classes/configuration-set-class';
import { CustomerAssociation } from '../../classes/customer-association-class';
import { TCustomerAssociationResponse } from '../../types/customer-association-types';
import { detectEngagementDurationChange } from '../../utilities/validation-utils';
import { useApi } from '../../hooks/use-api';
import {
  accessViewError,
  ceScopeUndefinedError,
  configSetUpdateError,
  accessManageError,
} from '../../constants/alert-messages';
import './customer-association.css';

let initialAssociation: CustomerAssociation;
type AssociationPageParams = {
  engagementId: string;
};
interface CustomerAssociationPageProps {
  caClient: TestCAClient | CustomerAssociationClient;
}

export const AssociationPage:
React.FC<CustomerAssociationPageProps> = (props: CustomerAssociationPageProps) => {
  const { caClient } = props;
  const EngagementsClient = new EngagementConfigClient();
  const submitted = false;
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const { engagementId } = useParams<AssociationPageParams>();
  const [userPrivileges, setUserPrivileges] = useState<EngagementUserPrivileges>();
  const [customerAssociation, setCustomerAssociation] = useState<CustomerAssociation>();
  const [generalMessage, setGeneralMessage] = useState<AlertProps[]>([]);
  const [activeConfigSet, setActiveConfigSet] = useState<ConfigurationSet>();
  const [activeConfigSetError, setActiveConfigSetError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [engagementInPast, setEngagementInPast] = useState<boolean>(false);
  const [canManage, setCanManage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [draftEngagement] = useApi(
    () => EngagementsClient.getEngagementById(engagementId), true,
  );
  // Maintain separate state in this case so that we can immediately update engagement on save
  const [engagement, setEngagement] = useState<Engagement>();

  useEffect(() => {
    setEngagement(draftEngagement);
  }, [draftEngagement]);
  const dismissAlertWrapper = (message: string) => {
    setGeneralMessage((prevValue) => {
      const copyVal = prevValue.concat();
      const index = prevValue.findIndex((a) => a.message === message);
      if (index > -1) {
        copyVal.splice(index, 1);
        return copyVal;
      }
      return copyVal;
    });
  };
  const buildAlert = (message: string, alertType: AlertType): AlertProps => ({
    message,
    alertType,
    onDismiss: () => dismissAlertWrapper(message),
  });
  // Gets user privileges to later determine whether to get customerAssociation and configSets
  useEffect(() => {
    caClient.fetchPrivileges()
      .then((privileges: EngagementUserPrivileges) => {
        setUserPrivileges(privileges);
      }).catch(({ message }: FetchError) => {
        setLoading(false);
        setGeneralMessage([{ message, alertType: 'danger' }]);
      });
  }, []);
  // Used in ConfigSetCommandBar
  const cloneConfigSet = (configSet: ConfigurationSet) => {
    const bestDate = customerAssociation?.getNewConfigSetStartDate();
    if (bestDate) {
      const configSets = customerAssociation?.cloneConfigSet(bestDate, configSet);
      const clonedConfigSet = configSets?.find((config) => isEqualDate(config.startDate, bestDate));
      if (clonedConfigSet) {
        setCustomerAssociation(customerAssociation);
        setActiveConfigSet(new ConfigurationSet(clonedConfigSet));
      }
    }
  };
  // Used in ConfigSetCommandBar
  const deleteConfigSet = (configSet: ConfigurationSet) => {
    if (customerAssociation?.deleteConfigSet(configSet)) {
      const configSets = customerAssociation.getConfigSets();
      setCustomerAssociation(customerAssociation);
      setActiveConfigSet(new ConfigurationSet(configSets[0]));
    }
  };
  // Used in ConfigSetCommandBar
  const addNewConfigSet = (startDate: Date) => {
    const updatedConfigSets = customerAssociation?.addConfigSet(startDate);
    if (updatedConfigSets) {
      const latestConfigSet = updatedConfigSets[updatedConfigSets?.length - 1];
      setCustomerAssociation(customerAssociation);
      setActiveConfigSet(new ConfigurationSet(latestConfigSet));
    }
  };
  // Page level button
  const discardChanges = () => {
    const eligibilityClone = initialAssociation.deepCopy();
    setCustomerAssociation(eligibilityClone);
    setActiveConfigSet(new ConfigurationSet(eligibilityClone.getConfigSets()[0]));
  };
  // Used in saveChanges when adding a new configSet
  const doPostCall = () => {
    if (customerAssociation && canManage) {
      caClient.postCustomerAssociation(
        engagementId, customerAssociation.toCustomerAssociationType(),
      )
        .then((customerAssociationResponse: TCustomerAssociationResponse) => {
          setSaving(false);
          setCustomerAssociation(new CustomerAssociation(customerAssociationResponse, canManage));
          initialAssociation = new CustomerAssociation(
            customerAssociationResponse, canManage,
          );
        }).catch((errorMessage: FetchError) => {
          errorMessage.response.json()
            .then(({ Message }: any) => {
              setSaving(false);
              if (Message) {
                setGeneralMessage([buildAlert(Message, 'danger')]);
              } else {
                setGeneralMessage(
                  [buildAlert("Couldn't save configuration. Try again later", 'danger')],
                );
              }
            });
        });
    }
  };
  // Saving a new configSet
  const saveChanges = () => {
    setSaving(true);
    // get activeConfigSet via updateActiveConfigSet function? Get form values from form component
    if (customerAssociation && canManage) {
      const hasOldConfigSets = customerAssociation.getHasSavedConfigSets();
      if (hasOldConfigSets) {
        caClient.putCustomerAssociation(
          engagementId, customerAssociation.toCustomerAssociationType(),
        )
          .then((customerAssociationResponse: TCustomerAssociationResponse) => {
            setSaving(false);
            setGeneralMessage([buildAlert('Successfully saved configuration', 'success')]);
            setCustomerAssociation(new CustomerAssociation(customerAssociationResponse, canManage));
            initialAssociation = new CustomerAssociation(
              customerAssociationResponse, canManage,
            );
          }).catch((errorMessage: FetchError) => {
            if (errorMessage.status !== 404) {
              errorMessage.response.json()
                .then(({ Message }: any) => {
                  setSaving(false);
                  if (Message) {
                    setGeneralMessage([buildAlert(Message, 'danger')]);
                  } else {
                    setGeneralMessage(
                      [buildAlert("Couldn't save configuration. Try again later", 'danger')],
                    );
                  }
                });
            } else {
              doPostCall();
            }
          });
      } else {
        doPostCall();
      }
    } else if (!canManage) {
      setGeneralMessage([{ message: accessManageError, alertType: 'danger' }]);
      setSaving(false);
    }
  };
  // Used in AssociationFormComponent. Not used in ConfigSetCommandBar
  const updateActiveConfigSet = (configSet: ConfigurationSet, startDate: Date) => {
    const updated = customerAssociation?.updateConfigSet(configSet, startDate);
    if (updated) {
      setCustomerAssociation(customerAssociation);
      setActiveConfigSet(new ConfigurationSet(configSet));
      setActiveConfigSetError('');
    } else {
      setActiveConfigSetError(configSetUpdateError);
    }
  };
  // Sets eligibility and active confgSet on page load
  useEffect(() => {
    if (userPrivileges) {
      setLoading(true);
      const canEdit = userPrivileges.rights.includes(EngagementUserRight.CanManage);
      setCanManage(canEdit);
      if (userPrivileges.rights.includes(EngagementUserRight.CanView)) {
        caClient.fetchCustomerAssociation(engagementId)
          .then((customerAssociationResponse: TCustomerAssociationResponse) => {
            setLoading(false);
            setCustomerAssociation(new CustomerAssociation(customerAssociationResponse, canEdit));
            initialAssociation = new CustomerAssociation(
              customerAssociationResponse, canEdit,
            );
            const messages = [];
            if (!canEdit) {
              messages.push(buildAlert(
                'You only have read permissions and cannot edit the configuration', 'warning',
              ));
            }
            const durationChange = detectEngagementDurationChange(
              customerAssociationResponse, initialAssociation,
            );
            if (durationChange.value) {
              messages.push(buildAlert(
                durationChange.message,
                'warning',
              ));
            }
            setGeneralMessage(messages);
            setActiveConfigSet(initialAssociation.getConfigSets()[0]);
          }).catch((errorMessage: FetchError) => {
            setLoading(false);
            if (errorMessage.status === 400) {
              setGeneralMessage([{
                message: ceScopeUndefinedError,
                alertType: 'danger',
              }]);
            } else {
              setGeneralMessage([{
                message: 'Could not load configuration. Please try again later',
                alertType: 'danger',
              }]);
            }
          });
      } else {
        setLoading(false);
        setGeneralMessage([{ message: accessViewError, alertType: 'danger' }]);
      }
    }
  }, [userPrivileges]);
  // Cannot edit configSets ending in the past
  useEffect(() => {
    if (customerAssociation && isBeforeDate(
      customerAssociation.getEngagementEndDate(), new Date(),
    )) {
      setEngagementInPast(true);
    } else {
      setEngagementInPast(false);
    }
  }, [customerAssociation]);
  return (
    <>
      <PageTitle
        title={engagement?.name}
        subTitle="Association & setup"
        inline
      />
      {engagement !== undefined && engagement?.partnerRole !== 'BuildIntent' && (
        <Alert
          className="spacer-md-top"
          message="Page not applicable to this type of engagement."
          alertType="warning"
          dismissible
        />
      )}
      {loading && (
        <div className="page-loader">
          <IndeterminateProgressRing size="small" />
        </div>
      )}
      {generalMessage && (
        <AlertStack
          className="spacer-md-top"
          alerts={generalMessage}
          dismissible
        />
      )}
      {customerAssociation && engagement?.partnerRole === 'BuildIntent' && (
        <>
          <div className="text-align-right">
            {
            saving
              ? (
                <IndeterminateProgressRing
                  className="
                  display-inlineflex spacer-sm-top spacer-sm-bottom spacer-sm-left spacer-sm-right"
                  aria-label="Saving..."
                />
              )
              : (
                <Button
                  renderAsLink
                  icon="Save"
                  text="Save Changes"
                  useDefaultStyles
                  disabled={
                    !customerAssociation.isEligiblityEditable() || engagementInPast
                    || submitted || !formIsValid || activeConfigSetError !== ''
}
                  onClick={saveChanges}
                />
              )
          }
            <Button
              renderAsLink
              icon="Delete"
              text="Discard Changes"
              disabled={!customerAssociation.isEligiblityEditable() || engagementInPast}
              useDefaultStyles
              onClick={discardChanges}
            />
          </div>
          { activeConfigSet
        && (
          <>
            <ConfigSetCommandBar
              eligibility={customerAssociation}
              activeConfigStartDate={activeConfigSet?.startDate}
              cloneConfigSet={cloneConfigSet}
              setConfigSetAsActive={setActiveConfigSet}
              deleteConfigSet={deleteConfigSet}
              addNewConfigSet={addNewConfigSet}
              isEditable={customerAssociation.isEligiblityEditable()}
            />
            <AssociationFormComponent
              customerAssociation={customerAssociation}
              configSet={activeConfigSet}
              engagementId={engagementId}
              updateActiveConfigSet={updateActiveConfigSet}
              configSetError={activeConfigSetError}
              setFormIsValid={setFormIsValid}
            />
            <div className="spacer-lg-top btn-group col-xs-24">
              <Button
                text="Save changes"
                className="btn-primary win-color-border-color-accent win-color-bg-blue"
                disabled={
                  !customerAssociation.isEligiblityEditable() || engagementInPast
                  || submitted || !formIsValid || activeConfigSetError !== ''
}
                onClick={saveChanges}
              />
              <Button
                text="Delete changes"
                onClick={discardChanges}
                disabled={!customerAssociation.isEligiblityEditable() || engagementInPast}
              />
            </div>
          </>
        )}
        </>
      )}
    </>
  );
};
