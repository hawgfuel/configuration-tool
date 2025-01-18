/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

// eslint-disable-next-line import/extensions
import { Environment } from './config-type';

/**
 * Defines the configuration properties exclusive to prod environment
*/
export const configuration = {
  appInsightsInstrumentationKey: '586810a1-5de5-42bd-a99b-70e15a5816b8',
  environment: Environment.Prod,
};
