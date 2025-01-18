/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/
import {
  EligibilityBase, isEqualDate,
} from '@partnerincentives/configset-base-classes';
import {
  TCustomerAssociationResponse, TCustomerAssociation,
} from '../types/customer-association-types';
import { defaultConfigSet } from '../constants/default-config-set';
import { ConfigurationSet } from './configuration-set-class';

export class CustomerAssociation extends EligibilityBase<TCustomerAssociation> {
  //  Association Data (Customer Association)
  private id?: string;

  private engagementId: string;

  private engagementVersion: number;

  // Store response data for determining modifications
  private initialAssociation: TCustomerAssociationResponse;

  protected configSets: ConfigurationSet[];

  private hasSavedConfigSets: boolean = false;

  /**
  * Constructor To create a CustomerAssociation Object
  *
  * @param data A response object from the API (component + engagement metadata) if no component
  */
  constructor(data: TCustomerAssociationResponse, isEditable: boolean = true) {
    //  Copy Data incoming from proxy into the object
    super(data);
    this.engagementStartDate = new Date(this.engagementStartDate);
    this.engagementEndDate = new Date(this.engagementEndDate);

    //  If component data was provided in the contructor, initialize with that
    if (data.component && data.component.id) {
      this.id = data.component.id;
      this.engagementId = data.component.engagementId;
      this.engagementVersion = data.component.engagementVersion;

      /**
      * Deep copies the configuration set from the input into the instance
      * creating instances of the ConfigurationSet class
      */
      this.configSets = data.component.configSets.map(
        (configSet) => new ConfigurationSet(configSet),
      );
      this.hasSavedConfigSets = this.configSets.find(
        (cSet) => cSet.id,
      ) !== undefined || data.component.id !== null;
    //  If not component data was provided, intialize customer Association empty
    } else {
      this.engagementId = data.metadata.id;
      this.engagementVersion = data.metadata.version;
      this.configSets = [];
    }

    if (this.configSets.length === 0) {
      //  Create a single, empty configset for the whole period
      this.configSets = [new ConfigurationSet({
        id: '',
        startDate: this.engagementStartDate,
        endDate: '',
        daysFromClaimCustomerToCustomerConsent: 0,
        daysFromCustomerConsentToSubmitClaim: 0,
        daysFromClaimRejectionToPartnerDispute: 0,
        daysFromCustomerConsentToFinalReview: 0,
        partnerSurveyRequired: false,
        customerSurveyRequired: false,
        surveyUrlName: '',
        customerLimits: {},
      })];
    }

    this.isEditable = this.isEditable && isEditable;

    this.sortConfigSetsAscending();

    this.initialAssociation = data;
  }

  /**
  * Returns the whether or not there is a saved association configuration
  * @returns true if there is a saved CE config
  */
  getHasSavedConfigSets(): boolean {
    return this.hasSavedConfigSets;
  }

  /**
  * Returns the current array of config sets
  * @returns the current array of config sets
  */
  getConfigSets(): ConfigurationSet[] {
    return this.configSets;
  }

  /**
  * Returns elements of the current array of config sets
  * that can't be edited (are on the past)
  * @returns the current array of non-editable config sets
  */
  getNonEditConfigSets(): ConfigurationSet[] {
    return this.configSets.filter((configSet) => !configSet.isEditable);
  }

  /**
  * Returns the current array of config sets that can be edited
  * (are in the future)
  * @returns the current array of editable config sets
  */
  getEditConfigSets(): ConfigurationSet[] {
    return this.configSets.filter((configSet) => configSet.isEditable);
  }

  /**
  * Adds a new config set to the current array of config sets
  * If its an invalid date (already used, or out of engagement boundaries)
  * then only return configset array without changes
  * @returns the current array of config sets
  */
  addConfigSet(startDate: Date): ConfigurationSet[] {
    if (!this.isDateAvailable(startDate)) {
      return this.configSets as ConfigurationSet[];
    }
    this.configSets.push(new ConfigurationSet({
      ...defaultConfigSet,
      startDate,
    }));
    this.sortConfigSetsAscending();
    return this.configSets as ConfigurationSet[];
  }

  /**
  * Adds a new config set to the current array of config sets
  * based on another configset
  * The startdate of the new config set is calculated the same way than the
  * addNewConfigSet method
  * @param configSet the configset to clone
  * @param startDate the start date to be assigned to the clone
  * @returns the current array of config sets
  */
  cloneConfigSet(startDate: Date, source: ConfigurationSet): ConfigurationSet[] {
    if (!this.isDateAvailable(startDate)) {
      return this.configSets as ConfigurationSet[];
    }

    this.configSets.push(new ConfigurationSet({
      ...source.toConfigSetType(this),
      startDate,
    }));
    this.sortConfigSetsAscending();
    return this.configSets;
  }

  /**
   * Eliminates a configSet form the configset array. Prevents deletion of the first element
   * @param configSet the configset to remove form configset array
   * @returns boolean indicating if delete operation was succesful or not
   */
  deleteConfigSet(configSet: ConfigurationSet): boolean {
    if (!super.canDeleteConfigSet(configSet)) {
      return false;
    }

    //  finde the index of the configSet
    const index = this.configSets.findIndex((item) => item.startDate === configSet.startDate);
    if (index < 0) {
      return false;
    }
    this.configSets.splice(index, 1);
    return true;
  }

  /**
  * Updates the config set with the start date passed if the
  * config set is editable or if the start date is to be updated, it's not the
  * first configuration set
  * @param startDate date to verify
  * @param configSet configSet to be updated
  * @returns the current array of config sets
  */
  updateConfigSet(configSet: ConfigurationSet, startDate: Date): boolean {
    const configSetIndToUpdate = this.configSets.findIndex(
      (config) => isEqualDate(config.startDate, startDate),
    );
    if (configSetIndToUpdate === -1 || !this.configSets[configSetIndToUpdate].isEditable) {
      return false;
    }
    const configSetToUpdate = this.configSets[configSetIndToUpdate];
    if (!isEqualDate(startDate, configSet.startDate) // Trying to update start date
      && !this.isDateAvailable(new Date(configSet.startDate))
      && this.canDeleteConfigSet(configSetToUpdate)) {
      return false;
    }
    this.configSets[configSetIndToUpdate] = new ConfigurationSet(
      configSet,
    );
    this.sortConfigSetsAscending();
    return true;
  }

  /**
  * Returns an object with customer association type
  * @returns the association cast into the TCustomerAssociation format
  */
  toCustomerAssociationType(): TCustomerAssociation {
    return {
      id: this.id,
      engagementId: this.engagementId,
      creationDate: new Date().toJSON(),
      engagementVersion: this.engagementVersion,
      configSets: this.configSets.map((configSet) => configSet.toConfigSetType(this)),
    };
  }

  /**
  * Returns a deep copy of the same object
  * @returns the deep copied association object
  */
  deepCopy(): CustomerAssociation {
    const ceResponseType: TCustomerAssociationResponse = {
      metadata: {
        state: this.engagementState,
        id: this.proxyEngagementId,
        version: this.proxyEngagementVersion,
        approvedVersions: this.approvedVersions,
        startDate: this.engagementStartDate,
        endDate: this.engagementEndDate,
        programGuid: this.engagementProgramGuid,
        partnerRole: this.engagementPartnerRole,
        solutionArea: this.engagementSolutionArea,
        associationType: this.engagementAssociationType,
      },
      component: {
        ...this.toCustomerAssociationType(),
      },
    };
    return new CustomerAssociation(ceResponseType);
  }

  /**
   * Returns a boolean based on whether a config set has been modified by the original
   * @param configSet Config set to look for in the original
   * @returns boolean whether configSet has been modified
   */
  isConfigSetModified(configSet: ConfigurationSet): boolean {
    const originalEligiblity = new CustomerAssociation(this.initialAssociation);
    const originalConfigs = originalEligiblity.getConfigSets().filter(
      (config) => isEqualDate(configSet.startDate, config.startDate),
    );
    if (originalConfigs.length === 1) {
      return !isEqualDate(
        this.getConfigSetEndDate(configSet),
        originalEligiblity.getConfigSetEndDate(originalConfigs[0]),
      );
    }
    return true;
  }
}
