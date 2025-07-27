# SubmitButton

This button is responsible for submitting buying a ticket and go to the payment
page.

## Component Props

| Prop Name | Type | Description                                           | Default Value |
| --------- | ---- | ----------------------------------------------------- | ------------- |
| disabled  | bool | The disabled state of the button.                     | false         |
| onClick   | func | The function to be called when the button is clicked. | -             |

## Component Usages

For example here user can click the button to submit the form.

```jsx
<SubmitButton onClick={() => {}} />
```

## Global States

| State Name | Type   | Description                   |
| ---------- | ------ | ----------------------------- |
| requestId  | string | The request id of the ticket. |
| itinerary  | object | The itinerary of the ticket.  |

## Global Actions

| Action Name | Type   | Description                   |
| ----------- | ------ | ----------------------------- |
| submit      | string | The request id of the ticket. |
