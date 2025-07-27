# Url validation approach

Using this approach after validation url is going to approved by the seo and
chapters.

```tsx
const validationResult = handlePageValidation(context, [
  validateParamsIata('id'),
  validateQuerySchema(internationalFlightQuerySchema),
  validateDateRange('departureDate', 'returningDate'),
]);

if (!validationResult.isValid) {
  return validationResult.response;
}
```
