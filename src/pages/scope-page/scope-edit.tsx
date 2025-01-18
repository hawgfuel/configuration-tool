import React, { useEffect } from 'react';
import './scope-page.css';
import {
  AssociationType, BuildIntentType, Engagement, EngagementConfigClient, EngagementStatus,
  PartnerRole, ScopeRequest, SolutionArea,
} from '@partnerincentives/engagements-client';
import {
  useField, useForm, InputField, RadioField, PageTitle, Grid,
  TextAreaField, Button, Alert, SelectField,
} from '@partnercenter-react/ui-webcore';
import { Link, Prompt } from 'react-router-dom';
import { add } from 'date-fns';
import { useUserPrivilegesContext } from '@partnerincentives/engagements-common';
import {
  mapEnumToOptions, convertToFieldDate, convertToMonthFieldDate,
  endOfMonthDateString, startOfMonthDateString,
} from '../../utilities';
import { engagementPrograms } from '../../constants/engagement-programs';
import { validateScopeForm } from './validate-scope-form';
import { StyledMarkdown } from '../../components/styled-markdown/styled-markdown';
import { useApi } from '../../hooks';
import { LoadedContent } from '../../components/loaded-content/loaded-content';

export type ScopeEditProps = {
  engagement: Engagement;
  onSave: (newEngagement: Engagement) => void;
};

export const ScopeEdit: React.FC<ScopeEditProps> = (props) => {
  const EngagementsClient = new EngagementConfigClient();
  const [userPrivileges] = useUserPrivilegesContext();

  const [saveSuccess, isLoading, error, save] = useApi(EngagementsClient.putEngagementScopeById);

  // If there is at least one approved version, then block editing certain fields
  const wasApproved = props.engagement.approvedVersions.length > 0;
  const submitted = props.engagement.status === EngagementStatus.Submitted;

  const form = useForm({
    name: 'scopeAndDescriptionForm',
    validate: (formData) => validateScopeForm(formData, wasApproved),
    handleSubmit: (data: any, isValid: boolean) => {
      if (isValid) {
        // Since API expects a subset of these values we need to
        // deep copy this object to delete the extra values
        const dataCopy = JSON.parse(JSON.stringify(data));

        // Remove temp input values as they are throwaway
        delete dataCopy.endDateInput;
        delete dataCopy.startDateInput;
        dataCopy.offering = {};

        const dataAsScope = dataCopy as ScopeRequest;

        // If role is build intent, force value of intent type
        // as this is not an changeable option at the moment.
        if (data.partnerRole === PartnerRole.BuildIntent) {
          dataAsScope.buildIntentType = BuildIntentType.OneToOne;
        }

        // Set offering data based on user selection
        const offering = engagementPrograms.find((p) => p.offeringGuid === data.offering);
        dataAsScope.offering.offeringGuid = offering?.offeringGuid || '';
        dataAsScope.offering.offeringId = offering?.offeringId || '';

        save(props.engagement.id, dataAsScope as ScopeRequest);
      }
    },
  });

  const currentDate = convertToFieldDate(new Date().toISOString());
  const currentSelectableMonth = convertToMonthFieldDate(
    add(new Date(), { months: 1 }).toISOString(),
  );

  const nameField = useField('name', form, { initial: props.engagement.name });

  // TODO change initial here to be selected on the options
  const programField = useField('offering', form,
    { initial: props.engagement.offering.offeringGuid });
  const programFieldOptions = engagementPrograms.map((p) => (
    <option value={p.offeringGuid}>{p.friendlyName}</option>
  ));

  // Because month-typed fields always return the first of the month
  // use a hidden input to store the actual end date, other is for input only.
  const startDateInputField = useField('startDateInput', form,
    { initial: convertToMonthFieldDate(props.engagement.startDate) });
  const startDateField = useField('startDate', form,
    { initial: convertToMonthFieldDate(props.engagement.startDate) });
  useEffect(() => {
    const dateInputVal = startDateInputField.value;
    if (dateInputVal) {
      startDateField.setValue(startOfMonthDateString(dateInputVal));
    }
  }, [startDateInputField.value]);

  const endDateInputField = useField('endDateInput', form,
    { initial: convertToMonthFieldDate(props.engagement.endDate) });
  const endDateField = useField('endDate', form,
    { initial: convertToFieldDate(props.engagement.endDate) });

  useEffect(() => {
    const dateInputVal = endDateInputField.value;
    if (dateInputVal) {
      endDateField.setValue(endOfMonthDateString(dateInputVal));
    }
  }, [endDateInputField.value]);

  const visibleDateField = useField('visibleDate', form,
    { initial: convertToFieldDate(props.engagement.visibleDate) });

  const solutionAreaField = useField('solutionArea', form,
    { initial: props.engagement.solutionArea });

  const partnerRoleField = useField('partnerRole', form, { initial: props.engagement.partnerRole });
  const initAssocQuant = props.engagement.maximumNumberOfAssociations;
  const maxAssociationField = useField('maximumNumberOfAssociations', form,
    { initial: initAssocQuant === 0 ? '0' : initAssocQuant });

  const associationTypeField = useField('associationType', form,
    { initial: props.engagement.associationType });

  const descriptionField = useField('description', form, { initial: props.engagement.description });

  return (
    <form onSubmit={form.onSubmit}>
      <Prompt
        when={form.meta.touched && !saveSuccess}
        message={'You have unsaved changes. '
        + 'Click OK to continue and discard your changes, or cancel to stay on this page.'}
      />

      <PageTitle
        title={nameField.value}
        subTitle="Scope and description"
        inline
      />

      { wasApproved && !submitted
      && (
        <Alert
          title="Some fields cannot be modified"
          content={(
            <>
              <p>Since this engagement has been approved, certain fields cannot be changed.</p>
              <Link to="view">View the current approved version of this engagement.</Link>
            </>
          )}
          alertType="info"
          dismissible={false}
        />
      )}

      { submitted
      && (
        <Alert
          title="This engagement is pending approval"
          content={(
            <>
              <p>This engagement is pending approval and edits cannot be made.</p>
              {wasApproved
              && (<Link to="view">View the current approved version of this engagement.</Link>)}
            </>
          )}
          alertType="info"
          dismissible={false}
        />
      )}

      <Grid.Row>
        <Grid.Col lg={12} md={24}>
          <InputField
            label="Engagement name"
            field={nameField}
            disabled={submitted}
            hintText="Names are limited to 50 characters and should be capitalized like a sentence"
            required
          />
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col lg={12} md={24}>
          <SelectField
            label="Incentive program"
            field={programField}
            disabled={wasApproved || submitted}
            required
          >
            {programFieldOptions}
          </SelectField>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col md={12}>
          <InputField
            label="Start date (UTC)"
            field={startDateInputField}
            disabled={wasApproved || submitted}
            min={currentSelectableMonth}
            required
            type="month"
            hintText="Engagement begins on the first day of the selected month"
          />
          <InputField
            field={startDateField}
            disabled={submitted}
            type="hidden"
          />
        </Grid.Col>
        <Grid.Col md={12}>
          <InputField
            label="End date (UTC)"
            field={endDateInputField}
            disabled={submitted}
            min={currentSelectableMonth}
            required
            type="month"
            hintText="Engagement expires after the last day of the selected month"
          />
          <InputField
            field={endDateField}
            disabled={submitted}
            type="hidden"
          />
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col md={12}>
          <InputField
            label="Visible Date (UTC)"
            field={visibleDateField}
            disabled={wasApproved || submitted}
            min={currentDate}
            required
            type="date"
            hintText="Partners will be able to see the engagement in Partner Center after this date"
          />
        </Grid.Col>
      </Grid.Row>

      <RadioField
        label="Solution area"
        field={solutionAreaField}
        options={mapEnumToOptions(SolutionArea)}
        disabled={wasApproved || submitted}
        required
      />

      <RadioField
        label="Partner role"
        field={partnerRoleField}
        options={mapEnumToOptions(PartnerRole)}
        disabled={wasApproved || submitted}
        required
      />

      {partnerRoleField.value === PartnerRole.BuildIntent
        && (
          <Grid.Row>
            <Grid.Col md={8}>
              <InputField
                field={maxAssociationField}
                label="Maximum association quantity"
                disabled={submitted}
                type="number"
                hintText="Engagement ends after this number of partner
                  associations has been reached. Leave blank for no limit."
              />
            </Grid.Col>
          </Grid.Row>
        )}

      <RadioField
        label="Association type"
        field={associationTypeField}
        options={[...mapEnumToOptions(AssociationType), { label: 'No association', value: '' }]}
        disabled={wasApproved || submitted}
      />

      <Grid.Row>
        <Grid.Col xs={12}>
          <TextAreaField
            label="Summary"
            field={descriptionField}
            disabled={submitted}
            required
            className="summaryField"
          />
          <span className="spacer-xxs-right">
            Markdown is supported.
          </span>
          <a
            href="https://docs.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>

        </Grid.Col>
        <Grid.Col xs={12} className="form-group">
          <strong className="win-color-fg-secondary">Markdown preview</strong>
          <StyledMarkdown>
            {descriptionField.value}
          </StyledMarkdown>
        </Grid.Col>
      </Grid.Row>
      <br />
      <LoadedContent isLoading={isLoading} error={error}>
        {saveSuccess
          && (
          <Alert
            title="Engagement saved"
            alertType="success"
            role="alert"
            dismissible={false}
            content={`Draft of ${props.engagement.name} saved successfully.`}
          />
          )}
      </LoadedContent>
      <div className="btn-group">
        <Button
          primary
          type="submit"
          disabled={isLoading || submitted || !form.isValid() || !userPrivileges.canManage}
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>

        <Button
          text="Discard changes"
          disabled={submitted}
          onClick={() => { form.reset(); }}
        />
      </div>
    </form>
  );
};
