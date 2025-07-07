import lm from './localizationManager';

export const requiredInput = (input: string): boolean | string => {
  if (input.trim() === '') {
    return lm.get('errors.validation.required');
  }
  return true;
};