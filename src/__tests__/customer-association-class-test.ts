/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
*/

import {
  addDays,
  addMonths,
  addYears,
  getYear,
  setYear,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { toEndOfUtcDay } from '../utilities/date-utilities';
import {
  customerAssociationResponse1ConfigSet,
  customerAssociationResponseNoConfigSets,
  customerAssociationResponse2ConfigSet,
} from '../clients/mocks/customer-association-mock-data';
import { deepCopy } from '../utilities/converter-utils';
import { CustomerAssociation } from '../classes/customer-association-class';

const endOfPreviousDay = (date: Date) => (
  toEndOfUtcDay(subDays(date, 1))
);

describe('Test CustomerAssociation Class', () => {
  const dateNow = () => Date.now();
  const realDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    const dateNowStub = jest.fn(() => new Date('2020-08-15T00:00:00Z').valueOf());
    global.Date.now = dateNowStub;

    expect(dateNow()).toBe(new Date('2020-08-15').valueOf());
    expect(dateNowStub).toHaveBeenCalled();
  });

  afterEach(() => {
    global.Date.now = realDateNow;
  });

  it('Creates a CustomerAssociation object with existing config set', () => {
    const customerAssociation = new CustomerAssociation(customerAssociationResponse1ConfigSet);
    expect(customerAssociation.getConfigSets()[0].startDate)
      .toStrictEqual(new Date(
        customerAssociationResponse1ConfigSet?.component?.configSets[0].startDate,
      ));
    expect(customerAssociation.getConfigSets()[0].id)
      .toStrictEqual(customerAssociationResponse1ConfigSet
        .component.configSets[0].id);
  });

  it('Creates a CustomerAssociation object with no existing config set', () => {
    const customerAssociation = new CustomerAssociation(customerAssociationResponseNoConfigSets);
    expect(customerAssociation.getConfigSets().length)
      .toBe(1);
  });

  it('Shows Available Dates correctly for future engagements', () => {
    const nextYear = getYear(addYears(new Date(), 1));

    const customerAssociation = new CustomerAssociation(customerAssociationResponse2ConfigSet);

    const nonEditDate = new Date(
      customerAssociationResponse2ConfigSet.component.configSets[0].startDate,
    );
    const nonEditDate2 = new Date(
      customerAssociationResponse2ConfigSet.component.configSets[1].startDate,
    );

    //  Dates not currently used in mock data
    const editDate = setYear(new Date('2020-02-01'), nextYear);
    const editDate2 = setYear(new Date('2020-04-01'), nextYear);
    const editDate3 = setYear(new Date('2020-05-01'), nextYear);

    //  Dates equal to current configurations are non-editable
    expect(customerAssociation.isDateAvailable(nonEditDate)).toBe(false);
    expect(customerAssociation.isDateAvailable(nonEditDate2)).toBe(false);
    //  Dates in the future, and not currently picked are editable
    expect(customerAssociation.isDateAvailable(editDate)).toBe(true);
    expect(customerAssociation.isDateAvailable(editDate2)).toBe(true);
    expect(customerAssociation.isDateAvailable(editDate3)).toBe(true);
  });

  it('Shows Available Dates correctly for current engagements', () => {
    //  Override mock to use current year dates for testing
    const updatedMock = deepCopy(customerAssociationResponse2ConfigSet);
    const currentYear = getYear(new Date());
    updatedMock.metadata.startDate = setYear(new Date('2020-01-02'), currentYear);
    updatedMock.metadata.endDate = setYear(new Date('2020-12-31'), currentYear + 1);
    updatedMock.component.configSets[0]
      .startDate = updatedMock.metadata.startDate.toISOString();
    updatedMock.component.configSets[1]
      .startDate = setYear(addDays(new Date(), 14), currentYear).toISOString();

    const customerAssociation = new CustomerAssociation(updatedMock);

    const dateInFuture = setYear(startOfMonth(addDays(dateNow(), 31)), currentYear);
    const dupedDateInFuture = new Date(updatedMock.component.configSets[1].startDate);
    const dateInPast = setYear(subDays(new Date(), 1), currentYear);
    //  Dates in the past are non-editable
    expect(customerAssociation.isDateAvailable(dateInPast)).toStrictEqual(false);
    //  Dates in the future, not currently picked are editable
    // This test could fail on days 15 or 16 of each month,
    // Adjust updatedMock.component.configSets[1] addDays value accordingly
    expect(customerAssociation.isDateAvailable(dateInFuture)).toStrictEqual(true);
    //  Dates in the future, currently picked are non-editable
    expect(customerAssociation.isDateAvailable(dupedDateInFuture)).toStrictEqual(false);
  });
});

it('Can Add Config Set', () => {
  const nextYear = getYear(addYears(new Date(), 1));
  const customerAssociation = new CustomerAssociation(customerAssociationResponseNoConfigSets);
  customerAssociation
    .addConfigSet(setYear(new Date('2021-03-01T00:00:00Z'), nextYear));
  customerAssociation
    .addConfigSet(setYear(new Date('2021-05-01T00:00:00Z'), nextYear));
  const configSets = customerAssociation
    .addConfigSet(setYear(new Date('2021-07-01T00:00:00Z'), nextYear));

  expect(customerAssociation.getConfigSets().length).toBe(4);
  expect(customerAssociation.getConfigSets()[0].startDate)
    .toStrictEqual(customerAssociationResponseNoConfigSets.metadata.startDate);
  expect(customerAssociation.getConfigSets()[1].startDate)
    .toStrictEqual(setYear(new Date('2021-03-01T00:00:00Z'), nextYear));
  expect(customerAssociation.getConfigSets()[2].startDate)
    .toStrictEqual(setYear(new Date('2021-05-01T00:00:00Z'), nextYear));
  expect(customerAssociation.getConfigSets()[3].startDate)
    .toStrictEqual(setYear(new Date('2021-07-01T00:00:00Z'), nextYear));
  expect(customerAssociation.getConfigSets()).toStrictEqual(configSets);
});

it('Cant add config set outside of engagement or duplicating dates', () => {
  //  Override mock to use next year dates for testing
  const updatedMock = deepCopy(customerAssociationResponseNoConfigSets);
  const nextYear = getYear(addYears(new Date(), 1));
  const thisYear = getYear(new Date());
  const twoYAhead = getYear(addYears(new Date(), 2));
  updatedMock.metadata.startDate = setYear(new Date('2020-01-02'), nextYear);
  updatedMock.metadata.endDate = setYear(new Date('2020-12-31'), nextYear);

  const customerAssociation = new CustomerAssociation(updatedMock);
  expect(customerAssociation.getConfigSets().length).toBe(1);

  customerAssociation
    .addConfigSet(setYear(new Date('2021-03-01T00:00:00Z'), thisYear));
  expect(customerAssociation.getConfigSets().length).toBe(1);

  customerAssociation
    .addConfigSet(setYear(new Date('2021-05-01T00:00:00Z'), twoYAhead));
  expect(customerAssociation.getConfigSets().length).toBe(1);

  customerAssociation
    .addConfigSet(setYear(new Date('2021-07-01T00:00:00Z'), nextYear));
  expect(customerAssociation.getConfigSets().length).toBe(2);

  const configSets = customerAssociation
    .addConfigSet(setYear(new Date('2021-07-01T00:00:00Z'), nextYear));
  expect(customerAssociation.getConfigSets().length).toBe(2);

  expect(customerAssociation.getConfigSets()).toStrictEqual(configSets);
});

it('Can clone config set', () => {
  const nextYear = getYear(addYears(new Date(), 1));

  const customerAssociation = new CustomerAssociation(customerAssociationResponse1ConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(1);

  const currentConfigSet = customerAssociation.getConfigSets()[0];
  customerAssociation
    .cloneConfigSet(setYear(new Date('2020-02-29'), nextYear), currentConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(2);
  expect(customerAssociation.getConfigSets()[1].startDate)
    .toStrictEqual(setYear(new Date('2020-02-29'), nextYear));
  //  shouldnt allow to clone into an invalid date (already occupied)
  customerAssociation
    .cloneConfigSet(setYear(new Date('2020-02-29'), nextYear), currentConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(2);
});

it('Can delete config set', () => {
  const customerAssociation = new CustomerAssociation(customerAssociationResponse2ConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(2);

  //  Should not delete first configSet
  const deletedConfigSet = customerAssociation.getConfigSets()[0];
  customerAssociation
    .deleteConfigSet(deletedConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(2);

  const deletedConfigSet2 = customerAssociation.getConfigSets()[1];
  customerAssociation
    .deleteConfigSet(deletedConfigSet2);
  expect(customerAssociation.getConfigSets().length).toBe(1);
});

it('Can edit config set', () => {
  const nextYear = getYear(addYears(new Date(), 1));

  const customerAssociation = new CustomerAssociation(customerAssociationResponse2ConfigSet);
  expect(customerAssociation.getConfigSets().length).toBe(2);

  const editedConfigSet = customerAssociation.getConfigSets()[1];
  editedConfigSet.startDate = setYear(new Date('2020-05-01'), nextYear);
  expect(customerAssociation.getConfigSets()[1].startDate)
    .toStrictEqual(setYear(new Date('2020-05-01'), nextYear));
});

it('Can provide proper end dates', () => {
  const nextYear = getYear(addYears(new Date(), 1));

  const customerAssociation = new CustomerAssociation(customerAssociationResponseNoConfigSets);

  customerAssociation
    .addConfigSet(setYear(new Date('2021-03-01T00:00:00Z'), nextYear));

  customerAssociation
    .addConfigSet(setYear(new Date('2021-05-01T00:00:00Z'), nextYear));

  customerAssociation
    .addConfigSet(setYear(new Date('2021-07-01T00:00:00Z'), nextYear));

  const configSets = customerAssociation
    .addConfigSet(setYear(new Date('2021-10-01T00:00:00Z'), nextYear));

  expect(customerAssociation
    .getConfigSetEndDate(configSets[0]))
    .toStrictEqual(endOfPreviousDay(configSets[1].startDate));
  expect(customerAssociation
    .getConfigSetEndDate(configSets[1]))
    .toStrictEqual(endOfPreviousDay(configSets[2].startDate));
  expect(customerAssociation
    .getConfigSetEndDate(configSets[2]))
    .toStrictEqual(endOfPreviousDay(configSets[3].startDate));
  expect(customerAssociation
    .getConfigSetEndDate(configSets[3]))
    .toStrictEqual(endOfPreviousDay(configSets[4].startDate));
  expect(customerAssociation
    .getConfigSetEndDate(configSets[4]))
    .toStrictEqual(customerAssociationResponseNoConfigSets.metadata.endDate);
});

it('Can return non-editable configSets', () => {
  //  Override mock to use current year dates for testing
  const updatedMock = deepCopy(customerAssociationResponseNoConfigSets);
  updatedMock.metadata.startDate = subMonths(new Date(), 3);
  updatedMock.metadata.endDate = addMonths(new Date(), 3);

  const customerAssociation = new CustomerAssociation(updatedMock);

  const dateInFuture = addMonths(startOfMonth(Date.now()), 1);
  const dateInFuture2 = addMonths(startOfMonth(Date.now()), 2);

  customerAssociation
    .addConfigSet(dateInFuture);
  customerAssociation
    .addConfigSet(dateInFuture2);

  expect(customerAssociation.getConfigSets().length).toBe(3);
  expect(customerAssociation.getNonEditConfigSets().length).toBe(1);
  expect(customerAssociation.getEditConfigSets().length).toBe(3);
});
