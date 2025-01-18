export const accessViewError = "You don't have enough privileges to view this page";
export const accessManageError = "You don't have enough privileges to perform this action";

export const requirementNameError = 'Please enter requirement name';

export const requirementDescriptionError = 'Please enter requirement description';

export const configSetUpdateError = "Couldn't update the config set. Make sure your config set is "
  + 'editable and its start date is within the engagement duration.';

export const startDateError = "Invalid start date. Make sure it's the first date"
+ ' of the month and within engagement duration';

export const ceScopeUndefinedError = 'Configuration could not be loaded successfully. '
+ 'Scope configuration was not set for engagement.';

export const ceRuleValidationError = 'One or more config sets with the following start dates have '
+ 'invalid rules (remove some performance parameters or fill out the required fields):';
export const ceRequirementDetailValidationError = 'One or more config sets with the following '
+ 'start dates have invalid requirement details:';

export const clickOnSaveWarning = 'Please click on the save button.';

export const engagementEndDateMovedBackAlert = `The last config set's end date is 
  after engagement end date. ${clickOnSaveWarning}`;

export const engagementEndDateMovedForwardAlert = `The last config set's end date is 
  before engagement end date. ${clickOnSaveWarning}`;

export const engagementStartDateMovedBackAlert = `The last config set's start date is 
  after engagement end date. ${clickOnSaveWarning}`;

export const engagementStartDateMovedForwardAlert = `The last config set's start date is 
  before engagement end date. ${clickOnSaveWarning}`;

export const valueIsRequiredError = 'Value is required';

export const importCompleteLabel = 'Import complete';
