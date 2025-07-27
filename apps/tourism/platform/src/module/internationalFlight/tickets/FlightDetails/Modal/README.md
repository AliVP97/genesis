# Modal

This component could show a modal on screen in specific size for example
fullscreen for mobile and tablet or large screens.

## Component Props

| Prop Name  | Type    | Description                            | Default Value |
| ---------- | ------- | -------------------------------------- | ------------- |
| size       | string  | The size of the modal                  | -             |
| className  | string  | The class name of the modal            | -             |
| fullScreen | boolean | Whether the modal should be fullscreen | false         |

## Component Usage

```jsx
<Modal size="large" className="my-modal" fullScreen={true}>
  <div>Modal Content</div>
  <button onClick={handleClose}>Close</button>
</Modal>
```

## LoaderModal

Show loader while fetching data in pwa version. This component is used to show a
loader that is included a modal and a image as a animated spinner.
