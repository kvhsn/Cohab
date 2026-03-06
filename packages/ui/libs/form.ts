import { ValidationError } from '@tanstack/react-form';

/**
 * Formats TanStack Form validation errors into a single string for display.
 * Handles both string errors and Zod error objects with a 'message' property.
 */
export const formatErrors = (errors: ValidationError[] | undefined): string | undefined => {
  if (!errors || errors.length === 0) return undefined;

  return (errors[0] as Error).message;
};
