# Hook Introduction

## Hook Name

Use Element Width

## Hook Description

This hook is used to calculate the width of the element.

## Hook Parameters

This hook does not take any parameters.

## Hook Return Value

A `elementWidth` to determine width of the element while resize and a
`elementRef` to assign to the element.

## Hook Example

```tsx
const App = () => {
  const { elementRef, elementWidth } = useElementWidth();

  useEffect(() => {
    // do  something with elementWidth
  }, [elementWidth]);

  return <div ref={elementRef}></div>;
};
```
