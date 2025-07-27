export function smoothScrollTo(element = document.documentElement, to = 0, duration = 300) {
  const start = element?.scrollTop,
    change = to - start,
    increment = 20;
  let currentTime = 0;
  const animateScroll = function () {
    currentTime += increment;
    element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration

// @ts-ignore
const easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
