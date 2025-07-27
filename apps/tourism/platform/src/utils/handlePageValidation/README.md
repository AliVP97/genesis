# Handle Page Validation

A utility to validate page params and query string. While the page params are
validated against the page schema, the query string is validated against the
query schema.

Also this utility can used to normalize invalid date and other params.

## Arguments

| Argument     | Type                                            | Description                                       |
| ------------ | ----------------------------------------------- | ------------------------------------------------- |
| `context`    | GetServerSidePropsContext                       | The context object.                               |
| `validators` | ServerSideValidatorWithContext<Query, Params>[] | An array of validators to be used for validation. |

## Type Definitions

### HandlePageValidationOptions

| Property      | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `redirectUrl` | string | The URL to redirect to if the validation fails. |

### ServerSideValidatorWithContext

Interface representing a server-side validator with context.

| `validators` | ServerSideValidatorWithContext<Query, Params>[] | An array of
validators to be used for validation. |

### ServerSideValidatorWithContext

Interface representing a server-side validator with context.

| Property  | Type                      | Description                        |
| --------- | ------------------------- | ---------------------------------- |
| `query`   | Query                     | The query object to be validated.  |
| `params`  | Params                    | The params object to be validated. |
| `context` | GetServerSidePropsContext | The context object.                |

### Validator type

## Return Value

| Property   | Type                     | Description                                                                         |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `isValid`  | boolean                  | A boolean value indicating whether the validation was successful.                   |
| `response` | GetServerSidePropsResult | The response object to be returned to redirect user to home page or normalize data. |

## Available Validators

### ValidateDateRange

| Arguments  | Type   | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| `startKey` | string | The name of the date field to be validated. |
| `endKey`   | string | The name of the date field to be validated. |

## Usage

### Simple Usage with getServerSideProps

```ts
import handlePageValidation, { validateDateRange } from '@/utils/handlePageValidation';

export const getServerSideProps = (context) => {
  const { isValid, response } = await handlePageValidation(context, [
    validateDateRange('departureDate', 'returningDate'),
  ]);

  if (!isValid) {
    return response;
  }
};
```

### Usage with some validators

```ts
import handlePageValidation, { validateDateRange, validate } from '@/utils/handlePageValidation';

const { isValid, response } = await handlePageValidation(context, [
  validateParamsIata('id'),
  validateQuerySchema(internationalFlightQuerySchema),
  validateDateRange('departureDate', 'returningDate'),
]);
```

### Usage with custom validators

```ts
import handlePageValidation from '@/utils/handlePageValidation';
import internationalFlightQuerySchema from 'path-to-module';

// A type
type SearchQuery = {
  child: string;
};

// Create a custom validator and with a normalize query string.
const customValidate: ServerSideValidator<string> = (value) => {
  if (value.length === 1) {
    return { isValid: true };
  }

  return {
    isValid: false,
    correctQuery: { child: 1 },
  };
};

// Using the custom validator in code
const { isValid, response } = await handlePageValidation<SearchQuery>(context, [
  // narrowing access to child from query child
  (context) => customValidate(context.query.child),
]);
```

### Usage query and params together

```ts
type SearchQuery = {
  child: string;
  departureDate: string;
};

type SearchParams = {
  id: string;
};

const { isValid, response } = await handlePageValidation<
  SearchQuery,
  // using search params to access the property inside validators array
  SearchParams
>(context, [
  // narrowing access to child from query child
  (context) => customValidate(context.params.id),
]);
```
