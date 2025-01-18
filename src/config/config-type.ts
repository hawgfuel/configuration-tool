/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

/**
 * Defines the configurable properties of the application
*/
export type Configuration = {
  appInsightsInstrumentationKey: string;
  apiVersion: string;
  environment: Environment;
};

export enum Environment {
  Int = 'INT',
  Prod = 'PROD',
}
