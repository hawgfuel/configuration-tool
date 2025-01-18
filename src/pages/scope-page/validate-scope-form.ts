import { ScopeRequest } from '@partnerincentives/engagements-client';
import { endOfMonthDateString, startOfMonthDateString } from '../../utilities';

type ScopeFormData = {
  endDateInput: string;
  startDateInput: string;
} &
{ [k in keyof ScopeRequest]: string };

export const validateScopeForm = (formData: ScopeFormData, wasApproved: boolean) => {
  const errors: Partial<ScopeFormData> = {};
  const {
    name,
    startDate,
    startDateInput,
    endDate,
    endDateInput,
    visibleDate,
    solutionArea,
    partnerRole,
    description,
  } = formData;

  const start = new Date(startDate || 0);

  if (!name || name.length === 0 || name.replace(/\s+/g, '').length === 0) {
    errors.name = 'Name must not be empty';
  }
  if (name.length > 50) {
    errors.name = 'Name must be less than 50 characters long';
  }

  if (start < new Date() && !wasApproved) {
    errors.startDateInput = 'Date must be after today';
  }
  if (startDate && startDate !== startOfMonthDateString(startDateInput)) {
    errors.startDateInput = 'Date must be first day of month';
  }
  if (!startDate) {
    errors.startDateInput = 'Date must not be empty';
  }

  if (!endDate) {
    errors.endDateInput = 'Date must not be empty';
  }
  if ((new Date(endDate || 0) < new Date()) && !wasApproved) {
    errors.endDateInput = 'Date must be after today';
  }
  if (endDate && endDate !== endOfMonthDateString(endDateInput)) {
    errors.endDateInput = 'Date must be last day of month';
  }
  if (new Date(endDate || 0) <= new Date(startDate || 0)) {
    errors.endDateInput = 'End date must be after start date';
  }

  if (!visibleDate) {
    errors.visibleDate = 'Date must not be empty';
  }
  if (!startDate || new Date(visibleDate || 0) > new Date(startDate)) {
    errors.visibleDate = 'Visible date must be before or on start date';
  }

  if (!solutionArea) {
    errors.solutionArea = 'Solution area must be specified';
  }
  if (!partnerRole) {
    errors.partnerRole = 'Partner role must be specified';
  }

  if (!description || description.length === 0) {
    errors.description = 'Description must be provided';
  }
  return errors;
};
