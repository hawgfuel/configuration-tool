/* eslint-disable import/extensions */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import { configuration as int } from './int-config';
import { configuration as prod } from './prod-config';
import { Configuration } from './config-type';

/**
 * Defines the config properties that are shared between environments
*/
export const configuration = {
  apiVersion: '1.0',
};

/**
 * Returns the configuration object according to enviornment
 * The sum of the properties of configuration+int AND configuration+prod should always
 * include all properties in the defined Configuration type
*/
const getConfiguration = () => {
  let config: Configuration;
  if (window.location.hostname === 'partner.microsoft.com') config = { ...configuration, ...prod };
  else config = { ...configuration, ...int };

  return config;
};

export { getConfiguration };
