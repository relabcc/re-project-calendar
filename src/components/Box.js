import React from 'react';
import styled from 'styled-components';
import tag from 'clean-tag';
import {
  responsiveStyle,
  space,
  width,
  display,
  textAlign,
  height,
  top,
  left,
  right,
  bottom,
  position,
  style,
  color,
  fontSize,
  fontWeight,
  borderRadius,
  border,
  borderTop,
  borderBottom,
  borderLeft,
  borderRight,
  borderColor,
  flex,
  maxHeight,
} from 'styled-system';

const injectTransform = responsiveStyle({
  prop: 'transform',
  cssProperty: 'transform',
});

const injectVerticalAlign = responsiveStyle({
  prop: 'verticalAlign',
  cssProperty: 'verticalAlign',
});

const injectTransition = responsiveStyle({
  prop: 'transition',
  cssProperty: 'transition',
});

const injectOpacity = style({
  prop: 'opacity',
  cssProperty: 'opacity',
  alias: 'alpha',
});

const zIndex = style({
  prop: 'zIndex',
  cssProperty: 'zIndex',
  alias: 'z',
});

const Box = styled(tag)`
  ${space}
  ${width}
  ${display}
  ${height}
  ${color}
  ${fontSize}
  ${position}
  ${zIndex}
  ${injectTransform}
  ${injectTransition}
  ${injectOpacity}
  ${textAlign}
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${fontWeight}
  ${borderRadius}
  ${injectVerticalAlign}
  ${border}
  ${borderTop}
  ${borderBottom}
  ${borderLeft}
  ${borderRight}
  ${borderColor}
  ${flex}
  ${maxHeight}
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

Box.inline = (props) => <Box is="span" display="inline-block" verticalAlign="middle" {...props} />;

export default Box;
