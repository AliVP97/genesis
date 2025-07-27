import { AddPassengerFields } from 'services/passenger/interface';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { isNationalCodeValid } from 'components/passenger/utils/isNationalCodeValid';

function safeRegex(pattern: string) {
  try {
    return new RegExp(pattern);
  } catch (error) {
    Sentry.captureException(error, { extra: { pattern } });
    console.error('Invalid regex pattern received:', error);
    return null;
  }
}
export const generateSchema = (fields: AddPassengerFields) => {
  const schema: { [key: string]: z.ZodTypeAny } = {};

  fields.forEach((field) => {
    let baseSchema: z.ZodString | z.ZodEffects<z.ZodString>;
    baseSchema = z
      .string({
        required_error: field.errorOnEmptyInput || `${field.title} ضروری است`,
      })
      .min(1, field.errorOnEmptyInput || `${field.title} ضروری است`);

    if (field.inputRegex) {
      const checkedRegex = safeRegex(field.inputRegex);
      if (checkedRegex) {
        baseSchema = baseSchema.regex(
          checkedRegex,
          field.errorOnRegex || `${field.title} صحیح نیست`,
        );
      }
    }

    if (field.id === 'nationalId') {
      baseSchema = baseSchema.refine((value) => isNationalCodeValid(value), {
        message: field.errorOnRegex || `${field.title} صحیح نیست`,
      });
    }

    // Make field optional if `isOptional` is true
    schema[field.id as string] = field.isOptional
      ? z.preprocess(
          (val) => (val === '' || val === null || val === undefined ? undefined : val),
          baseSchema.optional(),
        )
      : baseSchema;
  });

  return z.object(schema);
};
