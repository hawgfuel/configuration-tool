import React, {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import {
  useField, useForm, InputField, RadioField, Button, Alert,
} from '@partnercenter-react/ui-webcore';
import CsvDownload from 'react-csv-downloader';
import CSVReader from 'react-csv-reader';
import {
  isBeforeDate,
} from '@partnerincentives/configset-base-classes';
import {
  addDays,
  addMonths, parse, startOfMonth,
} from 'date-fns';
import { CountryMetadataClient } from '../../clients/country-metadata-client';
import { ConfigurationSet } from '../../classes/configuration-set-class';
import { CustomerAssociation } from '../../classes/customer-association-class';
import {
  convertToMonthYearFormat,
  mapSurveyTypes, reverseSurveyTypes,
} from '../../utilities/converter-utils';
import { Constants } from '../../constants/constants';
import { validateAssociationForm } from './validate-association-form';
import { CountryMetadata, IMaxCustomer } from '../../models/country-metadata';
import { TConfigurationSet } from '../../types/customer-association-types';
import { importCompleteLabel } from '../../constants/alert-messages';

export type CustomerAssociationProps = {
  configSet: ConfigurationSet;
  customerAssociation: CustomerAssociation;
  configSetError: string;
  engagementId: string;
  setFormIsValid: Dispatch<SetStateAction<boolean>>;
  updateActiveConfigSet: (configSet: ConfigurationSet, startDate: Date) => void;
};

// constant value for storing countries in session storage
const CountriesMetadataStorage = 'countriesMetadata';

// parser options for country template
const parseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};
// country template mapping
const maxCustomerMapTemplate = (
  countries: CountryMetadata[], customerLimits: any,
) => countries.filter((country) => country.isocode !== 'Default').map(
  (country) => ({
    countryCode: country.isocode,
    maxCustomers: customerLimits[country.isocode],
  }),
);
export const AssociationFormComponent:
React.FC<CustomerAssociationProps> = (props: CustomerAssociationProps) => {
  const {
    configSet,
    customerAssociation,
    engagementId,
    configSetError,
    updateActiveConfigSet,
  } = props;
  const countryMetadataClient = new CountryMetadataClient(engagementId);
  const [startDate, setConfigStartDate] = useState(configSet.startDate);
  const [configError, setConfigSetError] = useState(configSetError);
  const [startDateString, setStartDateString] = useState(configSet.startDate.toString());
  const [customerLimitsValue, setCustomerLimitsValue] = useState([{}]);
  const [showImportComplete, setShowImportComplete] = useState<Boolean>(false);
  let getFormData = {};
  // obtain all country metadata
  const [countryMetadata, setCountryMetadata] = useState<CountryMetadata[]>([]);
  useEffect(() => {
    // check session storage if country metadata is cached
    const countriesMetadata = sessionStorage.getItem(CountriesMetadataStorage);
    if (countriesMetadata) {
      const parsedCountryMetadata = JSON.parse(countriesMetadata) as CountryMetadata[];
      setCountryMetadata(parsedCountryMetadata);
    } else {
      // api call to retrieve country metadata
      countryMetadataClient.getCountryMetadata()
        .then((countries: CountryMetadata[]) => {
          setCountryMetadata(countries);
          const countryMetadataValue = JSON.stringify(countries);
          sessionStorage.setItem(CountriesMetadataStorage, countryMetadataValue);
        });
    }
  }, []);

  useEffect(() => {
    setConfigSetError(configSetError);
  }, [configSetError]);

  useEffect(() => {
    setConfigStartDate(configSet.startDate);
    setStartDateString(configSet.startDate.toString());
  }, [configSet.startDate]);

  const surveyOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const form = useForm({
    name: 'associationSetupForm',
    handleSubmit: () => { },
    validate: (formData: TConfigurationSet) => validateAssociationForm(
      formData, customerAssociation.getEngagementStartDate(),
      customerAssociation.getEngagementEndDate(),
    ),
  });
  // Set default form values for existing config with initial value on page load.
  const daysFromClaimCustomerToCustomerConsent = useField(
    'daysFromClaimCustomerToCustomerConsent',
    form, {
      initial: configSet.daysFromClaimCustomerToCustomerConsent,
      onChange: (daysFromClaimCustomerToCustomerConsentValue: string) => {
        if (daysFromClaimCustomerToCustomerConsentValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            daysFromClaimCustomerToCustomerConsent:
            Number(daysFromClaimCustomerToCustomerConsentValue),
          }), startDate);
        }
      },
    },
  );
  const daysFromCustomerConsentToSubmitClaim = useField(
    'daysFromCustomerConsentToSubmitClaim',
    form, {
      initial: configSet.daysFromCustomerConsentToSubmitClaim,
      onChange: (daysFromCustomerConsentToSubmitClaimValue: string) => {
        if (daysFromCustomerConsentToSubmitClaimValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            daysFromCustomerConsentToSubmitClaim:
            Number(daysFromCustomerConsentToSubmitClaimValue),
          }), startDate);
        }
      },
    },
  );
  const daysFromClaimRejectionToPartnerDispute = useField(
    'daysFromClaimRejectionToPartnerDispute',
    form, {
      initial: configSet.daysFromClaimRejectionToPartnerDispute,
      onChange: (daysFromClaimRejectionToPartnerDisputeValue: string) => {
        if (daysFromClaimRejectionToPartnerDisputeValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            daysFromClaimRejectionToPartnerDispute:
            Number(daysFromClaimRejectionToPartnerDisputeValue),
          }), startDate);
        }
      },
    },
  );
  const daysFromCustomerConsentToFinalReview = useField(
    'daysFromCustomerConsentToFinalReview',
    form, {
      initial: configSet.daysFromCustomerConsentToFinalReview,
      onChange: (daysFromCustomerConsentToFinalReviewValue: string) => {
        if (daysFromCustomerConsentToFinalReviewValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            daysFromCustomerConsentToFinalReview:
            Number(daysFromCustomerConsentToFinalReviewValue),
          }), startDate);
        }
      },
    },
  );
  const partnerSurveyRequired = useField(
    'partnerSurveyRequired',
    form, {
      initial: mapSurveyTypes(configSet.partnerSurveyRequired),
      onChange: (partnerSurveyRequiredValue: string) => {
        if (partnerSurveyRequiredValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            partnerSurveyRequired: reverseSurveyTypes(partnerSurveyRequiredValue),
          }), startDate);
        }
      },
    },
  );
  const customerSurveyRequired = useField(
    'customerSurveyRequired',
    form, {
      initial: mapSurveyTypes(configSet.customerSurveyRequired),
      onChange: (customerSurveyRequiredValue: string) => {
        if (customerSurveyRequiredValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            customerSurveyRequired: reverseSurveyTypes(customerSurveyRequiredValue),
          }), startDate);
        }
      },
    },
  );
  const surveyUrlName = useField(
    'surveyUrlName',
    form, {
      initial: configSet.surveyUrlName,
      onChange: (surveyUrlNameValue: string) => {
        if (surveyUrlNameValue) {
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            surveyUrlName: surveyUrlNameValue,
          }), startDate);
        }
      },
    },
  );
  // NOTE: should new config set be created here?
  const startDateField = useField(
    'startDate', form, {
      value: convertToMonthYearFormat(startDate),
      onChange: (newStartDate: string) => {
        if (newStartDate) {
          // convert date string to obj for new ConfigurationSet
          setStartDateString(newStartDate);
          let date = parse(newStartDate, 'yyyy-MM', new Date());
          if (Number.isNaN(date.getTime())) {
            date = new Date(newStartDate);
          }
          // new start date clears remaining form values
          updateActiveConfigSet(new ConfigurationSet({
            ...configSet.toConfigSetType(customerAssociation),
            ...getFormData,
            startDate: date,
          }), startDate);
        }
      },
    },
  );
  // imports country max customers from excel template
  const importFile = (data:IMaxCustomer[]) => {
    const val: IMaxCustomer[] = data.filter((x) => x.maxCustomers !== null);
    // customerLimits: [ {countryCode: "AF", maxCustomers: 222}, {countryCode: "AX", maxCustomers: 333} ]
    setCustomerLimitsValue(val);
    setShowImportComplete(true);
    updateActiveConfigSet(new ConfigurationSet({
      ...configSet.toConfigSetType(customerAssociation),
      ...getFormData,
      customerLimits: val,
    }), startDate);
  };
  // When false disable save button
  useEffect(() => {
    if (Number(daysFromClaimCustomerToCustomerConsent.value) > 0
      && Number(daysFromCustomerConsentToSubmitClaim.value) > 0
      && Number(daysFromCustomerConsentToFinalReview.value) > 0
      && Number(daysFromClaimRejectionToPartnerDispute.value) > 0
    ) {
      props.setFormIsValid(true);
    } else {
      props.setFormIsValid(false);
    }
  }, [form.isValid]);
  // Update form fields with activeConfigSet data
  useEffect(() => {
    daysFromClaimCustomerToCustomerConsent.setValue(
      configSet.daysFromClaimCustomerToCustomerConsent,
    );
    daysFromCustomerConsentToSubmitClaim.setValue(
      configSet.daysFromCustomerConsentToSubmitClaim,
    );
    daysFromCustomerConsentToFinalReview.setValue(
      configSet.daysFromCustomerConsentToFinalReview,
    );
    daysFromClaimRejectionToPartnerDispute.setValue(
      configSet.daysFromClaimRejectionToPartnerDispute,
    );
    partnerSurveyRequired.setValue(
      mapSurveyTypes(configSet.partnerSurveyRequired),
    );
    customerSurveyRequired.setValue(
      mapSurveyTypes(configSet.customerSurveyRequired),
    );
    surveyUrlName.setValue(
      configSet.surveyUrlName,
    );
    setShowImportComplete(false);
  }, [startDateString]);

  getFormData = {
    id: configSet.id,
    startDate: startDateString,
    endDate: configSet.endDate,
    daysFromClaimCustomerToCustomerConsent: Number(daysFromClaimCustomerToCustomerConsent.value),
    daysFromCustomerConsentToSubmitClaim: Number(daysFromCustomerConsentToSubmitClaim.value),
    daysFromCustomerConsentToFinalReview: Number(daysFromCustomerConsentToFinalReview.value),
    daysFromClaimRejectionToPartnerDispute: Number(daysFromClaimRejectionToPartnerDispute.value),
    partnerSurveyRequired: reverseSurveyTypes(partnerSurveyRequired.value),
    customerSurveyRequired: reverseSurveyTypes(customerSurveyRequired.value),
    surveyUrlName: surveyUrlName.value,
    customerLimits: customerLimitsValue,
  };
  return (
    <div className="association-setup col-sm-12">
      {configError && (
        <Alert
          alertType="danger"
          message={configError}
          dismissible
          onDismiss={() => setConfigSetError('')}
          withIcon
        />
      )}
      {customerAssociation.canDeleteConfigSet(configSet) && (// copy to class
      <>
        <InputField
          type="month"
          field={startDateField}
          className="spacer-sm-top"
          label="Configuration Set Start Date"
          aria-label="Configuration Set Start Date"
          min={
                convertToMonthYearFormat(
                  isBeforeDate(addDays(customerAssociation.getEngagementStartDate(), 1), new Date())
                    // Next month since this month has already started - engagement has already started
                    ? addMonths(startOfMonth(new Date()), 1)
                    // On the engagement start date - engagement starts in the future
                    : customerAssociation.getEngagementStartDate(),
                )
              }
          max={convertToMonthYearFormat(customerAssociation.getEngagementEndDate())}
        />
      </>
      )}
      <p className="spacer-md-top">
        Max quantity of customers that can be added/
        claimed for the engagement for each partner.
      </p>
      <div id="hint">
        <Button
          icon="Download"
          className="inline-block"
          renderAsLink
          useDefaultStyles={false}
          disabled={false}
          onClick={() => document.getElementById('maxCustomer-download')?.click()}
        >
          Template
        </Button>
        <CsvDownload
          id="maxCustomer-download"
          filename="template"
          extension=".csv"
          style={{ display: 'none' }}
          datas={maxCustomerMapTemplate(countryMetadata, configSet.customerLimits)}
        />
        <Button
          icon="Upload"
          className="inline-block"
          renderAsLink
          useDefaultStyles={false}
          disabled={false}
          onClick={() => document.getElementById('maxCustomer-import')?.click()}
        >
          Import
        </Button>
        <CSVReader
          inputId="maxCustomer-import"
          onFileLoaded={importFile}
          parserOptions={parseOptions}
          inputStyle={{ display: 'none' }}
        />
        {showImportComplete && <span>{importCompleteLabel}</span>}
      </div>
      <div className="spacer-md-top">
        <InputField
          field={daysFromClaimCustomerToCustomerConsent}
          label="Timeline for sending and getting customer consent
          (post adding/claiming customer) (in days)"
          type="number"
          min={0}
          required
        />
      </div>
      <div className="spacer-md-top">
        <InputField
          field={daysFromCustomerConsentToSubmitClaim}
          label="Timeline for submitting workshop claims (post getting customer consent) (in days)"
          type="number"
          min={0}
          required
        />
      </div>
      <div className="spacer-md-top">
        <InputField
          field={daysFromClaimRejectionToPartnerDispute}
          label="Timeline for reviewing claims post customer consent (in days)"
          type="number"
          min={0}
          required
        />
      </div>
      <div className="spacer-md-top">
        <InputField
          field={daysFromCustomerConsentToFinalReview}
          label="Timeline in which partner can dispute and resubmit claims after rejection
          (in days)"
          type="number"
          min={0}
          required
        />
      </div>
      <div className="spacer-md-top">
        <fieldset>
          <RadioField
            field={partnerSurveyRequired}
            options={surveyOptions}
            label="Partner survey required (Yes/No)"
            required
          />
        </fieldset>
      </div>
      <div className="spacer-md-top">
        <fieldset>
          <RadioField
            field={customerSurveyRequired}
            options={surveyOptions}
            label="Customer survey required (Yes/No)"
            required
          />
        </fieldset>
      </div>
      <div>
        {(customerSurveyRequired.value === 'yes' || partnerSurveyRequired.value === 'yes') && (
        <>
          <InputField
            field={surveyUrlName}
            label="Enter survey name
                (survey name is applied to either or both surveys when required)"
            type="text"
          />
        </>
        )}
        {customerSurveyRequired.value === 'yes' && (
          <div className="text-caption">
            {Constants.customerSurveyBaseUrl + surveyUrlName.value}
          </div>
        )}
        {partnerSurveyRequired.value === 'yes' && (
          <div className="text-caption">
            {Constants.partnerSurveyBaseUrl + surveyUrlName.value}
          </div>
        )}
      </div>
    </div>
  );
};
