export const chain = (...fns) => (initial) => fns.reduce((prev, cur) => cur(prev), initial);
