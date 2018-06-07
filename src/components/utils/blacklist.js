import { propTypes } from 'styled-system';

const allPropTypes = Object.keys(propTypes)
  .reduce((a, key) => Object.assign(a, propTypes[key]), {});

export default [
  ...Object.keys(allPropTypes),
  'transform',
  'transition',
  'overflow',
  'opacity',
  'alpha',
  'hoverColor',
  'hoverBg',
  'whiteSpace',
  'pointerEvents',
];
