# Module Introduction

## Module Name

Banner Container

## Module Description

This module is responsible for displaying a banner container on the
international flight page. It displays a banner container within a specific
index on the page.

---

## Components

### Component Name

Banner Container

### Component Description

BannerContainer is a component that displays a banner container within a search
list.

### Component Parameters

| Parameter Name | Parameter Type | Parameter Description                                                     |
| -------------- | -------------- | ------------------------------------------------------------------------- |
| banners        | `Banner[]`     | An array of `Banner` objects, or `undefined` if no banners are available. |

### Component Example

```tsx
const App = () => {
  const banner: Banner[] = [
    /* banner data */
  ];

  return <BannerContainer data={banners} />;
};
```

---

### Component Name

Banner Image

### Component Description

BannerImage is a component that displays an image banner.

### Component Parameters

| Parameter Name | Parameter Type | Parameter Description                      |
| -------------- | -------------- | ------------------------------------------ |
| src            | `string`       | The source URL of the banner image.        |
| alt            | `string`       | The alternative text for the banner image. |
| height         | `string`       | The height of the banner image.            |
| width          | `string`       | The width of the banner image.             |

### Component Example

```tsx
const App = () => {
  const imageData[] = [
    src: "https://example.com/image.jpg",
    alt: "Example Image",
    height: "100px",
    width: "200px",
  ];

  return <BannerImage src={imageData.src} alt={imageData.alt} height={imageData.height} width={imageData.width} />;
};
```
