export declare enum EngagementStatus {
  Unknown = 'Unknown',
  SameAsItWasBeforeTheAction = 'SameAsItWasBeforeTheAction',
  Draft = 'Draft',
  Submitted = 'Submitted',
  Approved = 'Approved',
  Rejected = 'Rejected',
  MicrosoftActionRequired = 'MicrosoftActionRequired',
}
export declare enum SolutionArea {
  Unknown = 'Unknown',
  Azure = 'Azure',
  ModernWorkAndSecurity = 'ModernWorkAndSecurity',
  BusinessApplications = 'BusinessApplications',
}
export declare enum BuildIntentType {
  Unknown = 'Unknown',
  OneToOne = 'OneToOne',
}
export declare enum PartnerRole {
  Unknown = 'Unknown',
  BuildIntent = 'BuildIntent',
  Transact = 'Transact',
  DeployAndManage = 'DeployAndManage',
}
export declare enum AssociationType {
  Unknown = 'Unknown',
  CPOR = 'CPOR',
  PAL = 'PAL',
}
export declare enum EngagementUserRight {
  CanView = 'CanView',
  CanManage = 'CanManage',
  CanApprove = 'CanApprove',
}
export declare enum FlightType {
  Unknown = 'Unknown',
  Experience = 'Experience',
}
export declare type Offering = {
  offeringId: string;
  offeringGuid: string;
};

export declare type EngagementComponentResponseTest<T> = {
  component: T;
  metadata: EngagementUXMetadata;
};
export declare type EngagementUXMetadata = {
  state: EngagementStatus;
  programGuid: string;
  id: string;
  version: number;
  startDate: Date;
  endDate: Date;
  approvedVersions: number[];
  solutionArea: SolutionArea;
  partnerRole: PartnerRole;
  associationType: AssociationType;
  buildIntentType?: BuildIntentType;
};
export declare type EngagementUserPrivileges = {
  rights: EngagementUserRight[];
};
export {};
