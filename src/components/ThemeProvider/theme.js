import merge from 'lodash/merge';
import range from 'lodash/range';

import constants from 'styled-system/dist/constants';
// import colors from 'open-color/open-color.json';

const emToPx = (em) => em * 16;

export const breakpoints = [36, 48, 62, 90, 120].map(emToPx);
export const containerWidth = [36, 46, 58].map(emToPx);

const generateFade = (r, g, b) => range(10, 100, 10)
  .reduce((fade, opacity) => merge(fade, { [opacity]: `rgba(${[r, g, b, opacity / 100].join()})` }), {});

const font = 'sans-serif';

const white = '#fff';
const black = '#000';
const lightGray = '#DEDFDF';
const gray = '#95989A';
const blue = '#89CBE1';
const cyan = '#27C1AE';
const darkBlue = '#3A494F';
const darkRed = '#934947';
const orange = '#FFB048';

export default merge(constants, {
  colors: {
    white,
    black,
    text: darkBlue,
    primary: orange,
    secondary: darkRed,
    lightGray,
    gray,
    blue,
    cyan,
    darkRed,
    orange,
    fade: {
      white: generateFade(255, 255, 255),
      black: generateFade(0, 0, 0),
    },
  },
  breakpoints,
  containerWidth,
  font,
  duration: 250,
});
