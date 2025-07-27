# useBreakpoint

A hook to get the current breakpoint between xss, xs, sm, md, lg, xl, xxl.

## Arguments

| Argument         | Type     | Description                 |
| ---------------- | -------- | --------------------------- |
| `matcherFactory` | `object` | The matcher factory to use. |

## Matcher Factory

A factory to create a matcher. The matcher is used to determine the current
breakpoint.

| Argument | Type     | Description                                          |
| -------- | -------- | ---------------------------------------------------- |
| `width`  | `number` | The width of the current breakpoint. This is used to |

determine the current breakpoint.

## Breakpoints

| Breakpoint | Width | Description                |
| ---------- | ----- | -------------------------- |
| xss        | 360   | iPhone SE or small devices |
| xs         | 576   | Small devices              |
| sm         | 768   | Medium devices             |
| md         | 992   | Large devices              |
| lg         | 1200  | Extra large devices        |
| xl         | 1400  | Extra extra large devices  |

## Return Value

| Type     | Description                                                                         |
| -------- | ----------------------------------------------------------------------------------- |
| `string` | The current breakpoint. This is one of the following: xss, xs, sm, md, lg, xl, xxl. |

## Example

```jsx
import { useBreakpoint } from '@international-flight/tickets';

const Component = () => {
  const smallMobileDevices = useBreakpoint((breakpoint) => breakpoint.down('xss'));
  const tabletOrSmaller = useBreakpoint((breakpoint) => breakpoint.down('xss'));
  const desktopOrLarger = useBreakpoint((breakpoint) => breakpoint.up('md'));
  const betweenXsAndLg = useBreakpoint((breakpoint) => breakpoint.between('xs', 'lg'));

  if (smallMobileDevices) {
    return <div>small mobile devices</div>;
  }

  if (tabletOrSmaller) {
    return <div>tablet or smaller</div>;
  }

  if (desktopOrLarger) {
    return <div>desktop or larger</div>;
  }

  if (betweenXsAndLg) {
    return <div>between xs and lg</div>;
  }

  return null;
};
```
