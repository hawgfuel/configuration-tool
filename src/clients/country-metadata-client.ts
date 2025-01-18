import { CountryMetadata } from '../models/country-metadata';
import { RewardsClient } from './rewards-client';

export class CountryMetadataClient extends RewardsClient {
  /**
   *
   * @returns
   */
  getCountryMetadata(): Promise<CountryMetadata[]> {
    return this.fetchData('/countries/metadata')
      .then((countries: any) => countries.value);
  }
}
