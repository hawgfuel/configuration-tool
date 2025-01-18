import { Offering } from '@partnerincentives/engagements-client';

type ProgramList = Offering & {
  friendlyName: string
};

export const engagementPrograms: ProgramList[] = [
  {
    friendlyName: 'Microsoft Commerce Incentive',
    offeringId: 'azurePalPoc',
    offeringGuid: 'e32e24c2-d9c5-4ef2-baba-5b622dfca7e0',
  },
];
