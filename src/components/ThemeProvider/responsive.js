import { css } from 'styled-components';
import { breakpoints } from './theme';

const sizes = [
  'xs',
  'sm',
  'md',
  'lg',
];

// iterate through the sizes and create a media template
export default breakpoints.reduce((accumulator, size, index) => Object.assign(accumulator, {
  [sizes[index]]: (...args) => css`
    @media (min-width: ${size}px) {
      ${css(...args)}
    }
  `,
}), {});
