// ============================================================
// Vex — Cross the line.
// Form Validation — Payload submission validation rules
// ============================================================

import type { PayloadCategory, InjectionContext, DifficultyLevel } from '@/types';

export interface SubmitFormData {
  payload: string;
  description: string;
  category: PayloadCategory | '';
  context: InjectionContext | '';
  difficulty: DifficultyLevel | '';
  tags: string[];
  wafBypass: string[];
  browsers: string[];
  contributor: string;
  githubUsername: string;
}

export interface ValidationError {
  field: keyof SubmitFormData;
  message: string;
}

export const INITIAL_FORM_DATA: SubmitFormData = {
  payload: '',
  description: '',
  category: '',
  context: '',
  difficulty: '',
  tags: [],
  wafBypass: [],
  browsers: ['chrome', 'firefox', 'safari', 'edge'],
  contributor: '',
  githubUsername: '',
};

/**
 * Validate the submission form and return errors.
 */
export function validateForm(data: SubmitFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required: payload
  if (!data.payload.trim()) {
    errors.push({ field: 'payload', message: 'Payload code is required' });
  } else if (data.payload.trim().length < 5) {
    errors.push({ field: 'payload', message: 'Payload must be at least 5 characters' });
  }

  // Required: description
  if (!data.description.trim()) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  }

  // Required: category
  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  // Required: context
  if (!data.context) {
    errors.push({ field: 'context', message: 'Injection context is required' });
  }

  // Required: difficulty
  if (!data.difficulty) {
    errors.push({ field: 'difficulty', message: 'Difficulty level is required' });
  }

  // Required: contributor
  if (!data.contributor.trim()) {
    errors.push({ field: 'contributor', message: 'Your name/handle is required' });
  }

  return errors;
}
