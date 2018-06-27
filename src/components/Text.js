import React from 'react';
import styled from 'styled-components';
import range from 'lodash/range';
import {
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  space,
  color,
  display,
  textAlign,
  margin,
  position,
  letterSpacing,
} from 'styled-system';
import tag from 'clean-tag';

import blacklist from './utils/blacklist';

const Text = styled(tag)`
  margin-top: 0;
  margin-bottom: 0;
  ${fontFamily}
  ${display}
  ${fontSize}
  ${space}
  ${color}
  ${textAlign}
  ${fontWeight}
  ${lineHeight}
  ${margin}
  ${letterSpacing}
  ${position}
`;

Text.defaultProps = {
  is: 'p',
  f: '1em',
  lineHeight: 1.5,
  blacklist,
};

Text.bold = (props) => <Text.span fontWeight="bold" {...props} />;
Text.tetsuBin = (props) => <Text fontFamily="TetsuBin Gothic, sans-serif" {...props} />;

range(1, 7).forEach((key) => {
  const h = `h${key}`;
  Text[h] = (props) => (
    <Text
      is={h}
      f={`${1 + ((6 - key) * 0.125)}em`}
      {...props}
    />
  );
});

export default Text;
