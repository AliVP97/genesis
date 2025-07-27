# Tab

This Tab is used when user sweeping between some contents to another.

## Component Props

| Prop Name | Type      | Description                             | Default Value |
| --------- | --------- | --------------------------------------- | ------------- |
| children  | ReactNode | The content to be displayed in the tab. | -             |
| label     | string    | The label of the tab.                   | -             |
| value     | string    | The value of the tab.                   | -             |

## Component Usage

For example here user can change tabs to see different contents.

```jsx
<>
  <Tab label="Tab 1" value="tab1" />
  <Tab label="Tab 2" value="tab2" />
</>
```

## Global States

| State Name | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| tabValue   | string | The value of the selected tab. |

## Global Actions

| Action Name | Type   | Description                    |
| ----------- | ------ | ------------------------------ |
| tabChanged  | string | The value of the selected tab. |
