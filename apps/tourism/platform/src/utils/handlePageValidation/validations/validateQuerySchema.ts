import { z } from 'zod';
import {
  ServerSideContext,
  ServerSideValidatorWithContext,
  ServerSideValidator,
} from '../types/common';
import excludeParamsKeys from '../utils/extractQueryKeys';

type ValidateWithoutContextArguments = {
  schema: z.AnyZodObject;
  query: Record<string, string>;
};

/**
 * Validates a query object against a provided schema and returns the validation result.
 *
 * @param {Object} params - The validation parameters.
 * @param {z.AnyZodObject} params.schema - The Zod schema used to validate the query.
 * @param {Record<string, string>} params.query - The query object to be validated.
 * @returns {Object} Validation result with `isValid` flag and optionally a corrected query.
 *
 * @example
 * const schema = z.object({
 *   departureDate: z.string(),
 *   returnDate: z.string().optional(),
 * });
 *
 * const result = validateWithoutContext({ schema, query: req.query });
 *
 * if (!result.isValid) {
 *   console.error("Invalid query parameters");
 * }
 */
const validateWithoutContext: ServerSideValidator<ValidateWithoutContextArguments> = ({
  schema,
  query,
}) => {
  const { data, success } = schema.safeParse(query);

  if (!success) {
    return { isValid: false };
  }

  return { isValid: true, correctQuery: data };
};

const validateQuerySchema =
  (schema: z.AnyZodObject): ServerSideValidatorWithContext =>
  (context: ServerSideContext) =>
    validateWithoutContext({
      schema,
      query: excludeParamsKeys(context.query, context.params),
    });

export default validateQuerySchema;
