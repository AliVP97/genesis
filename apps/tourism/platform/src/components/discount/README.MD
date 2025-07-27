# Discount Code

This project provides functionality for applying and removing discount codes. It
consists of React components, custom hooks, and integration with backend
services to manage discounts.

## Features

- Apply a discount code to an order.
- Remove an applied discount from an order.
- Display relevant messages (success, error) based on the status of the discount
  application.
- Handle loading, success, and error states when interacting with the backend
  API.

## Components

### Discount Component

The `Discount` component allows the user to enter a discount code, submit it,
and see the result. It shows:

- An input field for entering the discount code.
- A button to apply or remove the discount.
- A loading spinner while the discount is being applied or removed.
- Error or success messages based on the API response.

**Props**:

- `discountOrder`: The current discount order object.
- `submitHandler`: Handler for form submission (to apply or remove the
  discount).
- `changeHandler`: Handler for changes in the input field.
- `clearHandler`: Handler to clear any messages or states.
- `isLoading`: Boolean indicating whether the request is loading.
- `status` : Current status of the discount process (`idle`, `applied`, `error`, `removed`).
- `message`: Message to display (either success or error).

### Discount Data Structure

The `discount` object inside `discountOrder` contains:

- **`code`**: The discount code entered by the user (e.g., "SUMMER2024").
- **`amount`**: The discount amount applied to the order (e.g., 20 for a $20
  discount).
- **`hasError`**: A boolean that indicates whether there was an error when
  applying the discount (e.g., `true` if the discount code was invalid).
- **`message`**: A message that provides feedback to the user (e.g., "Discount
  applied successfully" or "Invalid discount code").

### useDiscount Hook

The `useDiscount` hook is responsible for managing the logic to apply or remove
a discount from an order.

**Arguments**:

- `discountOrder` : This object is used to track the current status of the
  discount, display feedback to the user, and handle error conditions during the
  discount application process.

- `refetchOrder`: Optional functionality is to re-fetch the order after the
  discount applied or removed. refetch is sent from usequery.

**Services**:

- `applyDiscountOnOrder`: This service function is used to apply a discount code
  to an order. It sends a request to the backend with the order's URL and the
  discount code.

- `removeDiscountFromOrder`: This service function is used to remove an applied
  discount from an order. It sends a request to the backend with the order's
  URL.

**Returns**:

- `submitHandler`: The function to handle form submission.
- `changeHandler`: The function to reset the form state.
- `clearHandler`: The function to clear any messages or states.
- `isLoading`: Boolean indicating whether the request is loading.
- `message`: Message to display (either success or error).
- `status`: Current status of the discount process (`idle`, `applied`, `error`, or `removed`).
- `isDisabledBtn`: Boolean indicating if the apply/remove button is disabled.

## Usage

### Example Usage in a Component

```tsx
const Invoice: FC<Props> = (
  {
    // ... props
  },
) => {
  const { orderData, refetch } = useGetOrder();

  // ... other code

  const discountOrder = {
    orderId: orderData?.orderId,
    discount: orderData?.payment?.discount,
    url: `hotel/v1/order/orderId/discount`,
  };

  const discountHandler = useDiscount(discountOrder, refetch);

  return (
    <div>
      {/* Render Order Details */}

      <Discount discountOrder={discountOrder} {...discountHandler} />

      {/* Render other components like Factor, PaymentMethods, etc. */}
    </div>
  );
};
```
